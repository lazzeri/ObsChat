let width = 1400;
let height = 800;
let down = 150;
let toTheRight = 100;
let broadcastId;
let userId;
let error = false;
let publicStreamerId = '7081785';
//User Colors:
let savedUsers = [];
let streamMods = [];
let goodies;
let chatBoxes = [];

//Features Customizable Set
//Basics Settings
let streamerName;
let chatWidth;
let padding;
let animation;
let fontFamily;
let fontSize;
let letterSpacing;
let wordSpacing;
let basicFontColor;
//Basic Chat
let bcFontWeight;
let bcIcons;
let bcColors;
//Moderators
let modFontWeight;
let modIcons;
let modColors;
//Subscribers
let subFontWeight;
let subIcons;
let subColors;
//SuperChat
let supFontWeight;
let supIcons;
let supColors;
let borderThickness;
let borderColor;
let borderStyle;
//Stuff to block
let blockInvites;
let blockCaptures;
let blockFan;
let blockHashtags;
let showAtSigns;
let blockSuperMessages;
let nicknameThickness;



//Random Setences
var verbs, nouns, adjectives, adverbs, preposition;
nouns = ["bird", "clock", "boy", "plastic", "duck", "teacher", "old lady", "professor", "hamster", "dog"];
verbs = ["kicked", "ran", "flew", "dodged", "sliced", "rolled", "died", "breathed", "slept", "killed"];
adjectives = ["beautiful", "lazy", "professional", "lovely", "dumb", "rough", "soft", "hot", "vibrating", "slimy"];
adverbs = ["slowly", "elegantly", "precisely", "quickly", "sadly", "humbly", "proudly", "shockingly", "calmly", "passionately"];
preposition = ["down", "into", "up", "on", "upon", "below", "above", "through", "across", "towards"];

//------------------------------------- BASICS -----------------------------------//
function setData()
{
    let mydata = JSON.parse(data);

    streamerName = mydata[0].streamerName;
    chatWidth = mydata[0].chatWidth;
    padding = mydata[0].padding;
    animation = mydata[0].animation;
    fontFamily = mydata[0].fontFamily;
    fontSize = mydata[0].fontSize;
    basicFontColor = mydata[0].basicFontColor;
    letterSpacing = mydata[0].letterSpacing;
    wordSpacing = mydata[0].wordSpacing;
    bcFontWeight = mydata[0].bcFontWeight;
    bcIcons = mydata[0].bcIcons;
    bcColors = mydata[0].bcColors;
    modFontWeight = mydata[0].modFontWeight;
    modIcons = mydata[0].modIcons;
    modColors = mydata[0].modColors;
    subFontWeight = mydata[0].subFontWeight;
    subIcons = mydata[0].subIcons;
    subColors = mydata[0].subColors;
    supFontWeight = mydata[0].supFontWeight;
    supIcons = mydata[0].supIcons;
    supColors = mydata[0].supColors;
    borderThickness = mydata[0].borderThickness;
    borderColor = mydata[0].borderColor;
    borderStyle = mydata[0].borderStyle;
    blockInvites = mydata[0].blockInvites;
    blockCaptures = mydata[0].blockCaptures;
    blockFan = mydata[0].blockFan;
    blockHashtags = mydata[0].blockHashtags;
    showAtSigns = mydata[0].showAtSigns;
    blockSuperMessages = mydata[0].blockSuperMessages;
    nicknameThickness = mydata[0].nicknameThickness;

}


//------------------------------------- BASICS -----------------------------------//
async function RunCode()
{
    setData();
    AddToChat("Connecting to Database..", "HelperRobot", "basic", 50250342, 0, 0, false, 0);
    await DownloadGifts ();
    await FetchBroadcastId ();
    await updateModsOverTime ();

}

//subscriptionType
async function updateModsOverTime()
{
    while(true)
    {
        await sleep (10000);
        console.log('bang');
        updateMods (streamerName);
    }
}

async function DownloadGifts()
{
    console.log ("Fetching Gifts...");
    targetUrl = 'https://ynassets.younow.com/giftsData/live/de/data.json';
    var json = fetch (targetUrl)
        .then (blob => blob.json ())
        .then (data =>
        {
            json = JSON.stringify (data, null, 2);
            goodies = JSON.parse (json);
        });
}

async function Retry()
{
    console.log ("Retrying in 5 seconds");
    AddToChat("Retrying in 5 seconds", "HelperRobot", "basic", 50250342, 0, 0, false, 0);

    await sleep (5000);
    error = false;
    FetchBroadcastId ();
}

async function FetchBroadcastId()
{
    console.log ("Fetching Broadcast....");
    var proxyUrl = 'https://younow-cors-header.herokuapp.com/?q=',
        targetUrl = 'https://api.younow.com/php/api/broadcast/info/curId=0/user=' + streamerName;
    var json = fetch (proxyUrl + targetUrl)
        .then (blob => blob.json ())
        .then (data =>
        {
            json = JSON.stringify (data, null, 2);
            let done = JSON.parse (json);
            console.log(done.errorCode);
            if (json.length < 1)
            {
                console.log ("No Data Found");
                error = true;
            } else if (done.errorCode === 102)
            {
                AddToChat("This user does not exist, please go check the Username input in the GeneratedOutput.json", "HelperRobot", "basic", 50250342, 0, 0, false, 0);
                error = true;
            }
            else if (done.errorCode !== 0)
            {
                console.log ("User not online..");
                AddToChat("User is not online", "HelperRobot", "basic", 50250342, 0, 0, false, 0);

                error = true;
            }
            if (error)
            {
                console.log ("Error Found Retrying")
                Retry ();
                return;
            } else
            {
                userId = done.userId;
                broadcastId = done.broadcastId;
                console.log ("Data Found");
                AddToChat("Successfully  connected", "HelperRobot", "basic", 50250342, 0, 0, false, 0);

                FetchEvent ();
                return;
            }
        })
        .catch (e =>
        {
        });
}

function FetchEvent()
{
    //First Startup Connection:
    console.log ("Succesfully Connected to WebSocket");
    let pusher = new Pusher ('d5b7447226fc2cd78dbb', {
        cluster: "younow"
    });
    let channel = pusher.subscribe ("public-channel_" + userId);

    channel.bind ('onSuperMessage', function (data)
    {
        for (let i = 0; i < data.message.superMessages.length; i++)
        {
            let input = data.message.superMessages[i].comment;
            let foundName = data.message.superMessages[i].name;
            let id = data.message.superMessages[i].userId;
            let crownsAmount = data.message.superMessages[i].globalSpenderRank;
            let isSub = data.message.superMessages[i].subscriptionType;
            let isMod = viewerIsMod (id);

            if (!blockSuperMessages)
            {
                if (!showAtSigns)
                {
                    AddToChat (input, foundName, 'superChat', id, publicStreamerId, crownsAmount, isSub, isMod);
                }
            }
        }
    });

    channel.bind ('onChat', function (data)
    {
        if (data.message !== "undefined")
        {
            for (let i = 0; i < data.message.comments.length; i++)
            {
                let isSub = data.message.comments[i].subscriptionType;
                let isMod = data.message.comments[i].broadcasterMod;
                let nickName = data.message.comments[i].name;
                let input = data.message.comments[i].comment;
                let id = data.message.comments[i].userId;
                let crownsAmount = data.message.comments[i].globalSpenderRank;
                let streamerId = data.message.comments[i].broadcasterId;
                publicStreamerId = streamerId;

                let shouldSend = true;

                if (blockFan)
                {
                    if (input.includes ("I became a fan!"))
                        shouldSend = false;
                }
                if (blockHashtags)
                {
                    if (input.includes ('#'))
                        shouldSend = false;
                }
                if (blockCaptures)
                {
                    if (input.includes ("captured a moment of"))
                        shouldSend = false;
                }
                if (blockInvites)
                {
                    if (input.includes ("to this broadcast"))
                        shouldSend = false;
                }
                if (showAtSigns)
                {
                    if (input.includes ("@"))
                        shouldSend = false;
                }
                if (input.toLowerCase ().includes ("@" + streamerName.toLowerCase ()))
                    shouldSend = true;

                if (shouldSend)
                {
                    console.log (nickName + ' Mod:' + isMod + ' Sub:' + isSub)

                    if (isMod)
                    {
                        AddToChat (input, nickName, 'mods', id, streamerId, crownsAmount, isSub, isMod);
                    } else if (isSub === 1)
                    {
                        AddToChat (input, nickName, 'subs', id, streamerId, crownsAmount, isSub, isMod);
                    } else
                    {
                        AddToChat (input, nickName, 'basic', id, streamerId, crownsAmount, isSub, isMod);
                    }
                }
            }
        }
    });

}


