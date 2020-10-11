// Currently we are using live data from VoteSmart, but our API key
// expires on November 9th. In order to demo the page, flip the following 
// variable to TRUE and it will pull from cachedData.js instead of from their
// API
var _USE_CACHED_DATA=false;
$(document).ready(init);

// I had difficulty finding the option to request that VoteSmart return its data
// in JSON format. I finally tracked it down via the following url:
// https://www.webdeveloper.com/d/217846-trying-to-access-project-votesmart-api/5
function init(){
    if(_USE_CACHED_DATA)    
        $("#zipSearch").on("submit",function(){displayCandidates(getCachedData())});

    else $("#zipSearch").on("submit",getElectionData);
    var zip;
    // If it's in local storage, assign the user's zip to var zip and call displayCandidates();
    // If not, don't do anything until the user submits the zipcode search form
    if(zip=localStorage.getItem("userZip")){
        $("#zipcode").val(zip);
        if(_USE_CACHED_DATA) displayCandidates(getCachedData());
        else getElectionData();
    }
}
// API Call, calls displayHouseAndSenate() on success
// This returns the names of everyone running for state and
// federal level positions in the user's zipcode
function getElectionData(e){
    // The Foundation tabs get very confused with mutliple calls
    // so we actually *do* want to refresh this page
    // if(e) e.preventDefault();
    $("#candidate-content").html("<h3>Loading...</h3>");
    var zip=$("#zipcode").val();
    localStorage.setItem("userZip", zip);
    var APIKey="300d63e029ac499128ea14f5a11dfdca";
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://cors-anywhere.herokuapp.com/api.votesmart.org/Candidates.getByZip?o=JSON&zip5="+zip+"&key="+APIKey,
        "method": "GET",
        "headers": {
        }
    }    
    $.ajax(settings).done(function (response) {
        displayCandidates(response);
    });
}

function displayCandidates(response){
    // The name and number of offices in each zip code varies (check out my home town, 27510
    // for a ballot with a whole bunch of contests on it!). So we'll need to construct our UI
    // dynamically
    var offices=[];
    $("#candidates-tabs").html("");
    $("#candidate-content").html("");
    for(candidate of response.candidateList.candidate){
        var office=candidate.electionOffice;
        // User this regex to replace the " " character globally, and case insensitively (not
        // that the case matters for this) throughout thr string.
        const regex= / /gi;
        // We are replacing it with "-" to make it work as a css id
        var officeId=office.replace(regex,"-").replace("U.S.","US");
        var name=candidate.ballotName;
        var party=candidate.electionParties;
        var status=candidate.electionStatus; 
        var candidateId=candidate.candidateId;
        // Only display the candidates who have already run their primary race.
        // Other options include "Running" and "Lost"
        if(status==="Won"){
            var newC=$("<p>").html(`<span class='candidate-name' id="${candidateId}">${name}</span>, <span class='candidate-party'>${party}`);           
            if(offices.indexOf(officeId)===-1) {
                offices.push(officeId);
                var newTab=$("<li>").addClass("tabs-title");
                var newLink=$("<a>").text(office);
                newLink.attr("href","#"+officeId);
                newTab.append(newLink);
                
                $("#candidates-tabs").append(newTab);
                //<div class="tabs-panel" id="pres-data">
                var newDiv=$("<div>").addClass("tabs-panel");
                newDiv.attr("id",officeId);
                $("#candidate-content").append(newDiv);
            }
            $("#"+officeId).append(newC);
        }              
    }
    
    // If the user clicks on a cnadidate, their photo and full name pop up in a modal. 
    $(document).on("click",".candidate-name",getBio);  
    // Finally, we let foundation run its magic. This builds the accordion menus, among other things.
    $(document).foundation();
}
function getBio(){
    candidateId=this.id;
    var APIKey="300d63e029ac499128ea14f5a11dfdca";
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://cors-anywhere.herokuapp.com/api.votesmart.org/CandidateBio.getBio?o=JSON&candidateId="+candidateId+"&key="+APIKey,
        "method": "GET",
        "headers": {
        }
    }    
    $.ajax(settings).done(function (response) {
        displayBio(response);
    });
}
// This gets the full name of the candidate, including any nicknames
// and suffixes (e.g., Joseph "Joe" Biden Jr.) as well as a small photo
// And puts it in a modal pop up
function displayBio(response){
    console.log(response);
    _rep=response;
    var c=response.bio.candidate;
    var first=c.firstName;
    var nick;
    if(c.nickName)nick='("'+c.nickName+'")';
    else nick="";
    var last=c.lastName;
    var suffix=c.suffix;
    var birth=c.birthDate;
    var photo=c.photo;
    console.log(photo);
    var bioBox=$("<div>").addClass("bio-box");
    var bodyText=`<p><strong>${first} ${nick} ${last} ${suffix}</strong></p><p><img src="${photo}" class="bio-pic">`;
    var modalHTML=`<div class="bio-modal"><div class="bio-modal-header"><span class="bio-modal-exit">X</span><div class="bio-modal-body">${bodyText}</div></div></div>`;
    bioBox.html(modalHTML);
    $("body").append(bioBox);
    $(".bio-box").on("click",function(){$(".bio-box").remove();})
}