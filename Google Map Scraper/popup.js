document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currentTab = tabs[0];
        var actionButton = document.getElementById('actionButton');
        var downloadCsvButton = document.getElementById('downloadCsvButton');
        var resultsTable = document.getElementById('resultsTable');
        var filenameInput = document.getElementById('filenameInput');

        if (currentTab && currentTab.url.includes("://www.google.com/maps/place")) {
            document.getElementById('message').textContent = "Let's scrape Google Maps Reviews!";
            actionButton.disabled = false;
            actionButton.classList.add('enabled');
        } else {
            var messageElement = document.getElementById('message');
            messageElement.innerHTML = '';
            var linkElement = document.createElement('a');
            linkElement.href = 'https://www.google.com/maps/';
            linkElement.textContent = "Go to a Google Maps Place Page.";
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
                const headers = ['Reviewer', 'Rating', 'Date', 'Review Text'];
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
                    ['reviewer', 'rating', 'date', 'text'].forEach(function(key) {
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
                filename = 'google-maps-reviews.csv'; 
            } else {
                filename = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.csv';
            }
            downloadCsv(csv, filename); 
        });

    });
});


async function scrapeData() {
    // Scroll to load all reviews without date limit
    async function scrollToLoad() {
        const scrollable = document.querySelector('.m6QErb.DxyBCb.kA9KIf.dS8AEf');
        if (!scrollable) return;
        let lastHeight = scrollable.scrollHeight;
        while (true) {
            scrollable.scrollTo(0, scrollable.scrollHeight);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for new reviews to load
            const newHeight = scrollable.scrollHeight;
            if (newHeight === lastHeight) break;
            lastHeight = newHeight;
        }
    }

    await scrollToLoad();

    // Now extract all reviews without filtering
    var containers = Array.from(document.querySelectorAll('div.jftiEf'));

    return containers.map(container => {
        var reviewer = container.querySelector('.d4r55') ? container.querySelector('.d4r55').textContent.trim() : '';
        var ratingElem = container.querySelector('.kvMYJc[role="img"]');
        var rating = '';
        if (ratingElem) {
            var ariaLabel = ratingElem.getAttribute('aria-label');
            if (ariaLabel && ariaLabel.includes('stars')) {
                rating = ariaLabel.split(' ')[0];
            }
        }
        var date = container.querySelector('.rsqaWe') ? container.querySelector('.rsqaWe').textContent.trim() : '';
        var text = container.querySelector('.wiI7pd') ? container.querySelector('.wiI7pd').textContent.trim() : '';

        return {
            reviewer: reviewer,
            rating: rating,
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