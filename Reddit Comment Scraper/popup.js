document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currentTab = tabs[0];
        var actionButton = document.getElementById('actionButton');
        var downloadCsvButton = document.getElementById('downloadCsvButton');
        var resultsTable = document.getElementById('resultsTable');
        var filenameInput = document.getElementById('filenameInput');
        var url = currentTab.url;

        if (url.includes("old.reddit.com") && url.includes("/comments/")) {
            document.getElementById('message').textContent = "Let's scrape Reddit Comments!";
            actionButton.disabled = false;
            actionButton.classList.add('enabled');
        } else if (url.includes("www.reddit.com") && url.includes("/comments/")) {
            var messageElement = document.getElementById('message');
            messageElement.innerHTML = '';
            var oldUrl = url.replace("www.reddit.com", "old.reddit.com");
            var linkElement = document.createElement('a');
            linkElement.href = oldUrl;
            linkElement.textContent = "Go to old.reddit.com version for scraping.";
            linkElement.target = '_blank'; 
            messageElement.appendChild(linkElement);

            actionButton.style.display = 'none'; 
            downloadCsvButton.style.display = 'none';
            filenameInput.style.display = 'none'; 
        } else {
            var messageElement = document.getElementById('message');
            messageElement.innerHTML = '';
            var linkElement = document.createElement('a');
            linkElement.href = 'https://old.reddit.com/';
            linkElement.textContent = "Go to an old.reddit.com comments page.";
            linkElement.target = '_blank'; 
            messageElement.appendChild(linkElement);

            actionButton.style.display = 'none'; 
            downloadCsvButton.style.display = 'none';
            filenameInput.style.display = 'none'; 
        }

        actionButton.addEventListener('click', function() {
            chrome.scripting.executeScript({
                target: {tabId: currentTab.id},
                function: scrapeData
            }, function(results) {
                while (resultsTable.firstChild) {
                    resultsTable.removeChild(resultsTable.firstChild);
                }

                // Define and add headers to the table
                const headers = ['Author', 'Score', 'Date', 'Comment Text'];
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
                    ['author', 'score', 'date', 'text'].forEach(function(key) {
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
                filename = 'reddit-comments.csv'; 
            } else {
                filename = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.csv';
            }
            downloadCsv(csv, filename); 
        });

    });
});


async function scrapeData() {
    // Load all comments by clicking "load more" and "continue thread"
    async function loadAllComments() {
        while (true) {
            const moreLinks = document.querySelectorAll('.morecomments a, .deepthread a');
            if (moreLinks.length === 0) break;
            for (let link of moreLinks) {
                link.click();
            }
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for content to load
        }
    }

    await loadAllComments();

    // Now extract and filter comments
    var containers = Array.from(document.querySelectorAll('.thing.comment'));
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 3);

    // Filter containers to only include comments from the last 3 years
    containers = containers.filter(container => {
        const timeElem = container.querySelector('time');
        if (!timeElem) return false;
        const dateStr = timeElem.getAttribute('title');
        if (!dateStr) return false;
        const reviewDate = new Date(dateStr);
        return !isNaN(reviewDate.getTime()) && reviewDate >= cutoff;
    });

    return containers.map(container => {
        var author = container.querySelector('.author') ? container.querySelector('.author').textContent.trim() : '';
        var scoreElem = container.querySelector('.score.unvoted');
        var score = scoreElem ? scoreElem.textContent.trim() : (container.querySelector('.score') ? container.querySelector('.score').textContent.trim() : '');
        var dateElem = container.querySelector('time');
        var date = dateElem ? dateElem.getAttribute('title') : '';
        var text = container.querySelector('.md') ? container.querySelector('.md').textContent.trim() : '';

        return {
            author: author,
            score: score,
            date: date,
            text: text
        };
    });
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