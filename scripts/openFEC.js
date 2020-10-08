$(document).ready(init);
var _rep;
var prevState=""; // If the user has been here, save the last state they searched
var defaultState="IL"; // If the user has not been here, show them data from this state initially
function init(){
    // Put the presidential data in #pres-data
    // Put the senate data in #senate-data and the house data in #house-data
    $("#state").on("change",loadData);
    // If it exists, assign the localstorage variable to prevState, and search for that
    // If not, just search for Alabama
    if(prevState=localStorage.getItem("prevState")){
        console.log(prevState);
        $("#state").val(prevState);
    }
    else $("#state").val(defaultState);
    loadData();
}
function loadData(){
    stateChoice=$("#state").val();
    getPresident();
    getHouseAndSenate(stateChoice);

}

// Called from getPresident
// Displays name and party data for everyone who filed a presidential run in 2020
// and puts it in #pres-data
function displayPresident(response){
    
    $("#pres-data").html("");
    var pres=$("<p>").attr("id","president");
    for(candidate of response.results){    
        var filing=candidate.last_file_date;   
        // Names come by default in all uppercase
        // titleCase() is in ./scripts/utilities.js
        var name=titleCase(candidate.name);
        // Names come by default last-name-first
       // temp=name.split(",");
        //name=temp[1]+temp[0];
        // Unfortunately, the data may include honorifics at the end, without demarcation
        // e.g. "Biden, Joseph R Jr," and these appear to be arbitrary
        // e.g. "Jones, Take Mr.", so I don't think there's a clear way to sort them.
        // Also, while I'm here, only of the presidential candidates is listed as
        // "Title, Sheila Samm Mpresident". This is how they appear in the data set from the FEC. 
        if(candidate.party_full) var party=titleCase(candidate.party_full);
        else party="Unknown Party";
        status=candidate.incumbent_challenge_full.toLowerCase();
        // Let's limit this to only folks with an FEC filing from this year
       if(filing.split("-")[0]==="2020" && filing.split("-")[1]>2)
         pres.append($("<p>").text(name+" is a member of the "+party).addClass(status));
    }
    $("#pres-data").append(pres);
}
// Called from getHouseAnd Senate()
// Displays name and party data for everyone running for house or senate in 2020
// and puts it in #senate-data and #house-data
function displayHouseAndSenate(response){
    $("#senate-data").html("");
    $("#house-data").html("");
    _rep=response;
    var senate=$("<p>").attr("id","senate");
    var house=$("<p>").attr("id","house");
    var houseNum=0;
    var senNum=0;
    var state=response.results[0].state;
    localStorage.setItem("prevState",state);
    for (candidate of response.results){
        var name=titleCase(candidate.name);
        var party=titleCase(candidate.party_full);
        var election=titleCase(candidate.office_full);
        status=candidate.incumbent_challenge_full.toLowerCase();
        if(candidate.office_full.toUpperCase()==="HOUSE")
        {
            house.append($("<p>").text(name+" is a member of the "+party).addClass(status));
            houseNum++;
        }
        else
        {
            senate.append($("<p>").text(name+" is a member of the "+party).addClass(status));       
            senNum++;
        }
    }
    if(houseNum===0) house.append($("<p>").text("No FEC filings for this race.").addClass("error"));
    if(senNum===0) senate.append($("<p>").text("No FEC filings for this race.").addClass("error"));
    $("#senate-data").append(senate);
    $("#house-data").append(house);
}








// API Call, calls displayHouseAndSenate() on success
// This returns the names of everyone running for House and Senate
// in the state
function getHouseAndSenate(state){
    var APIKey="y7BRgIT6VX4YDceQNfig6Lf7UnvdUh1NVLTxLcef";
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.open.fec.gov/v1/candidates/?sort=party_full&sort_null_only=false&sort_hide_null=false&is_active_candidate=true&election_year=2020&per_page=100&page=1&sort_nulls_last=true&state="+state+"&candidate_status=C&api_key="+APIKey,
        "method": "GET",
        "headers": {

        }
    }    
    $.ajax(settings).done(function (response) {
        displayHouseAndSenate(response);
    });
}
// API Call, calls displayPresident() on success
// The gets everyone running for President.
function getPresident(){
    var APIKey="y7BRgIT6VX4YDceQNfig6Lf7UnvdUh1NVLTxLcef";
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.open.fec.gov/v1/candidates/?sort=party_full&sort_null_only=false&sort_hide_null=false&is_active_candidate=true&election_year=2020&per_page=100&page=1&sort_nulls_last=true&office=P&candidate_status=C&api_key="+APIKey,
        "method": "GET",
        "headers": {

        }
    }    
    $.ajax(settings).done(function (response) {
        displayPresident(response);
    });
}