//-------------------------------- Animations --------------------------------//

function AddToChat(input, nickName, role, id, streamerId, crownsAmount, isSub, isMod)
{
    nickName = nickName.substring(0,19);
    let mainPanel = document.getElementById ("MainPanel");
    let newChatBox = document.createElement ("div");
    let maxPanelHeight = mainPanel.offsetHeight;

    newChatBox.style.fontFamily = fontFamily;
    newChatBox.style.width = chatWidth;
    newChatBox.style.position = "absolute";
    newChatBox.style.bottom = "0px";
    newChatBox.style.animation = animation;
    newChatBox.style.animationDuration = "1.0s";
    newChatBox.style.letterSpacing = letterSpacing;
    newChatBox.style.wordSpacing = wordSpacing;
    newChatBox.style.color = basicFontColor;
    newChatBox.style.fontSize = fontSize;
    newChatBox.id = uuidv4 ();
    newChatBox.style.display = "inline";

    let nickNameBox = document.createElement ("div");
    nickNameBox.style.fontSize = 17 + "px";
    nickNameBox.style.display = "inline";
    nickNameBox.innerText = nickName + ': \n';
    nickNameBox.style.fontWeight = getFontWeight (nicknameThickness);
    let textBox = document.createElement ("div");

    textBox.style.display = "inline";
    textBox.innerText = input;

    // Switch for the Roles
    //Roles get weighted like this: Mod < Sub < Normal

    switch (role)
    {
        case('basic'):
            //Font weight
            newChatBox.style.fontWeight = getFontWeight (bcFontWeight);
            //Colors
            if (bcColors.length > 0)
            {
                let randNum = Number.parseInt (randomNumber (0, bcColors.length));
                nickNameBox.style.color = bcColors[randNum];
            }
            //Normal One
            break;
        case('subs'):
            newChatBox.style.fontWeight = getFontWeight (subFontWeight);
            if (subColors.length > 0)
            {
                let randNum = Number.parseInt (randomNumber (0, subColors.length));
                nickNameBox.style.color = subColors[randNum];
            }
            break;
        case('superChat'):
            newChatBox.style.fontWeight = getFontWeight (supFontWeight);
            if (supColors.length > 0)
            {
                let randNum = Number.parseInt (randomNumber (0, supColors.length));
                nickNameBox.style.color = supColors[randNum];
            }
            newChatBox.style.borderWidth = borderThickness;
            newChatBox.style.borderStyle = borderStyle;
            newChatBox.style.borderColor = borderColor;
            break;
        case('mods'):
            newChatBox.style.fontWeight = getFontWeight (modFontWeight);
            //Colors
            if (modColors.length > 0)
            {
                let randNum = Number.parseInt (randomNumber (0, modColors.length));
                nickNameBox.style.color = modColors[randNum];
            }
            break;
    }


    //---------------------
    document.getElementById ("MainPanel").append (newChatBox);
    document.getElementById (newChatBox.id).append (nickNameBox);
    document.getElementById (newChatBox.id).append (textBox);
    let checkBoxHeight = parseInt (document.getElementById (newChatBox.id).offsetHeight);
    document.getElementById (newChatBox.id).removeChild (nickNameBox);
    document.getElementById (newChatBox.id).removeChild (textBox);

    let fillerDiv;
    //Add Profile Picture if wanted:
    if (shouldAddPicture (role))
    {
        fillerDiv = document.createElement ("div");
        fillerDiv.style.width = "50px";
        let filler = 30;

        fillerDiv.style.height = (checkBoxHeight + filler) + "px";
        fillerDiv.style.float = "left";
        fillerDiv.style.marginRight = "7px";
        let profilePic = document.createElement ("div");
        profilePic.style.height = "50px";
        profilePic.style.width = "50px";
        profilePic.style.backgroundSize = 'contain';
        profilePic.style.borderRadius = '55%';
        profilePic.style.backgroundImage = "url(https://ynassets.younow.com/user/live/" + id + "/" + id + ".jpg)";

        fillerDiv.append (profilePic);
        document.getElementById (newChatBox.id).append (fillerDiv);

    }

    //This is were we add the icons
    switch (role)
    {
        case('basic'):
            //Can be sub can not be mod
            if (shouldAddIcon (role))
            {
                addIcon ('icons/Normal.svg', newChatBox.id);
                if (isSub === 1)
                    addIcon ('https://ynassets.younow.com/subscriptions/live/' + streamerId + '/1/badge.png', newChatBox.id);
            }
            break;
        case('subs'):
            //Cant be a mod cant be basic
            if (shouldAddIcon (role))
                addIcon ('https://ynassets.younow.com/subscriptions/live/' + streamerId + '/1/badge.png', newChatBox.id);
            break;
        case('superChat'):
            //Can be both: not basic
            if (shouldAddIcon (role))
            {
                console.log (isMod + " " + isSub);
                if (isMod)
                    addIcon ('icons/Mod.svg', newChatBox.id,20,17);
                if (isSub === 1)
                    addIcon ('https://ynassets.younow.com/subscriptions/live/' + streamerId + '/1/badge.png', newChatBox.id);
            }
            break;
        //Can be subs not basic
        case('mods'):
            if (shouldAddIcon (role))
            {
                addIcon ('icons/Mod.svg', newChatBox.id,20,17);
                if (isSub === 1)
                    addIcon ('https://ynassets.younow.com/subscriptions/live/' + streamerId + '/1/badge.png', newChatBox.id);

            }
            break;
    }

    if (shouldAddIcon (role))
    {
        switch (crownsAmount)
        {
            case(1):
                addIcon ('icons/Crown' + crownsAmount + '.svg', newChatBox.id);
                break;
            case(2):
                addIcon ('icons/Crown' + crownsAmount + '.svg', newChatBox.id);
                break;
            case(3):
                addIcon ('icons/Crown' + crownsAmount + '.svg', newChatBox.id);
                break;
            case(4):
                addIcon ('icons/Crown' + crownsAmount + '.svg', newChatBox.id);
                break;
            case(5):
                addIcon ('icons/Crown' + crownsAmount + '.svg', newChatBox.id);
                break;
            case(6):
                addIcon ('icons/Crown' + crownsAmount + '.svg', newChatBox.id);
                break;
            case(7):
                addIcon ('icons/Crown' + crownsAmount + '.svg', newChatBox.id);
                break;
            case(8):
                addIcon ('icons/Crown' + crownsAmount + '.svg', newChatBox.id);
                break;
            default:
                break;
        }
    }


    document.getElementById (newChatBox.id).append (nickNameBox);
    document.getElementById (newChatBox.id).append (textBox);
    chatBoxes.push (newChatBox);

    if (shouldAddPicture (role))
        fillerDiv.style.height = (parseInt (document.getElementById (newChatBox.id).offsetHeight)+10)+ "px";


    //This is for the chat to scroll up
    let newBoxSize = parseInt (newChatBox.offsetHeight);
    for (let i = 0; i < chatBoxes.length; i++)
    {
        if (chatBoxes[i].getBoundingClientRect ().top < 70)
        {
            let elem = document.getElementById (chatBoxes[i].id);
            chatBoxes.splice (i, 1);
            mainPanel.removeChild (elem);
        }
    }

    //Iterate through array without changing the last one
    for (let i = 0; i < chatBoxes.length - 1; i++)
    {
        let convert = parseInt (chatBoxes[i].style.bottom);
        chatBoxes[i].style.bottom = (Number.parseInt (padding) + convert + newBoxSize) + "px";
    }

}

