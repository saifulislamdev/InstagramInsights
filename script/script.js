var lOutput, cOutput, mOutput, sOutput;

function insights() {
    gatherLikesInput();
    gatherCommentsInput();
    gatherMessagesInput();
    gatherSavedInput();
}
function gatherLikesInput() {
    $(document).on('change', '#likesJSON', function(event) {
        document.getElementById('likeInsight').innerHTML = "May take some time to load depending on size of account data...";
        var reader = new FileReader();
        reader.onload = function(event) {
            var jsonObj = JSON.parse(event.target.result);
            var jsonObj = jsonObj.media_likes;
            likeInsights(jsonObj);
        }
        console.log(event.target.files[0]);
        reader.readAsText(event.target.files[0]);
        toggleSeeMore();
        document.getElementById('seeMore').innerHTML = "click here to see more details";
    });
}

function gatherCommentsInput() {
    $(document).on('change', '#commentsJSON', function(event) {
        document.getElementById('commentInsight').innerHTML = "May take some time to load depending on size of account data...";
        var reader = new FileReader();
        reader.onload = function(event) {
            var jsonObj = JSON.parse(event.target.result);
            var jsonObj = jsonObj.media_comments;
            commentInsights(jsonObj);
        }
        reader.readAsText(event.target.files[0]);
        toggleSeeMore();
        document.getElementById('seeMore').innerHTML = "click here to see more details";
    });
}

function gatherMessagesInput() {
    $(document).on('change', '#messagesJSON', function(event) {
        document.getElementById('messageInsight').innerHTML = "May take some time to load depending on size of account data...";
        var reader = new FileReader();
        reader.onload = function(event) {
            var jsonObj = JSON.parse(event.target.result);
            messageInsights(jsonObj);
        }
        reader.readAsText(event.target.files[0]);
        toggleSeeMore();
        document.getElementById('seeMore').innerHTML = "click here to see more details";
    });
}

function gatherSavedInput() {
    $(document).on('change', '#savedJSON', function(event) {
        document.getElementById('savedInsight').innerHTML = "May take some time to load depending on size of account data...";
        var reader = new FileReader();
        reader.onload = function(event) {
            var jsonObj = JSON.parse(event.target.result);
            var jsonObj = jsonObj.saved_media;
            savedInsights(jsonObj);
        }
        reader.readAsText(event.target.files[0]);
        toggleSeeMore();
        document.getElementById('seeMore').innerHTML = "click here to see more details";
    });
}

function likeInsights(data) {
    var profilesLiked = gatherProfiles(data, "1"); // gathers a dictionary of all profiles liked with number of posts liked on each profile
    var maxNumOfLikes = calculateMaxNum(profilesLiked); // calculates maximum number of likes from all profiles liked)
    lOutput = storeInsights(profilesLiked, maxNumOfLikes, "likes");
    lOutputFive = fiveInsights(lOutput);

    localStorage.setItem('fiveLikes', lOutputFive);
    localStorage.setItem('likes', lOutput);

    document.getElementById('likeInsight').innerHTML = "[Most likes] " + mainInsight(lOutput);
}

function commentInsights(data) {
    var profilesCommented = gatherProfiles(data, "2"); // gathers a dictionary of all profiles commented on with number of comments on each profile
    var maxNumOfComments = calculateMaxNum(profilesCommented); // calculates maximum number of comments from all profiles commented on
    cOutput = storeInsights(profilesCommented, maxNumOfComments, "comments");
    cOutputFive = fiveInsights(cOutput);

    localStorage.setItem('fiveComments', cOutputFive);
    localStorage.setItem('comments', cOutput);

    document.getElementById('commentInsight').innerHTML = "[Most comments] " + mainInsight(cOutput);
}

function messageInsights(data) {
    var profilesMessaged = gatherProfilesM(data);
    var maxNumOfMessages = calculateMaxNum(profilesMessaged);
    mOutput = storeInsights(profilesMessaged, maxNumOfMessages, "messages");
    mOutputFive = fiveInsights(mOutput);

    localStorage.setItem('fiveMessages', mOutputFive);
    localStorage.setItem('messages', mOutput);

    document.getElementById('messageInsight').innerHTML = "[Most messages] " + mainInsight(mOutput);
}

function savedInsights(data) {
    var profilesSaved = gatherProfiles(data, "1");
    var maxNumOfSaves = calculateMaxNum(profilesSaved);
    sOutput = storeInsights(profilesSaved, maxNumOfSaves, "saved");
    sOutputFive = fiveInsights(sOutput);

    localStorage.setItem('fiveSaves', sOutputFive);
    localStorage.setItem('saved', sOutput);

    document.getElementById('savedInsight').innerHTML = "[Most saved posts] " + mainInsight(sOutput);
}

function gatherProfiles(content, category) {
    var profiles = {};
    var t = content.length;
    for (var i = 0; i < t; i++) {
        if (typeof profiles[(content[i][category])] == 'undefined') {
            profiles[(content[i][category])] = 1; // if first comment on this profile, then there is 1 comment on the profile
        } else {
            profiles[(content[i][category])]++; // if this profile is already commented on, then increment number of comments on profile
        }
    }
    return profiles;
}

function gatherProfilesM(content) {
    var profiles = {};
    var t = content.length;
    for (var i = 0; i < t; i++) {
        var u = content[i].conversation.length;
        for (var j = 0; j < u; j++) {
            if (typeof profiles[(content[i].participants[0])] == 'undefined') {
                profiles[(content[i].participants[0])] = 1; // if first message with this person, then there is 1 message with this person
            } else {
                profiles[(content[i].participants[0])]++; // if there are messages with this person already, then increment number of messages with profile
            }
        }
    }
    return profiles;
}

function storeInsights(profiles, max, category) {
    var returnText = "";
    for (var i = max; i > 0; i--) {
        for (var key in profiles) {
            if (profiles[key] == i && category == "messages") {
                returnText = returnText.concat("<p>Messages with " + "<b>" + key + "</b>" + "'s profile: " + profiles[key] + "</p>");
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
}

function mainInsight(insights) {
    var t = insights.length;
    for (var i = 0; i < t; i++) {
        if (insights[i] == '<' && insights[i + 1] == '/' && insights[i + 2] == 'p' && insights[i + 3] == '>') {
            return insights.slice(3, i + 3);
        }
    }
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