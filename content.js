
// keep track of messages
// var messages = [];

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'ACK') {
	var docHeadHTML = document.head.innerHTML;
	var docBodyHTML = document.body.innerHTML;

	alert(docHTML);
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

	// Get date article was published
	// <p class="update-time">Updated 9:55 PM ET, Sun January 21, 2018
	// 	<meta name="DISPLAYDATE" content="Jan. 21, 2018" />
	// <meta name="dat" content="Jan. 21, 2018" />
	// </span> <span class="pb-timestamp" itemprop="datePublished" content="2018-01-20T09:45-500">January 20 at 9:45 PM</span>
	// <time datetime="2017-05-09T17:00:00+02:00" itemprop="datePublished">May 9, 2017</time>
	var articleDate = "";

	// Finding from any "meta" page
	var str = "<meta name=\"dat\" content=\"Jan. 21, 2018\" />";
	var n = str.search(/<meta name="[a-z]*dat[a-z]*" content="(.*?)"/i);
	var newtext = str.replace(/(<meta name="[a-z]*dat[a-z]*") (content=")(.*?)(")/i, "$3");
	newtext = newtext.replace(/[!@#$%^&*/>]/g, "");
	newtext = newtext.trim("");
	// document.getElementById("demo").innerHTML = newtext;
	
	var index = docHeadHTML.indexOf('date');
	// https://stackoverflow.com/questions/7998180/regex-how-to-extract-text-from-between-quotes-and-exclude-quotes
	// /<meta name="dat[a-z]*" content="(.*?)"/i
	
	alert(document.lastModified);
	alert("nopeeeeeeeeeeee");
	
	
	if (window.getSelection) {
	    text = window.getSelection().toString();
	} else if (document.selection && document.selection.type != "Control") {
	    text = document.selection.createRange().text;
	}

	// Call the specified callback, passing
	sendResponse({url: url, text: text, date: date, company: company});
    }
});
