// ==UserScript==
// @name         Robin Tierbot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A bot that displays the current room tier.
// @author       porso7
// @include      https://www.reddit.com/robin*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

// Room name
var roomName = $(".robin-chat--room-name").text().substring(0, 10);

// Tier data URL
var tdURL = "https://monstrouspeace.com/robintracker/json.php";

// Get the tier for the current room\
function getTier(user) {
    $.getJSON(tdURL, function(data) {
        for (var key in data) {
            if (!data.hasOwnProperty(key)) continue;

            // Check if this key is our room
            if (data[key]["room"] == roomName) {
                
                // Send a message with the current tier
                sendMessage(user + " This room is tier " + data[key]["tier"]);
            }
        }
    });
    
    // Unexpected error
    return "error";
}

// Send a message
function sendMessage(message) {

    // Input the message in the message field and submit it
    $(".text-counter-input").val(message).submit();

    // Apparantly it has to be submitted twice
    $("#sendBtn").trigger("onclick");

    // Clear the message
    $(".text-counter-input").val("");
}

// Processe new messages
function processMessage(msg) {

    // Store message text
    var msgText = $(msg).find(".robin-message--message").text();

    // Store user that sent the message
    var msgUser = $(msg).find(".robin-message--from").text();

    // Check if user wanted tier
    if (msgText == "!tier") {
        getTier(msgUser);
    }
}

// Mutation observer to check for new messages
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        var added = mutation.addedNodes[0];

        // Processes all new messages
        if ($(added).hasClass("robin-message")) {
            processMessage(added);
        }
    });
});
observer.observe($("#robinChatMessageList").get(0), {
    childList: true
});

// Log that the script loaded to the console
console.log("Robin-tierbot loaded.");