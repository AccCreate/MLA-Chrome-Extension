
// Global highlights
var highlights = [];

// A function to use as callback
function report_citations(text) {
	highlights.push(text);
	alert(highlights);
}

// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function (tab) {
	// ...if it matches, send a message specifying a callback too
	chrome.tabs.sendMessage(tab.id, {text: 'ACK'}, report_citations);
});