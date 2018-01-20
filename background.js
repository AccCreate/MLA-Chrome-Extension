
// Global highlights
var highlights = {};

// text = {html link, List of quotes}
// A function to use as callback
function report_citations(text) {
    alert(highlights);
    highlights.push({
	key: text[0]
	value: text[1]
    });
}

// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function (tab) {
	// ...if it matches, send a message specifying a callback too
	chrome.tabs.sendMessage(tab.id, {text: 'ACK'}, report_citations);
});
