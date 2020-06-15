var lOutput, cOutput, mOutput, sOutput;

function insights() {
    gatherLikesInput();  
    gatherCommentsInput(); 
    gatherMessagesInput(); 
    gatherSavedInput();
}

function gatherLikesInput() {
    $(document).on('change', '#likesJSON', function(event) {
        if (document.getElementById('likesJSON').files[0].name == "likes.json") {
            document.getElementById('likeInsight').innerHTML = "May take some time to load depending on size of account data...";
            var reader = new FileReader();
            reader.onload = function(event) {
                var jsonObj = JSON.parse(event.target.result).media_likes;
                likeInsights(jsonObj);
            }
            reader.readAsText(event.target.files[0]); 
            toggleSeeMore();
            document.getElementById('seeMore').innerHTML = "click here to see more details";
        } else {
            document.getElementById('likeInsight').innerHTML = "Error: Upload the proper 'likes.json' file."
        }
    });
}

function gatherCommentsInput() {
    $(document).on('change', '#commentsJSON', function(event) {
        if (document.getElementById('commentsJSON').files[0].name == "comments.json") {
            document.getElementById('commentInsight').innerHTML = "May take some time to load depending on size of account data...";
            var reader = new FileReader();
            reader.onload = function(event) {
                var jsonObj = JSON.parse(event.target.result).media_comments;
                commentInsights(jsonObj);
            }
            reader.readAsText(event.target.files[0]); 
            toggleSeeMore();
            document.getElementById('seeMore').innerHTML = "click here to see more details";
        } else {
            document.getElementById('commentInsight').innerHTML = "Error: Upload the proper 'comments.json' file."
        }
        
    });
}

function gatherMessagesInput() {
    $(document).on('change', '#messagesJSON', function(event) {
        if (document.getElementById('messagesJSON').files[0].name == "messages.json") {
            document.getElementById('messageInsight').innerHTML = "May take some time to load depending on size of account data...";
            var reader = new FileReader();
            reader.onload = function(event) {
                var jsonObj = JSON.parse(event.target.result);
                messageInsights(jsonObj);
            }
            reader.readAsText(event.target.files[0]); 
            toggleSeeMore();
            document.getElementById('seeMore').innerHTML = "click here to see more details";
        } else {
            document.getElementById('messageInsight').innerHTML = "Error: Upload the proper 'messages.json' file."
        }
    });
}

function gatherSavedInput() {
    $(document).on('change', '#savedJSON', function(event) {
        if (document.getElementById('savedJSON').files[0].name == "saved.json") {
            document.getElementById('savedInsight').innerHTML = "May take some time to load depending on size of account data...";
            var reader = new FileReader();
            reader.onload = function(event) {
                var jsonObj = JSON.parse(event.target.result).saved_media;
                savedInsights(jsonObj);
        }
            reader.readAsText(event.target.files[0]); 
            toggleSeeMore();
            document.getElementById('seeMore').innerHTML = "click here to see more details";
        } else {
            document.getElementById('savedInsight').innerHTML = "Error: Upload the proper 'saved.json' file."
        }
    });
}

function likeInsights(data) {
    var profilesLiked = gatherProfiles(data, "1"); // gathers a dictionary of all profiles liked (key) with number of posts liked on each profile (value)
    var maxNumOfLikes = calculateMaxNum(profilesLiked); // calculates maximum number of likes from all profiles liked
    lOutput = storeInsights(profilesLiked, maxNumOfLikes, "likes");
    lOutputFive = fiveInsights(lOutput);

    localStorage.setItem('fiveLikes', lOutputFive); // saved in storage for use in moreDetails.html 
    localStorage.setItem('likes', lOutput); // saved in storage for use in likes.html

    document.getElementById('likeInsight').innerHTML = "[Most likes] " + mainInsight(lOutput);
}

function commentInsights(data) {
    var profilesCommented = gatherProfiles(data, "2"); // gathers a dictionary of all profiles commented on (key) with number of comments on each profile (value)
    var maxNumOfComments = calculateMaxNum(profilesCommented); // calculates maximum number of comments from all profiles commented on
    cOutput = storeInsights(profilesCommented, maxNumOfComments, "comments");
    cOutputFive = fiveInsights(cOutput);

    localStorage.setItem('fiveComments', cOutputFive); // saved in storage for use in moreDetails.html 
    localStorage.setItem('comments', cOutput); // saved in storage for use in comments.html

    document.getElementById('commentInsight').innerHTML = "[Most comments] " + mainInsight(cOutput);
}

function messageInsights(data) {
    var profilesMessaged = gatherProfilesM(data); // gathers a dictionary of all chats (key) with number of messages in each chat (value)
    var maxNumOfMessages = calculateMaxNum(profilesMessaged); // calculates maximum number of messages from all chats
    mOutput = storeInsights(profilesMessaged, maxNumOfMessages, "messages");
    mOutputFive = fiveInsights(mOutput);

    localStorage.setItem('fiveMessages', mOutputFive); // saved in storage for use in moreDetails.html
    localStorage.setItem('messages', mOutput); // saved in storage for use in messages.html

    document.getElementById('messageInsight').innerHTML = "[Most messages] " + mainInsight(mOutput);
}

