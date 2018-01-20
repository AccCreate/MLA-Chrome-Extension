
// A function to use as callback
function report_citations(urls) {
	// console.log('I received the following DOM content:\n' + urls);
	alert(urls);
}

// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function (tab) {
	// ...if it matches, send a message specifying a callback too
	chrome.tabs.sendMessage(tab.id, {text: 'ACK'}, report_citations);
});