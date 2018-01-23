
// Global highlights
var highlights = {};

// text = {html link, List of quotes}
// A function to use as callback
function report_citations(data) {
    if (data === "CLEAR") {
        Object.keys(highlights).forEach(function(key) {
            delete highlights[key];
        });
    }

    if (data["url"] in highlights)
        highlights[data["url"]].push(data["text"]);
    else
        highlights[data["url"]] = [data["text"]];
    alert(highlights[data["url"]]);
}


// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function (tab) {
    // ...if it matches, send a message specifying a callback too
    chrome.tabs.sendMessage(tab.id, {text: 'ACK'}, report_citations);


    // Get title of page. Titles generally are in format of "<title of article> - <company name>"
    chrome.tabs.getSelected(null, function(tab) {
        alert(tab.title);
        // alert(tab.url);
    });

});

chrome.commands.onCommand.addListener(function(command) {
    if (command == "Ctrl+I"){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {text: 'ACK'}, report_citations);
        });
    }
});

