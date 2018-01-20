
// Global highlights
var highlights = {};

// text = {html link, List of quotes}
// A function to use as callback
function report_citations(data) {
    
    if (data["url"] in highlights) {
	highlights[data["url"]].push(data["text"]);
    } else {
	highlights[data["url"]] = [data["text"]];
    }
    alert(highlights[data["url"]]);
}

// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function (tab) {
    // ...if it matches, send a message specifying a callback too
    chrome.tabs.sendMessage(tab.id, {text: 'ACK'}, report_citations);
});
