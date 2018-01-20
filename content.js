
// keep track of messages
// var messages = [];

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'ACK') {

	// store selected text
	var text = [];

	text.push(window.location.href);
	
	if (window.getSelection) {
	    text.push(window.getSelection().toString());
	} else if (document.selection && document.selection.type != "Control") {
	    text.push(document.selection.createRange().text);
	}

	// Call the specified callback, passing
	// messages.push(text);
	sendResponse(text);
    }
});
