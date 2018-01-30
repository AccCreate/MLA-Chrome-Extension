
// Global highlights
var highlights = {};

// text = {html link, List of quotes}
// A function to use as callback
function report_citations(data) {
    if (data === "CLEAR") {
        Object.keys(highlights).forEach(function(key) {
            delete highlights[key];
        });
    }

    if (data["url"] in highlights)
        highlights[data["url"]].push(data["text"]);
    else
        highlights[data["url"]] = [data["text"]];

    chrome.storage.sync.get([data["url"]], function(result) {
        if(!!data["text"] || 0 != data["text"].length || !!data["text"].trim()){

            var array = result[data["url"]] ? result[data["url"]] : [];

            var duplicateText = false;
            for(var i = 0; i < array.length; i++){
                if(array[i].indexOf(data["text"]) >=0){
                    duplicateText = true;
                    break;
                }
                if(data["text"].indexOf(array[i]) >=0){
                    duplicateText = true;
                    break;
                }
            }
            if(!duplicateText){
                array.unshift(data["text"]);
            }

            var jsonObj = {};
            var urlDataArray = result[data["url"]];



            jsonObj[data["url"]] = array;
            chrome.storage.sync.set(jsonObj, function() {
                console.log("Saved a new array item");
                // alert("saved");
            });
        }
    });

}


// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function (tab) {

    // ...if it matches, send a message specifying a callback too
    chrome.tabs.sendMessage(tab.id, {text: 'ACK'}, report_citations);


    // // Save it using the Chrome extension storage API.
    // chrome.storage.sync.set(highlights, function() {
    //     alert('Settings saved');
    // });


    // Read it using the storage API
    // null = all keys
    chrome.storage.sync.get(null, function(items) {
        var allKeys = Object.keys(items);
        // alert(allKeys.length);
        for(i = 0; i < allKeys.length; i++){
            // alert(allKeys[i]);
            alert(items[allKeys[i]].join("\n"));
        }
    });


});

chrome.commands.onCommand.addListener(function(command) {
    if (command == "Ctrl+I"){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {text: 'ACK'}, report_citations);
        });
    }

    // Clear local storage
    if (command == "Ctrl+Shift+K"){
        chrome.storage.local.clear();
    }
});
