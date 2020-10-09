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
    if(e) e.preventDefault();
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
    $("#senate-data").html("");
    $("#house-data").html("");
    $("#pres-data").html("");
    $("#state-house-data").html("");
    $("#state-senate-data").html("");
    //responseNodes=response.lastChild.childNodes;
    _rep=response;
    for(candidate of response.candidateList.candidate){
        var office=candidate.electionOffice;
        var name=candidate.ballotName;
        var party=candidate.electionParties;
        var status=candidate.electionStatus; 
        if(status==="Won"){
            var newC=$("<p>").html(`<span class='candidate-name'>${name}</span>, <span class='candidate-party'>${party}`);
            switch(office.split(" ")[0]){
                case "President":{
                    $("#pres-data").append(newC);
                    break;
                }
                case "U.S.":{
                    if(office.split(" ")[1]==="Senate") $("#senate-data").append(newC);
                    else if(office.split(" ")[1]==="House") $("#house-data").append(newC);
                    break;
                } 
                case "State":{
                    if(office.split(" ")[1]==="Senate") $("#state-senate-data").append(newC);
                    else if(office.split(" ")[1]==="House") $("#state-house-data").append(newC);
                    break;
                }
                default:{
                    console.log(office);
                    break;
                }
                    
            }              
    }
    }
}