function savedInsights(data) {
    var profilesSaved = gatherProfiles(data, "1"); // gathers a dictionary of all profiles the user has saved posts from (key) with number of posts saved from profile (value)
    var maxNumOfSaves = calculateMaxNum(profilesSaved); // calculates maximum number of saved posts from all profiles
    sOutput = storeInsights(profilesSaved, maxNumOfSaves, "saved");
    sOutputFive = fiveInsights(sOutput);

    localStorage.setItem('fiveSaves', sOutputFive); // saved in storage for use in moreDetails.html
    localStorage.setItem('saved', sOutput); // saved in storage for use in saved.html

    document.getElementById('savedInsight').innerHTML = "[Most saved posts] " + mainInsight(sOutput);
}

function gatherProfiles(content, category) {
    var profiles = {};
    var t = content.length;
    for (var i = 0; i < t; i++) { 
        if (typeof profiles[(content[i][category])] == 'undefined') {
            profiles[(content[i][category])] = 1; // if this profile is not already in the dictionary, then include profile in dictionary with 1 instance
        } else {
            profiles[(content[i][category])]++; // if this profile is already included in the dictionary, then increment instances by 1
        }
    }
    return profiles;
}

function gatherProfilesM(content) {
    var findUser = {}; // used to find the uploader's username which will be used later
    var profiles = {}; 
    var t = content.length;
    for (var i = 0; i < t; i++) {
        var namesArr = content[i].participants;
        var u = content[i].conversation.length;
        for (var j = 0; j < namesArr.length; j++) {
            if (typeof findUser[namesArr[j]] == 'undefined') {
                findUser[namesArr[j]] = u;
            } else {
                findUser[namesArr[j]] += u;
            }
        }
    }
    var user = findMaxProfile(findUser);
    delete profiles;
    for (var i = 0; i < content.length; i++) {
        var namesArr = content[i].participants;
        for (var j = 0; j < namesArr.length; j++) {
            if (namesArr[j] == user) { // uploader's username is used to distinguish uploader from other users
                namesArr.splice(j, 1);
            }
        }
        var numOfUsersInChat = namesArr.length;
        if (numOfUsersInChat > 3) {
            namesArr.splice(3);
            var namesStr = namesArr.join(', ') + ", and " + (numOfUsersInChat - 3) + " others (Group Chat)"; // to simplify insights for groups chat with over 3 users
        } else if (numOfUsersInChat > 1) {
            var namesStr = namesArr.join(', ') + " (Group Chat)";
        } else {
            var namesStr = namesArr.join(', '); 
        }
        var u = content[i].conversation.length;
        if (typeof profiles[namesStr] == 'undefined') {
            profiles[namesStr] = u; // if user has not been messaged already, then there are now u messages with this user
        } else {
            profiles[namesStr] += u; // if there are messages with this user already, then there are now u more messages with this user
        }
    }
    return profiles;
}

function storeInsights(profiles, max, category) {
    var returnText = "";
    for (var i = max; i > 0; i--) {
        for (var key in profiles) {
            if (profiles[key] == i && category == "messages") {
                returnText = returnText.concat("<p>Messages with " + "<b>" + key + "</b>" + ": " + profiles[key] + "</p>");
            } else if (profiles[key] == i && category == "likes") {
                returnText = returnText.concat("<p>Likes on " + "<b>" + key + "</b>" + "'s profile: " + profiles[key] + "</p>");
            } else if (profiles[key] == i && category == "comments") {
                returnText = returnText.concat("<p>Comments on " + "<b>" + key + "</b>" + "'s profile: " + profiles[key] + "</p>");
            } else if (profiles[key] == i && category == "saved") {
                returnText = returnText.concat("<p>Saved posts from " + "<b>" + key + "</b>" + "'s profile: " + profiles[key] + "</p>");
            }
        }
    }
    return returnText;
}

function fiveInsights(insights) {
    var counter = 0;
    var t = insights.length;
    for (var i = 0; i < t; i++) {
        if (counter == 5) {
            return insights.slice(0, i + 3);
        } else if (insights[i] == '<' && insights[i + 1] == '/' && insights[i + 2] == 'p' && insights[i + 3] == '>') {
            counter++;
        }
    }
    return insights; // if there are no insights, return empty string
}

function mainInsight(insights) {
    var t = insights.length;
    for (var i = 0; i < t; i++) {
        if (insights[i] == '<' && insights[i + 1] == '/' && insights[i + 2] == 'p' && insights[i + 3] == '>') {
            return insights.slice(3, i + 3);
        }
    }
    return insights; // if there are no insights, return empty string
}

function findMaxProfile(profiles) {
    var max = 0;
    var profile = "";
    for (var key in profiles) {
        if (profiles[key] > max) {
            max = profiles[key];
            profile = key;
        }
    }
    return profile;
}


function calculateMaxNum(profiles) {
    var max = 0;
    for (var key in profiles) {
        if (profiles[key] > max) {
            max = profiles[key];
        }
    }
    return max;
}

function toggleSeeMore() {
    document.getElementById("seeMore").style.display = "block";
}