function shouldAddPicture(role)
{
    //Icon
    switch (role)
    {
        case 'basic':
            if (bcIcons.localeCompare ('Icons and Profile Pictures') === 0 || bcIcons.localeCompare ('Profile Pictures') === 0)
                return true;
            break;
        case 'subs':
            if (subIcons.localeCompare ('Icons and Profile Pictures') === 0 || subIcons.localeCompare ('Profile Pictures') === 0)
            {
                return true;
            }
            break;
        case 'superChat':
            if (supIcons.localeCompare ('Profile Pictures') === 0 || supIcons.localeCompare ('Icons and Profile Pictures') === 0)
            {
                return true;
            }
            break;
        case 'mods':
            if (modIcons.localeCompare ('Icons and Profile Pictures') === 0 || modIcons.localeCompare ('Profile Pictures') === 0)
                return true;
            break;
        default:
            return false;
    }
    return false;
}

function shouldAddIcon(role)
{

    //Icon
    switch (role)
    {
        case 'basic':
            if (bcIcons.localeCompare ('Icons and Profile Pictures') === 0 || bcIcons.localeCompare ('Icons') === 0)
                return true;
            break;
        case 'superChat':
            if (supIcons.localeCompare ('Icons and Profile Pictures') === 0 || supIcons.localeCompare ('Icons') === 0)
                return true;
            break;
        case 'subs':
            if (subIcons.localeCompare ('Icons and Profile Pictures') === 0 || bcIcons.localeCompare ('Icons') === 0)
                return true;
            break;
        case 'mods':
            if (modIcons.localeCompare ('Icons and Profile Pictures') === 0 || bcIcons.localeCompare ('Icons') === 0)
                return true;
            break;
        default:
            return false;
    }
    return false;
}

function setName(name)
{
    streamerName = name;
}

function ChangeChatWidth(i)
{
    let elem = document.getElementById ('MainPanel');
    elem.style.width = i + 'px';
}



function addIcon(url, chatBoxId,height = 21,width = 21)
{
    let icon = document.createElement ("div");
    icon.style.height = height + "px";
    icon.style.width = width + "px";
    icon.style.marginTop = "2px";
    icon.style.backgroundSize = 'contain';
    icon.style.float = 'left';
    icon.style.marginRight = '2px';
    icon.style.backgroundImage = "url(" + url + ")";

    document.getElementById (chatBoxId).append (icon);

}

//----------------------------- Additional Functions -----------------------------------------//

function sleep(milliseconds)
{
    return new Promise (resolve => setTimeout (resolve, milliseconds));
}

function ResetChat()
{
    let mainPanel = document.getElementById ('MainPanel');
    for (let i = 0; i < chatBoxes.length; i++)
    {
        let elem = document.getElementById (chatBoxes[i].id);
        mainPanel.removeChild (elem);
    }
    chatBoxes = [];
}

function randGen()
{
    return Math.floor (Math.random () * 5);
}

function randomNumber(min, max)
{
    return Math.random () * (max - min) + min;
}

function allEmojis()
{
    return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83E\uDDD1(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFE])|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83C\uDFF3\uFE0F\u200D\u26A7|\uD83E\uDDD1(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC3B\u200D\u2744|(?:(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u2764\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]|\uD83D[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\uD83D\uDC41\uFE0F|\uD83C\uDFF3\uFE0F|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])?|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF4|(?:[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270C\u270D]|\uD83D[\uDD74\uDD90])(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC08\uDC15\uDC3B\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5]|\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD]|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0D\uDD0E\uDD10-\uDD17\uDD1D\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78\uDD7A-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCB\uDDD0\uDDE0-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6]/g;
}

function uuidv4()
{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace (/[xy]/g, function (c)
    {
        var r = Math.random () * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString (16);
    });
}

function updateColors(role)
{
    switch (role)
    {
        case('basic'):
            let a = document.getElementById ('colorAdder');
            bcColors = [];
            for (let i = 0; i < a.children.length; i++)
            {
                bcColors.push (a.children[i].value);
            }
            break;
        case('subscribers'):
            let b = document.getElementById ('subColorAdder');
            subColors = [];
            for (let i = 0; i < b.children.length; i++)
            {
                subColors.push (b.children[i].value);
            }
            break;
        case('mods'):
            let m = document.getElementById ('modColorAdder');
            modColors = [];
            for (let i = 0; i < m.children.length; i++)
            {
                modColors.push (m.children[i].value);
            }
            break;
        case('superChat'):
            let s = document.getElementById ('superColorAdder');
            supColors = [];
            for (let i = 0; i < s.children.length; i++)
            {
                supColors.push (s.children[i].value);
            }
            break;
        case('Grid'):
        {
            borderColor = document.getElementById ('borderColor').value;
        }
    }
}


function addColor(elemId, role)
{
    let elem = document.getElementById (elemId);
    let newColor = document.createElement ("input");
    newColor.setAttribute ("type", "color");
    newColor.addEventListener ('change', function ()
    {
        updateColors (role)
    }, false);
    newColor.style.width = '40px';
    newColor.style.height = '40px';
    elem.append (newColor);
    updateColors (role);
}

function removeColor(elemId, role)
{
    let elem = document.getElementById (elemId);
    if (elem.lastElementChild != null) elem.removeChild (elem.lastElementChild);
    updateColors (role);
}

function resetSettings()
{
    document.getElementById ('basicPreferences').style.display = 'none';
    document.getElementById ('basicChat').style.display = 'none';
    document.getElementById ('subscriber').style.display = 'none';
    document.getElementById ('mods').style.display = 'none';
    document.getElementById ('superChat').style.display = 'none';
    document.getElementById ('whatToShow').style.display = 'none';

}

