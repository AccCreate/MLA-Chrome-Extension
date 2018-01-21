
// keep track of messages
// var messages = [];

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'ACK') {

	// store selected text
	var text = "";

	var url = window.location.href;
	var company = window.location.hostname;
	// MLA Date format: Day Month Year (5 May 2017)
	var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	var d = new Date();
	var date = d.getDay() + " " + months[d.getMonth()] + " " + d.getFullYear();;
	

	// itemprop="author" or itemprop="name"
	var author = "";
	var other = document.getElementsByTagName('li');
	alert(document.body.innerHTML);
	for (var i=0;i<other.length;i++) {
	    alert(other[i].innerHTML);
	    if (other[i].className.toLowerCase()=='author'){
		author=other[i].getElementsByTagName('a')[0].innerHTML;

	    }
	}
	alert(author);
	
	if (window.getSelection) {
	    text = window.getSelection().toString();
	} else if (document.selection && document.selection.type != "Control") {
	    text = document.selection.createRange().text;
	}

	// Call the specified callback, passing
	sendResponse({url: url, text: text, date: date, company: company});
    }
});
