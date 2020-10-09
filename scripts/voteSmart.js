$(document).ready(init);
var _rep;
// How is this documentation? I couldn't find the slightest guide to how to specify JSON as opposed to
// XML anywhere on their site (although they helpfully included a link to wikipedia's JSON article!!!!!)
//I finally found the answer in a random forum post here:
// https://www.webdeveloper.com/d/217846-trying-to-access-project-votesmart-api/5
function init(){
    $("#zipSearch").on("submit",getElectionData);
    var zip;
    if(zip=localStorage.getItem("userZip")){
        $("#zipcode").val(zip);
        getElectionData();
    }
}



// API Call, calls displayHouseAndSenate() on success
// This returns the names of everyone running for House and Senate
// in the state
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
        displaCandidates(response);
    });
}

function displaCandidates(response){
    var offices=[];

    //responseNodes=response.lastChild.childNodes;
    _rep=response;
    $("#candidates-tabs").html("");
    $("#candidate-content").html("");
    for(candidate of response.candidateList.candidate){
        var office=candidate.electionOffice;
        const regex= / /gi;
        var officeId=office.replace(regex,"-").replace("U.S.","US");
        var name=candidate.ballotName;
        var party=candidate.electionParties;
        var status=candidate.electionStatus; 
        if(status==="Won"){
            var newC=$("<p>").html(`<span class='candidate-name'>${name}</span>, <span class='candidate-party'>${party}`);           
            if(offices.indexOf(officeId)===-1) {
                offices.push(officeId);
                //<li class="tabs-title is-active"><a href="#senate-data" aria-selected="true">Senate</a></li>
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
    
     
    $(document).on("click",".candidate-name",loadBio);  
    // Finally, we let foundation run its magic. This builds the accordion menus, among other things.
    $(document).foundation();
}
function loadBio(e){
    console.log(this);
    var bioBox=$("<div>").addClass("bioBox");

    bioBox.html(modalHTML);
    $("body").append(bioBox);
}