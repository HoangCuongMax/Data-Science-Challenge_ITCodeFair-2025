document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currentTab = tabs[0];
        var actionButton = document.getElementById('actionButton');
        var downloadCsvButton = document.getElementById('downloadCsvButton');
        var resultsTable = document.getElementById('resultsTable');
        var filenameInput = document.getElementById('filenameInput');

        // Enable button always, since we fetch independently
        actionButton.disabled = false;
        actionButton.classList.add('enabled');

        actionButton.addEventListener('click', function() {
            var subreddit = document.getElementById('subredditSelect').value;
            var query = document.getElementById('queryInput').value.trim();

            chrome.scripting.executeScript({
                target: {tabId: currentTab.id},
                func: scrapeData,
                args: [subreddit, query]
            }, function(results) {
                while (resultsTable.firstChild) {
                    resultsTable.removeChild(resultsTable.firstChild);
                }

                // Define and add headers to the table
                const headers = ['Subreddit', 'Post Title', 'Post Author', 'Post Score', 'Post Date', 'Comment Author', 'Comment Score', 'Comment Date', 'Comment Text'];
                const headerRow = document.createElement('tr');
                headers.forEach(headerText => {
                    const header = document.createElement('th');
                    header.textContent = headerText;
                    headerRow.appendChild(header);
                });
                resultsTable.appendChild(headerRow);

                // Add new results to the table
                if (!results || !results[0] || !results[0].result) return;
                results[0].result.forEach(function(item) {
                    var row = document.createElement('tr');
                    ['subreddit', 'post_title', 'post_author', 'post_score', 'post_date', 'comment_author', 'comment_score', 'comment_date', 'comment_text'].forEach(function(key) {
                        var cell = document.createElement('td');
                        cell.textContent = item[key] || ''; 
                        row.appendChild(cell);
                    });
                    resultsTable.appendChild(row);
                });

                if (results && results[0] && results[0].result && results[0].result.length > 0) {
                    downloadCsvButton.disabled = false;
                }
            });
        });

        downloadCsvButton.addEventListener('click', function() {
            var csv = tableToCsv(resultsTable); 
            var filename = filenameInput.value.trim();
            if (!filename) {
                filename = 'reddit-subreddit-comments.csv'; 
            } else {
                filename = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.csv';
            }
            downloadCsv(csv, filename); 
        });

    });
});


async function scrapeData(subreddit, query) {
    const searchUrl = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&restrict_sr=on&sort=top&t=all&limit=25`;
    const response = await fetch(searchUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const json = await response.json();

    if (!json.data || !json.data.children) return [];

    const cutoffTimestamp = (Date.now() / 1000) - (3 * 365 * 24 * 3600); // 3 years ago in seconds

    let allComments = [];

    for (let child of json.data.children) {
        const postData = child.data;
        if (postData.created_utc < cutoffTimestamp) continue; // Skip old posts

        const postUrl = `https://www.reddit.com${postData.permalink}.json?limit=500`;
        const postResponse = await fetch(postUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const postJson = await postResponse.json();

        if (postJson.length < 2) continue;

        const postDetails = postJson[0].data.children[0].data;
        const commentsListing = postJson[1].data.children;

        function extractComments(comments, accumulated = []) {
            for (let comm of comments) {
                const data = comm.data;
                if (data.created < cutoffTimestamp) continue; // Skip old comments

                if (data.author && data.body) {
                    accumulated.push({
                        subreddit: subreddit,
                        post_title: postDetails.title,
                        post_author: postDetails.author,
                        post_score: postDetails.score,
                        post_date: new Date(postDetails.created_utc * 1000).toISOString(),
                        comment_author: data.author,
                        comment_score: data.score,
                        comment_date: new Date(data.created * 1000).toISOString(),
                        comment_text: data.body
                    });
                }
                if (data.replies && data.replies.data && data.replies.data.children) {
                    extractComments(data.replies.data.children, accumulated);
                }
            }
            return accumulated;
        }

        const postComments = extractComments(commentsListing);
        allComments = allComments.concat(postComments);
    }

    return allComments;
}

// Convert the table to a CSV string
function tableToCsv(table) {
    var csv = [];
    var rows = table.querySelectorAll('tr');
    
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll('td, th');
        
        for (var j = 0; j < cols.length; j++) {
            row.push('"' + cols[j].innerText.replace(/"/g, '""') + '"');
        }
        csv.push(row.join(','));
    }
    return csv.join('\n');
}

// Download the CSV file
function downloadCsv(csv, filename) {
    var csvFile;
    var downloadLink;

    csvFile = new Blob([csv], {type: 'text/csv'});
    downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
}