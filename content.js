
// keep track of messages
// var messages = [];

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'ACK') {
	var docHeadHTML = document.head.innerHTML;
	var docBodyHTML = document.body.innerHTML;

	// NOTE: Getting tags through "getElementByTagName" fails at large HTML files
	// After around 125 metas, it stops finding more so DO NOT use this.
	// var allMETATag = document.getElementsByTagName("meta");

	// store selected text
	var text = "";

	var url = window.location.href;
	var company = window.location.hostname;
	company = company.replace(/^(www\.)/,"");
	alert(company);
	// MLA Date format: Day Month Year (5 May 2017)
	var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	var d = new Date();
	var date = d.getDay() + " " + months[d.getMonth()] + " " + d.getFullYear();;
	

	// itemprop="author" or itemprop="name"
	// var author = "";
	// var other = document.getElementsByTagName('li');
	// alert(document.body.innerHTML);
	// for (var i=0;i<other.length;i++) {
	//     alert(other[i].innerHTML);
	//     if (other[i].className.toLowerCase()=='author'){
	// 	author=other[i].getElementsByTagName('a')[0].innerHTML;

	//     }
	// }
	// alert(author);
	
	// Get date of article
	var articleDate = getArticleDate(docHeadHTML, docBodyHTML);
	alert(articleDate);
	
	if (window.getSelection) {
	    text = window.getSelection().toString();
	} else if (document.selection && document.selection.type != "Control") {
	    text = document.selection.createRange().text;
	}

	// Call the specified callback, passing
	sendResponse({url: url, text: text, date: date, company: company});
    }
});

function getArticleDate(docHeadHTML, docBodyHTML){
    // Might also have to use RSS
    
    // Get date article was published
    var articleDate = "";
    var maxArticleDate = new Date(document.lastModified);
    var validDateList = [];

    // </span> <span class="pb-timestamp" itemprop="datePublished" content="2018-01-20T09:45-500">January 20 at 9:45 PM</span>
    // Finding from "span"
    // var str = "</span> <span class=\"pb-timestamp\" itemprop=\"datePublished\" content=\"2018-01-20T09:45-500\">January 20 at 9:45 PM</span>";
    // <span class="pb-timestamp" itemprop="datePublished" content="2018-01-21T04:51-500">January 21 at 4:51 PM</span> <span clas0s="pb-tool email">
    var spanDateList = [];
    // var dateList = document.querySelectorAll("span 'dat' >");
    
    // <p class="update-time">Updated 9:55 PM ET, Sun January 21, 2018
    // Finding from "class"
    
    
    // <time datetime="2017-05-09T17:00:00+02:00" itemprop="datePublished">May 9, 2017</time>
    // <time datetime="2016-10-03T15:15:18.819Z">Oct 3, 2016</time>
    // Finding from "time" itself
    var timeDateList = [];
    
    // Finding from any "meta" page
    // <meta name="DISPLAYDATE" content="Jan. 21, 2018" />
    // <meta name="dat" content="Jan. 21, 2018" />
    var metaDateList = [];
    var dateList = document.querySelectorAll("meta[name*='dat' i");
    // alert(document.querySelector("meta[name='"+"dat"+"']").getAttribute('content'));
    for(i = 0; i < dateList.length; i ++){
	if(dateList[i].getAttribute("content") != undefined){
	    var tempDate = dateList[i].getAttribute("content");
	    tempDate = tempDate.replace(/[&\/\\#+()$~%.'":*?<>{}]/g, '');
	    tempDate = tempDate.trim();
	    if (tempDate != ""){
		metaDateList.push(dateList[i].getAttribute("content"));
	    }
	    
	}
    }

    var regYYMMDD = /[1-2][0-9]{3}[0-1][0-9][0-3][0-9]/;
    for(i = 0; i < metaDateList.length; i ++){
	if(regYYMMDD.test(metaDateList[i])){
	    metaDateList[i] = metaDateList[i].replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3 '); 
	}

	var validDateCheck = new Date(metaDateList[i]);
	if(validDateCheck instanceof Date && !isNaN(validDateCheck.valueOf())){
	    if(maxArticleDate >= validDateCheck){
		validDateCheck = (validDateCheck.toString()).replace(/(\w+)\s(\w+)\s(\d{2})\s(\d{4})\s(\d{2}:\d{2}:\d{2})\s(.*)/g, '$3 $2 $4');
		validDateList.push(validDateCheck);
	    }
	}
    }


    if(validDateList.length > 0){
	return (articleDate = getMostFrequentElement(validDateList));
    } else {
	return "N.a.";
    }
 
    // var str = "<meta name=\"dat\" content=\"Jan. 21, 2018\" />";
    // var newtext = str.replace(/(<meta name="[a-z]*dat[a-z]*") (content=")(.*?)(")/i, "$3");
    // var n = str.search(/<meta name="[a-z]*dat[a-z]*" content="(.*?)"/i);
    // document.getElementById("demo").innerHTML = newtext;
}

// https://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
// Does not factor for ties
function getMostFrequentElement(array){
    if(array.length == 0)
	return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
	var el = array[i];
	if(modeMap[el] == null)
	    modeMap[el] = 1;
	else
	    modeMap[el]++;  
	if(modeMap[el] > maxCount)
	{
	    maxEl = el;
	    maxCount = modeMap[el];
	}
    }
    return maxEl;
}