function showFolder(name)
{
    resetSettings ();
    switch (name)
    {
        case('Basic Preferences'):
            document.getElementById ('basicPreferences').style.display = 'block';
            break;
        case('Basic Chat'):
            document.getElementById ('basicChat').style.display = 'block';
            break;
        case('Subscribers'):
            document.getElementById ('subscriber').style.display = 'block';
            break;
        case('Mods'):
            document.getElementById ('mods').style.display = 'block';
            break;
        case('SuperChat'):
            document.getElementById ('superChat').style.display = 'block';
            break;
        case('Icons'):
            document.getElementById ('icons').style.display = 'block';
            break;
        case('What to Block'):
            document.getElementById ('whatToShow').style.display = 'block';
            break;
    }


}

function setBlocks(elem)
{
    switch (elem.id)
    {
        case 'showInvites':
            blockInvites = elem.checked;
            break;
        case 'showCaptures':
            blockCaptures = elem.checked;
            break;
        case 'showFan':
            blockFan = elem.checked;
            break;
        case 'showHashtags':
            blockHashtags = elem.checked;
            break;
        case 'showAtSigns':
            showAtSigns = elem.checked;
            break;
        case 'blockSuperMessages':
            blockSuperMessages = elem.checked;
            break;
    }
}


function setLetterSpacing(elem)
{
    letterSpacing = elem;
}

function setWordSpacing(elem)
{
    wordSpacing = elem;
}

function setBasicFontColor(elem)
{
    basicFontColor = elem;
}

function AddChat(role, id, streamId, crownsAmount, isSub, isMod)
{
    var rand1 = Math.floor (Math.random () * 10);
    var rand2 = Math.floor (Math.random () * 10);
    var rand3 = Math.floor (Math.random () * 10);
    var rand4 = Math.floor (Math.random () * 10);
    var rand5 = Math.floor (Math.random () * 10);
    var rand6 = Math.floor (Math.random () * 10);
    var content = "The " + adjectives[rand1] + " " + nouns[rand2] + " " + adverbs[rand3] + " " + verbs[rand4] + " because some " + nouns[rand1] + " " + adverbs[rand1] + " " + verbs[rand1] + " " + preposition[rand1] + " a " + adjectives[rand2] + " " + nouns[rand5] + " which, became a " + adjectives[rand3] + ", " + adjectives[rand4] + " " + nouns[rand6] + ".";
    let randomId = [7746914, 22751048, 168780, 9835723, 31162113, 15466670, 10565823, 42462616, 39780508];

    let randomNum = Number.parseInt (randomNumber (0, randomId.length - 1));
    AddToChat (content, generateName (), role, randomId[randomNum], streamId, crownsAmount, isSub, isMod);
}

function getFontWeight(elem)
{
    switch (elem)
    {
        case('Light'):
            return 400;
            break;
        case('Medium'):
            return 600;
            break;
        case('Bold'):
            return 1000;
        default:
            return elem;
            break;
    }
}

function viewerIsMod(viewerId)
{
    for (let i = 0; i < streamMods.length; i++)
    {
        console.log ('Comparing: ' + streamMods[i] + "   " + viewerId)
        if (streamMods[i] === viewerId)
        {
            console.log ('WORKED');
            return true;
        }
    }
    return false;
}

function updateMods(streamName)
{
    console.log ("Fetching Broadcast....");
    let proxyUrl = 'https://younow-cors-header.herokuapp.com/?q=',
        targetUrl = 'https://api.younow.com/php/api/broadcast/info/curId=0/user=' + streamName;
    let json = fetch (proxyUrl + targetUrl)
        .then (blob => blob.json ())
        .then (data =>
        {
            json = JSON.stringify (data, null, 2);
            let done = JSON.parse (json);
            if (done.broadcastMods)
            {
                let mods = JSON.parse (done.broadcastMods)
                streamMods = mods;
            }
        });
    return false;
}

function UserWithColor(id, color)
{
    this.id = id;
    this.color = color;
}

