// keep track of messages
// var messages = [];

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'ACK') {
        // NOTE: Getting tags through "getElementByTagName" fails at large HTML files
        // After around 125 metas, it stops finding more so DO NOT use this.
        // var allMETATag = document.getElementsByTagName("meta");

        // store selected text
        var text = "";

        var url = window.location.href;
        var company = window.location.hostname;
        company = company.replace(/^(www\.)/,"");
        // alert(company);
        // MLA Date format: Day Month Year (5 May 2017)
        var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        var d = new Date();
        var date = d.getDay() + " " + months[d.getMonth()] + " " + d.getFullYear();;

        // Get date of article
        var articleDate = getArticleDate();
        // alert(articleDate);
        var authors = getAuthor();
        // alert(authors);

        // Get title and publisher
        var titleInfo = getTitle();
        // alert(titleInfo["title"]);
        // alert(titleInfo["publisher"]);
        var title = titleInfo["title"];
        var publisher = titleInfo["publisher"];

        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }

        // Call the specified callback, passing
        sendResponse({url: url, text: text, date: date, company: company, title: title, publisher: publisher});
    } else if (msg.text === "CLEAR") {
        sendResponse("CLEAR");
    }
});

function getTitle() {
    var content = document.getElementsByTagName("title")[0].innerHTML;

    if (content.indexOf(" - ")) {
        content = content.split(" - ");
        var title = content[0];
        var publisher = content[1];
    } else if (content.indexOf(" | ")) {
        content = content.split(" | ");
        var title = content[0];
        var publisher = content[1];
    } else {
        var title = content;
        var publisher = "N/A";
    }
    return { "title": title, "publisher": publisher };
}
function getAuthor(){
   /* var author_names = "";
    var authorList = document.querySelectorAll('[class*="author" i]');
    for (i = 0; i < authorList.length; i++) {
       author_names += authorList[i].innerText;

    } */

    var author_names = "";
    //var authorlist = [];
    if(document.head.querySelector("[name=author]") != null){
    info = document.head.querySelector("[name=author]").content;

    for (var i=0;i<info.length;i++) {
        author_names += info[i];


}  }


return author_names;
}

function getArticleDate() {
    // Might also have to use RSS

    // Get date article was published
    var articleDate = "";
    var maxArticleDate = new Date(document.lastModified);
    var validDateList = [];

    // Finding from "span"
    // </span> <span class="pb-timestamp" itemprop="datePublished" content="2018-01-20T09:45-500">January 20 at 9:45 PM</span>
    // var str = "</span> <span class=\"pb-timestamp\" itemprop=\"datePublished\" content=\"2018-01-20T09:45-500\">January 20 at 9:45 PM</span>";
    // <span class="pb-timestamp" itemprop="datePublished" content="2018-01-21T04:51-500">January 21 at 4:51 PM</span> <span clas0s="pb-tool email">
    // <p class="update-time">Updated 9:55 PM ET, Sun January 21, 2018
    // Finding from "class"
    var spanDateList = [];
    var classDateList = document.querySelectorAll('[class*="time" i]');
    for (i = 0; i < classDateList.length; i++) {
        if (classDateList[i].getAttribute("content") != undefined) {
            var tempDate2 = classDateList[i].getAttribute("content");
            tempDate2 = (tempDate2.replace(/[&\/\\#+()$~%.'"*?<>{}]/g, '')).trim();
            if (tempDate2 != ""){
                spanDateList.push(tempDate2);
            }
        }
    }
    for (i = 0; i < spanDateList.length; i++) {
        appendValidDate(spanDateList[i], validDateList, maxArticleDate);
    }

    // Finding from {"@context schema", etc. for mobile checking
    // {"@context":"http:\/\/schema.org","

    // Finding from <time> tag
    // <time datetime="2017-05-09T17:00:00+02:00" itemprop="datePublished">May 9, 2017</time>
    // <time datetime="2016-10-03T15:15:18.819Z">Oct 3, 2016</time>
    // Finding from "time" itself
    var timeDateList = document.getElementsByTagName('time');
    for (i = 0; i < timeDateList.length; i++) {
        appendValidDate(timeDateList[i].innerHTML, validDateList, maxArticleDate);
    }

    // Finding from any "meta" page
    // <meta name="DISPLAYDATE" content="Jan. 21, 2018" />
    // <meta name="dat" content="Jan. 21, 2018" />
    var metaDateList = [];
    var dateList = document.querySelectorAll("meta[name*='dat' i");
    // alert(document.querySelector("meta[name='"+"dat"+"']").getAttribute('content'));
    for (i = 0; i < dateList.length; i++) {
        if (dateList[i].getAttribute("content") != undefined) {
            var tempDate = dateList[i].getAttribute("content");
            tempDate = (tempDate.replace(/[&\/\\#+()$~%.'"*?<>{}]/g, '')).trim();
            if (tempDate != "") {
                metaDateList.push(tempDate);
            }
        }
    }
    for (i = 0; i < metaDateList.length; i++) {
        appendValidDate(metaDateList[i], validDateList, maxArticleDate);
    }


    // Check if URL contains date if all else fails
    var numbersFromURL = window.location.href;
    numbersFromURL = numbersFromURL.match(/[0-9]+/g);
    if (numbersFromURL == null) {
        numbersFromURL = 0;
    }
    numbersFromURL = numbersFromURL.toString();
    // If it has something of a month, day, and year (8 integers) append it
    var tempNumbersFromURL = numbersFromURL.replace(new RegExp(',', 'g'), '');
    if (tempNumbersFromURL.length == 8) {
        appendValidDate(numbersFromURL, validDateList, maxArticleDate);
    }
    if (validDateList.length > 0) {
        return (articleDate = getMostFrequentElement(validDateList));
    } else {
        return "n.d.";
    }

    // var str = "<meta name=\"dat\" content=\"Jan. 21, 2018\" />";
    // var newtext = str.replace(/(<meta name="[a-z]*dat[a-z]*") (content=")(.*?)(")/i, "$3");
    // var n = str.search(/<meta name="[a-z]*dat[a-z]*" content="(.*?)"/i);
    // document.getElementById("demo").innerHTML = newtext;
}

// https://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
// Does not factor for ties
function getMostFrequentElement(array) {
    if (array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for (var i = 0; i < array.length; i++) {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;
        if (modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

function appendValidDate(eachDate, validDateList, maxArticleDate) {
    // 2nd, 3rd, 4th, etc. for day that needs to be removed
    eachDate = eachDate.replace(/(\d+)(st|nd|rd|th)/, "$1");

    // 2018-01-22T08:00-500. Remove "T" out in this case
    eachDate = eachDate.replace(/(\d+)(T|t)/, "$1 ");

    // Change to YY-MM-DD if YYMMDD
    var regYYMMDD = /[1-2][0-9]{3}[0-1][0-9][0-3][0-9]/;
    if (regYYMMDD.test(eachDate)) {
        eachDate = eachDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3 ');
    }
    // Check if Date valid. If it is, append it
    var validDateCheck = new Date(eachDate);
    if (validDateCheck instanceof Date && !isNaN(validDateCheck.valueOf())) {
        if(maxArticleDate >= validDateCheck){
            validDateCheck = (validDateCheck.toString()).replace(/(\w+)\s(\w+)\s(\d{2})\s(\d{4})\s(\d{2}:\d{2}:\d{2})\s(.*)/g, '$3 $2 $4');
            validDateList.push(validDateCheck);
        }
    }
}
