// document.addEventListener('DOMContentLoaded', function() {
//     var checkPageButton = document.getElementById('helloWorld');
//     checkPageButton.addEventListener('click', function() {
//         alert("Hello world");
//     });
// });

$(document).ready(function(){
	$("button#citations").click(function() {
		alert("UNDER CONSTRUCTION!");
	});

	$("button#quotes").click(function() {
		chrome.tabs.create({url: chrome.extension.getURL('quotes.html')});
	});

	$("button#clear").click(function() {
		alert("Cleared!");
	});
});