function generateName()
{
    let name1 = ["abandoned", "able", "absolute", "adorable", "adventurous", "academic", "acceptable", "acclaimed", "accomplished", "accurate", "aching", "acidic", "acrobatic", "active", "actual", "adept", "admirable", "admired", "adolescent", "adorable", "adored", "advanced", "afraid", "affectionate", "aged", "aggravating", "aggressive", "agile", "agitated", "agonizing", "agreeable", "ajar", "alarmed", "alarming", "alert", "alienated", "alive", "all", "altruistic", "amazing", "ambitious", "ample", "amused", "amusing", "anchored", "ancient", "angelic", "angry", "anguished", "animated", "annual", "another", "antique", "anxious", "any", "apprehensive", "appropriate", "apt", "arctic", "arid", "aromatic", "artistic", "ashamed", "assured", "astonishing", "athletic", "attached", "attentive", "attractive", "austere", "authentic", "authorized", "automatic", "avaricious", "average", "aware", "awesome", "awful", "awkward", "babyish", "bad", "back", "baggy", "bare", "barren", "basic", "beautiful", "belated", "beloved", "beneficial", "better", "best", "bewitched", "big", "big-hearted", "biodegradable", "bite-sized", "bitter", "black", "black-and-white", "bland", "blank", "blaring", "bleak", "blind", "blissful", "blond", "blue", "blushing", "bogus", "boiling", "bold", "bony", "boring", "bossy", "both", "bouncy", "bountiful", "bowed", "brave", "breakable", "brief", "bright", "brilliant", "brisk", "broken", "bronze", "brown", "bruised", "bubbly", "bulky", "bumpy", "buoyant", "burdensome", "burly", "bustling", "busy", "buttery", "buzzing", "calculating", "calm", "candid", "canine", "capital", "carefree", "careful", "careless", "caring", "cautious", "cavernous", "celebrated", "charming", "cheap", "cheerful", "cheery", "chief", "chilly", "chubby", "circular", "classic", "clean", "clear", "clear-cut", "clever", "close", "closed", "cloudy", "clueless", "clumsy", "cluttered", "coarse", "cold", "colorful", "colorless", "colossal", "comfortable", "common", "compassionate", "competent", "complete", "complex", "complicated", "composed", "concerned", "concrete", "confused", "conscious", "considerate", "constant", "content", "conventional", "cooked", "cool", "cooperative", "coordinated", "corny", "corrupt", "costly", "courageous", "courteous", "crafty", "crazy", "creamy", "creative", "creepy", "criminal", "crisp", "critical", "crooked", "crowded", "cruel", "crushing", "cuddly", "cultivated", "cultured", "cumbersome", "curly", "curvy", "cute", "cylindrical", "damaged", "damp", "dangerous", "dapper", "daring", "darling", "dark", "dazzling", "dead", "deadly", "deafening", "dear", "dearest", "decent", "decimal", "decisive", "deep", "defenseless", "defensive", "defiant", "deficient", "definite", "definitive", "delayed", "delectable", "delicious", "delightful", "delirious", "demanding", "dense", "dental", "dependable", "dependent", "descriptive", "deserted", "detailed", "determined", "devoted", "different", "difficult", "digital", "diligent", "dim", "dimpled", "dimwitted", "direct", "disastrous", "discrete", "disfigured", "disgusting", "disloyal", "dismal", "distant", "downright", "dreary", "dirty", "disguised", "dishonest", "dismal", "distant", "distinct", "distorted", "dizzy", "dopey", "doting", "double", "downright", "drab", "drafty", "dramatic", "dreary", "droopy", "dry", "dual", "dull", "dutiful", "each", "eager", "earnest", "early", "easy", "easy-going", "ecstatic", "edible", "educated", "elaborate", "elastic", "elated", "elderly", "electric", "elegant", "elementary", "elliptical", "embarrassed", "embellished", "eminent", "emotional", "empty", "enchanted", "enchanting", "energetic", "enlightened", "enormous", "enraged", "entire", "envious", "equal", "equatorial", "essential", "esteemed", "ethical", "euphoric", "even", "evergreen", "everlasting", "every", "evil", "exalted", "excellent", "exemplary", "exhausted", "excitable", "excited", "exciting", "exotic", "expensive", "experienced", "expert", "extraneous", "extroverted", "extra-large", "extra-small", "fabulous", "failing", "faint", "fair", "faithful", "fake", "false", "familiar", "famous", "fancy", "fantastic", "far", "faraway", "far-flung", "far-off", "fast", "fat", "fatal", "fatherly", "favorable", "favorite", "fearful", "fearless", "feisty", "feline", "female", "feminine", "few", "fickle", "filthy", "fine", "finished", "firm", "first", "firsthand", "fitting", "fixed", "flaky", "flamboyant", "flashy", "flat", "flawed", "flawless", "flickering", "flimsy", "flippant", "flowery", "fluffy", "fluid", "flustered", "focused", "fond", "foolhardy", "foolish", "forceful", "forked", "formal", "forsaken", "forthright", "fortunate", "fragrant", "frail", "frank", "frayed", "free", "French", "fresh", "frequent", "friendly", "frightened", "frightening", "frigid", "frilly", "frizzy", "frivolous", "front", "frosty", "frozen", "frugal", "fruitful", "full", "fumbling", "functional", "funny", "fussy", "fuzzy", "gargantuan", "gaseous", "general", "generous", "gentle", "genuine", "giant", "giddy", "gigantic", "gifted", "giving", "glamorous", "glaring", "glass", "gleaming", "gleeful", "glistening", "glittering", "gloomy", "glorious", "glossy", "glum", "golden", "good", "good-natured", "gorgeous", "graceful", "gracious", "grand", "grandiose", "granular", "grateful", "grave", "gray", "great", "greedy", "green", "gregarious", "grim", "grimy", "gripping", "grizzled", "gross", "grotesque", "grouchy", "grounded", "growing", "growling", "grown", "grubby", "gruesome", "grumpy", "guilty", "gullible", "gummy", "hairy", "half", "handmade", "handsome", "handy", "happy", "happy-go-lucky", "hard", "hard-to-find", "harmful", "harmless", "harmonious", "harsh", "hasty", "hateful", "haunting", "healthy", "heartfelt", "hearty", "heavenly", "heavy", "hefty", "helpful", "helpless", "hidden", "hideous", "high", "high-level", "hilarious", "hoarse", "hollow", "homely", "honest", "honorable", "honored", "hopeful", "horrible", "hospitable", "hot", "huge", "humble", "humiliating", "humming", "humongous", "hungry", "hurtful", "husky", "icky", "icy", "ideal", "idealistic", "identical", "idle", "idiotic", "idolized", "ignorant", "ill", "illegal", "ill-fated", "ill-informed", "illiterate", "illustrious", "imaginary", "imaginative", "immaculate", "immaterial", "immediate", "immense", "impassioned", "impeccable", "impartial", "imperfect", "imperturbable", "impish", "impolite", "important", "impossible", "impractical", "impressionable", "impressive", "improbable", "impure", "inborn", "incomparable", "incompatible", "incomplete", "inconsequential", "incredible", "indelible", "inexperienced", "indolent", "infamous", "infantile", "infatuated", "inferior", "infinite", "informal", "innocent", "insecure", "insidious", "insignificant", "insistent", "instructive", "insubstantial", "intelligent", "intent", "intentional", "interesting", "internal", "international", "intrepid", "ironclad", "irresponsible", "irritating", "itchy", "jaded", "jagged", "jam-packed", "jaunty", "jealous", "jittery", "joint", "jolly", "jovial", "joyful", "joyous", "jubilant", "judicious", "juicy", "jumbo", "junior", "jumpy", "juvenile", "kaleidoscopic", "keen", "key", "kind", "kindhearted", "kindly", "klutzy", "knobby", "knotty", "knowledgeable", "knowing", "known", "kooky", "kosher", "lame", "lanky", "large", "last", "lasting", "late", "lavish", "lawful", "lazy", "leading", "lean", "leafy", "left", "legal", "legitimate", "light", "lighthearted", "likable", "likely", "limited", "limp", "limping", "linear", "lined", "liquid", "little", "live", "lively", "livid", "loathsome", "lone", "lonely", "long", "long-term", "loose", "lopsided", "lost", "loud", "lovable", "lovely", "loving", "low", "loyal", "lucky", "lumbering", "luminous", "lumpy", "lustrous", "luxurious", "mad", "made-up", "magnificent", "majestic", "major", "male", "mammoth", "married", "marvelous", "masculine", "massive", "mature", "meager", "mealy", "mean", "measly", "meaty", "medical", "mediocre", "medium", "meek", "mellow", "melodic", "memorable", "menacing", "merry", "messy", "metallic", "mild", "milky", "mindless", "miniature", "minor", "minty", "miserable", "miserly", "misguided", "misty", "mixed", "modern", "modest", "moist", "monstrous", "monthly", "monumental", "moral", "mortified", "motherly", "motionless", "mountainous", "muddy", "muffled", "multicolored", "mundane", "murky", "mushy", "musty", "muted", "mysterious", "naive", "narrow", "nasty", "natural", "naughty", "nautical", "near", "neat", "necessary", "needy", "negative", "neglected", "negligible", "neighboring", "nervous", "new", "next", "nice", "nifty", "nimble", "nippy", "nocturnal", "noisy", "nonstop", "normal", "notable", "noted", "noteworthy", "novel", "noxious", "numb", "nutritious", "nutty", "obedient", "obese", "oblong", "oily", "oblong", "obvious", "occasional", "odd", "oddball", "offbeat", "offensive", "official", "old", "old-fashioned", "only", "open", "optimal", "optimistic", "opulent", "orange", "orderly", "organic", "ornate", "ornery", "ordinary", "original", "other", "our", "outlying", "outgoing", "outlandish", "outrageous", "outstanding", "oval", "overcooked", "overdue", "overjoyed", "overlooked", "palatable", "pale", "paltry", "parallel", "parched", "partial", "passionate", "past", "pastel", "peaceful", "peppery", "perfect", "perfumed", "periodic", "perky", "personal", "pertinent", "pesky", "pessimistic", "petty", "phony", "physical", "piercing", "pink", "pitiful", "plain", "plaintive", "plastic", "playful", "pleasant", "pleased", "pleasing", "plump", "plush", "polished", "polite", "political", "pointed", "pointless", "poised", "poor", "popular", "portly", "posh", "positive", "possible", "potable", "powerful", "powerless", "practical", "precious", "present", "prestigious", "pretty", "precious", "previous", "pricey", "prickly", "primary", "prime", "pristine", "private", "prize", "probable", "productive", "profitable", "profuse", "proper", "proud", "prudent", "punctual", "pungent", "puny", "pure", "purple", "pushy", "putrid", "puzzled", "puzzling", "quaint", "qualified", "quarrelsome", "quarterly", "queasy", "querulous", "questionable", "quick", "quick-witted", "quiet", "quintessential", "quirky", "quixotic", "quizzical", "radiant", "ragged", "rapid", "rare", "rash", "raw", "recent", "reckless", "rectangular", "ready", "real", "realistic", "reasonable", "red", "reflecting", "regal", "regular", "reliable", "relieved", "remarkable", "remorseful", "remote", "repentant", "required", "respectful", "responsible", "repulsive", "revolving", "rewarding", "rich", "rigid", "right", "ringed", "ripe", "roasted", "robust", "rosy", "rotating", "rotten", "rough", "round", "rowdy", "royal", "rubbery", "rundown", "ruddy", "rude", "runny", "rural", "rusty", "sad", "safe", "salty", "same", "sandy", "sane", "sarcastic", "sardonic", "satisfied", "scaly", "scarce", "scared", "scary", "scented", "scholarly", "scientific", "scornful", "scratchy", "scrawny", "second", "secondary", "second-hand", "secret", "self-assured", "self-reliant", "selfish", "sentimental", "separate", "serene", "serious", "serpentine", "several", "severe", "shabby", "shadowy", "shady", "shallow", "shameful", "shameless", "sharp", "shimmering", "shiny", "shocked", "shocking", "shoddy", "short", "short-term", "showy", "shrill", "shy", "sick", "silent", "silky", "silly", "silver", "similar", "simple", "simplistic", "sinful", "single", "sizzling", "skeletal", "skinny", "sleepy", "slight", "slim", "slimy", "slippery", "slow", "slushy", "small", "smart", "smoggy", "smooth", "smug", "snappy", "snarling", "sneaky", "sniveling", "snoopy", "sociable", "soft", "soggy", "solid", "somber", "some", "spherical", "sophisticated", "sore", "sorrowful", "soulful", "soupy", "sour", "Spanish", "sparkling", "sparse", "specific", "spectacular", "speedy", "spicy", "spiffy", "spirited", "spiteful", "splendid", "spotless", "spotted", "spry", "square", "squeaky", "squiggly", "stable", "staid", "stained", "stale", "standard", "starchy", "stark", "starry", "steep", "sticky", "stiff", "stimulating", "stingy", "stormy", "straight", "strange", "steel", "strict", "strident", "striking", "striped", "strong", "studious", "stunning", "stupendous", "stupid", "sturdy", "stylish", "subdued", "submissive", "substantial", "subtle", "suburban", "sudden", "sugary", "sunny", "super", "superb", "superficial", "superior", "supportive", "sure-footed", "surprised", "suspicious", "svelte", "sweaty", "sweet", "sweltering", "swift", "sympathetic", "tall", "talkative", "tame", "tan", "tangible", "tart", "tasty", "tattered", "taut", "tedious", "teeming", "tempting", "tender", "tense", "tepid", "terrible", "terrific", "testy", "thankful", "that", "these", "thick", "thin", "third", "thirsty", "this", "thorough", "thorny", "those", "thoughtful", "threadbare", "thrifty", "thunderous", "tidy", "tight", "timely", "tinted", "tiny", "tired", "torn", "total", "tough", "traumatic", "treasured", "tremendous", "tragic", "trained", "tremendous", "triangular", "tricky", "trifling", "trim", "trivial", "troubled", "true", "trusting", "trustworthy", "trusty", "truthful", "tubby", "turbulent", "twin", "ugly", "ultimate", "unacceptable", "unaware", "uncomfortable", "uncommon", "unconscious", "understated", "unequaled", "uneven", "unfinished", "unfit", "unfolded", "unfortunate", "unhappy", "unhealthy", "uniform", "unimportant", "unique", "united", "unkempt", "unknown", "unlawful", "unlined", "unlucky", "unnatural", "unpleasant", "unrealistic", "unripe", "unruly", "unselfish", "unsightly", "unsteady", "unsung", "untidy", "untimely", "untried", "untrue", "unused", "unusual", "unwelcome", "unwieldy", "unwilling", "unwitting", "unwritten", "upbeat", "upright", "upset", "urban", "usable", "used", "useful", "useless", "utilized", "utter", "vacant", "vague", "vain", "valid", "valuable", "vapid", "variable", "vast", "velvety", "venerated", "vengeful", "verifiable", "vibrant", "vicious", "victorious", "vigilant", "vigorous", "villainous", "violet", "violent", "virtual", "virtuous", "visible", "vital", "vivacious", "vivid", "voluminous", "wan", "warlike", "warm", "warmhearted", "warped", "wary", "wasteful", "watchful", "waterlogged", "watery", "wavy", "wealthy", "weak", "weary", "webbed", "wee", "weekly", "weepy", "weighty", "weird", "welcome", "well-documented", "well-groomed", "well-informed", "well-lit", "well-made", "well-off", "well-to-do", "well-worn", "wet", "which", "whimsical", "whirlwind", "whispered", "white", "whole", "whopping", "wicked", "wide", "wide-eyed", "wiggly", "wild", "willing", "wilted", "winding", "windy", "winged", "wiry", "wise", "witty", "wobbly", "woeful", "wonderful", "wooden", "woozy", "wordy", "worldly", "worn", "worried", "worrisome", "worse", "worst", "worthless", "worthwhile", "worthy", "wrathful", "wretched", "writhing", "wrong", "wry", "yawning", "yearly", "yellow", "yellowish", "young", "youthful", "yummy", "zany", "zealous", "zesty", "zigzag", "rocky"];

    let name2 = ["people", "history", "way", "art", "world", "information", "map", "family", "government", "health", "system", "computer", "meat", "year", "thanks", "music", "person", "reading", "method", "data", "food", "understanding", "theory", "law", "bird", "literature", "problem", "software", "control", "knowledge", "power", "ability", "economics", "love", "internet", "television", "science", "library", "nature", "fact", "product", "idea", "temperature", "investment", "area", "society", "activity", "story", "industry", "media", "thing", "oven", "community", "definition", "safety", "quality", "development", "language", "management", "player", "variety", "video", "week", "security", "country", "exam", "movie", "organization", "equipment", "physics", "analysis", "policy", "series", "thought", "basis", "boyfriend", "direction", "strategy", "technology", "army", "camera", "freedom", "paper", "environment", "child", "instance", "month", "truth", "marketing", "university", "writing", "article", "department", "difference", "goal", "news", "audience", "fishing", "growth", "income", "marriage", "user", "combination", "failure", "meaning", "medicine", "philosophy", "teacher", "communication", "night", "chemistry", "disease", "disk", "energy", "nation", "road", "role", "soup", "advertising", "location", "success", "addition", "apartment", "education", "math", "moment", "painting", "politics", "attention", "decision", "event", "property", "shopping", "student", "wood", "competition", "distribution", "entertainment", "office", "population", "president", "unit", "category", "cigarette", "context", "introduction", "opportunity", "performance", "driver", "flight", "length", "magazine", "newspaper", "relationship", "teaching", "cell", "dealer", "debate", "finding", "lake", "member", "message", "phone", "scene", "appearance", "association", "concept", "customer", "death", "discussion", "housing", "inflation", "insurance", "mood", "woman", "advice", "blood", "effort", "expression", "importance", "opinion", "payment", "reality", "responsibility", "situation", "skill", "statement", "wealth", "application", "city", "county", "depth", "estate", "foundation", "grandmother", "heart", "perspective", "photo", "recipe", "studio", "topic", "collection", "depression", "imagination", "passion", "percentage", "resource", "setting", "ad", "agency", "college", "connection", "criticism", "debt", "description", "memory", "patience", "secretary", "solution", "administration", "aspect", "attitude", "director", "personality", "psychology", "recommendation", "response", "selection", "storage", "version", "alcohol", "argument", "complaint", "contract", "emphasis", "highway", "loss", "membership", "possession", "preparation", "steak", "union", "agreement", "cancer", "currency", "employment", "engineering", "entry", "interaction", "limit", "mixture", "preference", "region", "republic", "seat", "tradition", "virus", "actor", "classroom", "delivery", "device", "difficulty", "drama", "election", "engine", "football", "guidance", "hotel", "match", "owner", "priority", "protection", "suggestion", "tension", "variation", "anxiety", "atmosphere", "awareness", "bread", "climate", "comparison", "confusion", "construction", "elevator", "emotion", "employee", "employer", "guest", "height", "leadership", "mall", "manager", "operation", "recording", "respect", "sample", "transportation", "boring", "charity", "cousin", "disaster", "editor", "efficiency", "excitement", "extent", "feedback", "guitar", "homework", "leader", "mom", "outcome", "permission", "presentation", "promotion", "reflection", "refrigerator", "resolution", "revenue", "session", "singer", "tennis", "basket", "bonus", "cabinet", "childhood", "church", "clothes", "coffee", "dinner", "drawing", "hair", "hearing", "initiative", "judgment", "lab", "measurement", "mode", "mud", "orange", "poetry", "police", "possibility", "procedure", "queen", "ratio", "relation", "restaurant", "satisfaction", "sector", "signature", "significance", "song", "tooth", "town", "vehicle", "volume", "wife", "accident", "airport", "appointment", "arrival", "assumption", "baseball", "chapter", "committee", "conversation", "database", "enthusiasm", "error", "explanation", "farmer", "gate", "girl", "hall", "historian", "hospital", "injury", "instruction", "maintenance", "manufacturer", "meal", "perception", "pie", "poem", "presence", "proposal", "reception", "replacement", "revolution", "river", "son", "speech", "tea", "village", "warning", "winner", "worker", "writer", "assistance", "breath", "buyer", "chest", "chocolate", "conclusion", "contribution", "cookie", "courage", "desk", "drawer", "establishment", "examination", "garbage", "grocery", "honey", "impression", "improvement", "independence", "insect", "inspection", "inspector", "king", "ladder", "menu", "penalty", "piano", "potato", "profession", "professor", "quantity", "reaction", "requirement", "salad", "sister", "supermarket", "tongue", "weakness", "wedding", "affair", "ambition", "analyst", "apple", "assignment", "assistant", "bathroom", "bedroom", "beer", "birthday", "celebration", "championship", "cheek", "client", "consequence", "departure", "diamond", "dirt", "ear", "fortune", "friendship", "funeral", "gene", "girlfriend", "hat", "indication", "intention", "lady", "midnight", "negotiation", "obligation", "passenger", "pizza", "platform", "poet", "pollution", "recognition", "reputation", "shirt", "speaker", "stranger", "surgery", "sympathy", "tale", "throat", "trainer", "uncle", "youth", "time", "work", "film", "water", "money", "example", "while", "business", "study", "game", "life", "form", "air", "day", "place", "number", "part", "field", "fish", "back", "process", "heat", "hand", "experience", "job", "book", "end", "point", "type", "home", "economy", "value", "body", "market", "guide", "interest", "state", "radio", "course", "company", "price", "size", "card", "list", "mind", "trade", "line", "care", "group", "risk", "word", "fat", "force", "key", "light", "training", "name", "school", "top", "amount", "level", "order", "practice", "research", "sense", "service", "piece", "web", "boss", "sport", "fun", "house", "page", "term", "test", "answer", "sound", "focus", "matter", "kind", "soil", "board", "oil", "picture", "access", "garden", "range", "rate", "reason", "future", "site", "demand", "exercise", "image", "case", "cause", "coast", "action", "age", "bad", "boat", "record", "result", "section", "building", "mouse", "cash", "class", "period", "plan", "store", "tax", "side", "subject", "space", "rule", "stock", "weather", "chance", "figure", "man", "model", "source", "beginning", "earth", "program", "chicken", "design", "feature", "head", "material", "purpose", "question", "rock", "salt", "act", "birth", "car", "dog", "object", "scale", "sun", "note", "profit", "rent", "speed", "style", "war", "bank", "craft", "half", "inside", "outside", "standard", "bus", "exchange", "eye", "fire", "position", "pressure", "stress", "advantage", "benefit", "box", "frame", "issue", "step", "cycle", "face", "item", "metal", "paint", "review", "room", "screen", "structure", "view", "account", "ball", "discipline", "medium", "share", "balance", "bit", "black", "bottom", "choice", "gift", "impact", "machine", "shape", "tool", "wind", "address", "average", "career", "culture", "morning", "pot", "sign", "table", "task", "condition", "contact", "credit", "egg", "hope", "ice", "network", "north", "square", "attempt", "date", "effect", "link", "post", "star", "voice", "capital", "challenge", "friend", "self", "shot", "brush", "couple", "exit", "front", "function", "lack", "living", "plant", "plastic", "spot", "summer", "taste", "theme", "track", "wing", "brain", "button", "click", "desire", "foot", "gas", "influence", "notice", "rain", "wall", "base", "damage", "distance", "feeling", "pair", "savings", "staff", "sugar", "target", "text", "animal", "author", "budget", "discount", "file", "ground", "lesson", "minute", "officer", "phase", "reference", "register", "sky", "stage", "stick", "title", "trouble", "bowl", "bridge", "campaign", "character", "club", "edge", "evidence", "fan", "letter", "lock", "maximum", "novel", "option", "pack", "park", "quarter", "skin", "sort", "weight", "baby", "background", "carry", "dish", "factor", "fruit", "glass", "joint", "master", "muscle", "red", "strength", "traffic", "trip", "vegetable", "appeal", "chart", "gear", "ideal", "kitchen", "land", "log", "mother", "net", "party", "principle", "relative", "sale", "season", "signal", "spirit", "street", "tree", "wave", "belt", "bench", "commission", "copy", "drop", "minimum", "path", "progress", "project", "sea", "south", "status", "stuff", "ticket", "tour", "angle", "blue", "breakfast", "confidence", "daughter", "degree", "doctor", "dot", "dream", "duty", "essay", "father", "fee", "finance", "hour", "juice", "luck", "milk", "mouth", "peace", "pipe", "stable", "storm", "substance", "team", "trick", "afternoon", "bat", "beach", "blank", "catch", "chain", "consideration", "cream", "crew", "detail", "gold", "interview", "kid", "mark", "mission", "pain", "pleasure", "score", "screw", "sex", "shop", "shower", "suit", "tone", "window", "agent", "band", "bath", "block", "bone", "calendar", "candidate", "cap", "coat", "contest", "corner", "court", "cup", "district", "door", "east", "finger", "garage", "guarantee", "hole", "hook", "implement", "layer", "lecture", "lie", "manner", "meeting", "nose", "parking", "partner", "profile", "rice", "routine", "schedule", "swimming", "telephone", "tip", "winter", "airline", "bag", "battle", "bed", "bill", "bother", "cake", "code", "curve", "designer", "dimension", "dress", "ease", "emergency", "evening", "extension", "farm", "fight", "gap", "grade", "holiday", "horror", "horse", "host", "husband", "loan", "mistake", "mountain", "nail", "noise", "occasion", "package", "patient", "pause", "phrase", "proof", "race", "relief", "sand", "sentence", "shoulder", "smoke", "stomach", "string", "tourist", "towel", "vacation", "west", "wheel", "wine", "arm", "aside", "associate", "bet", "blow", "border", "branch", "breast", "brother", "buddy", "bunch", "chip", "coach", "cross", "document", "draft", "dust", "expert", "floor", "god", "golf", "habit", "iron", "judge", "knife", "landscape", "league", "mail", "mess", "native", "opening", "parent", "pattern", "pin", "pool", "pound", "request", "salary", "shame", "shelter", "shoe", "silver", "tackle", "tank", "trust", "assist", "bake", "bar", "bell", "bike", "blame", "boy", "brick", "chair", "closet", "clue", "collar", "comment", "conference", "devil", "diet", "fear", "fuel", "glove", "jacket", "lunch", "monitor", "mortgage", "nurse", "pace", "panic", "peak", "plane", "reward", "row", "sandwich", "shock", "spite", "spray", "surprise", "till", "transition", "weekend", "welcome", "yard", "alarm", "bend", "bicycle", "bite", "blind", "bottle", "cable", "candle", "clerk", "cloud", "concert", "counter", "flower", "grandfather", "harm", "knee", "lawyer", "leather", "load", "mirror", "neck", "pension", "plate", "purple", "ruin", "ship", "skirt", "slice", "snow", "specialist", "stroke", "switch", "trash", "tune", "zone", "anger", "award", "bid", "bitter", "boot", "bug", "camp", "candy", "carpet", "cat", "champion", "channel", "clock", "comfort", "cow", "crack", "engineer", "entrance", "fault", "grass", "guy", "hell", "highlight", "incident", "island", "joke", "jury", "leg", "lip", "mate", "motor", "nerve", "passage", "pen", "pride", "priest", "prize", "promise", "resident", "resort", "ring", "roof", "rope", "sail", "scheme", "script", "sock", "station", "toe", "tower", "truck", "witness", "can", "will", "other", "use", "make", "good", "look", "help", "go", "great", "being", "still", "public", "read", "keep", "start", "give", "human", "local", "general", "specific", "long", "play", "feel", "high", "put", "common", "set", "change", "simple", "past", "big", "possible", "particular", "major", "personal", "current", "national", "cut", "natural", "physical", "show", "try", "check", "second", "call", "move", "pay", "let", "increase", "single", "individual", "turn", "ask", "buy", "guard", "hold", "main", "offer", "potential", "professional", "international", "travel", "cook", "alternative", "special", "working", "whole", "dance", "excuse", "cold", "commercial", "low", "purchase", "deal", "primary", "worth", "fall", "necessary", "positive", "produce", "search", "present", "spend", "talk", "creative", "tell", "cost", "drive", "green", "support", "glad", "remove", "return", "run", "complex", "due", "effective", "middle", "regular", "reserve", "independent", "leave", "original", "reach", "rest", "serve", "watch", "beautiful", "charge", "active", "break", "negative", "safe", "stay", "visit", "visual", "affect", "cover", "report", "rise", "walk", "white", "junior", "pick", "unique", "classic", "final", "lift", "mix", "private", "stop", "teach", "western", "concern", "familiar", "fly", "official", "broad", "comfortable", "gain", "rich", "save", "stand", "young", "heavy", "lead", "listen", "valuable", "worry", "handle", "leading", "meet", "release", "sell", "finish", "normal", "press", "ride", "secret", "spread", "spring", "tough", "wait", "brown", "deep", "display", "flow", "hit", "objective", "shoot", "touch", "cancel", "chemical", "cry", "dump", "extreme", "push", "conflict", "eat", "fill", "formal", "jump", "kick", "opposite", "pass", "pitch", "remote", "total", "treat", "vast", "abuse", "beat", "burn", "deposit", "print", "raise", "sleep", "somewhere", "advance", "consist", "dark", "double", "draw", "equal", "fix", "hire", "internal", "join", "kill", "sensitive", "tap", "win", "attack", "claim", "constant", "drag", "drink", "guess", "minor", "pull", "raw", "soft", "solid", "wear", "weird", "wonder", "annual", "count", "dead", "doubt", "feed", "forever", "impress", "repeat", "round", "sing", "slide", "strip", "wish", "combine", "command", "dig", "divide", "equivalent", "hang", "hunt", "initial", "march", "mention", "spiritual", "survey", "tie", "adult", "brief", "crazy", "escape", "gather", "hate", "prior", "repair", "rough", "sad", "scratch", "sick", "strike", "employ", "external", "hurt", "illegal", "laugh", "lay", "mobile", "nasty", "ordinary", "respond", "royal", "senior", "split", "strain", "struggle", "swim", "train", "upper", "wash", "yellow", "convert", "crash", "dependent", "fold", "funny", "grab", "hide", "miss", "permit", "quote", "recover", "resolve", "roll", "sink", "slip", "spare", "suspect", "sweet", "swing", "twist", "upstairs", "usual", "abroad", "brave", "calm", "concentrate", "estimate", "grand", "male", "mine", "prompt", "quiet", "refuse", "regret", "reveal", "rush", "shake", "shift", "shine", "steal", "suck", "surround", "bear", "brilliant", "dare", "dear", "delay", "drunk", "female", "hurry", "inevitable", "invite", "kiss", "neat", "pop", "punch", "quit", "reply", "representative", "resist", "rip", "rub", "silly", "smile", "spell", "stretch", "stupid", "tear", "temporary", "tomorrow", "wake", "wrap", "yesterday", "Thomas", "Tom", "Lieuwe"];

    let name = capFirst (name1[getRandomInt (0, name1.length + 1)]) + ' ' + capFirst (name2[getRandomInt (0, name2.length + 1)]);
    return name;

}

