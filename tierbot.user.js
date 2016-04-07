// ==UserScript==
// @name         Robin Tierbot
// @namespace    http://tampermonkey.net/
// @version      0.41
// @description  A bot that displays the current room tier.
// @author       porso7
// @include      https://www.reddit.com/robin*
// @updateURL    https://raw.githubusercontent.com/IvanFon/robin-tierbot/master/tierbot.user.js
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
                var message = user.trim() + " This room is tier " + data[key]["tier"].trim() + ".";
                sendMessage(message.trim());
            }
        }
    });
    
    // Unexpected error
    return "error";
}

// Send a message
function sendMessage(message) {

    // Input the message in the message field and submit it
    $(".text-counter-input").val(message.trim()).submit();

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

// Tell users that they can use the !tier command 
// once when the bot joins and every 5 minutes
sendMessage("Want to find out the current tier of this room? Type !tier. (I am a bot. If I don't respond to you, I probably got rate-limited.)".trim());

setInterval(function() {
    sendMessage("Want to find out the current tier of this room? Type !tier. (I am a bot. If I don't respond to you, I probably got rate-limited.)".trim());
}, 300000);