function capFirst(string)
{
    return string.charAt (0).toUpperCase () + string.slice (1);
}

function getRandomInt(min, max)
{
    return Math.floor (Math.random () * (max - min)) + min;
}

//EXPORT FUNCTIONS

function Export()
{

    let jsonData = {
        "streamerName": streamerName,
        "chatWidth": chatWidth,
        "padding": padding,
        "animation": animation,
        "fontFamily": fontFamily.replace('""',''),
        "fontSize": fontSize,
        "basicFontColor": basicFontColor,
        "letterSpacing": letterSpacing,
        "wordSpacing": wordSpacing,
        "bcFontWeight" : bcFontWeight,
        "bcIcons" : bcIcons,
        "bcColors" : bcColors,
        "modFontWeight" : modFontWeight,
        "modIcons" : modIcons,
        "modColors" : modColors,
        "subFontWeight" : subFontWeight,
        "subIcons" : subIcons,
        "subColors" : subColors,
        "supFontWeight": supFontWeight,
        "supIcons": supIcons,
        "supColors": supColors,
        "borderThickness": borderThickness,
        "borderColor": borderColor,
        "borderStyle": borderStyle,
        "blockInvites": blockInvites,
        "blockCaptures": blockCaptures,
        "blockFan": blockFan,
        "blockHashtags": blockHashtags,
        "showAtSigns": showAtSigns,
        "blockSuperMessages": blockSuperMessages
    };
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent ('data = \'[' + JSON.stringify (jsonData) + ']\';');
    let dlAnchorElem = document.getElementById ('downloadAnchorElem');
    dlAnchorElem.setAttribute ("href", dataStr);
    dlAnchorElem.setAttribute ("download", "GeneratedOutput.json");
    dlAnchorElem.click ();

}


