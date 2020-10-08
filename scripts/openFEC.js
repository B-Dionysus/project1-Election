$(document).ready(init);

var _rep;

function init(){
    // Put the presidential data in #pres-data
    getPresident();
    // Put the senate data in #senate-data and the house data in #house-data
    getHouseAndSenate("NC");
}

// Called from getPresident
// Displays name and party data for everyone who filed a presidential run in 2020
// and puts it in #pres-data
function displayPresident(response){
    _rep=response;
    var pres=$("<p>").attr("id","president");
    for(candidate of response.results){        
        var filing=candidate.last_file_date;
        var name=titleCase(candidate.name);
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
    var senate=$("<p>").attr("id","senate");
    var house=$("<p>").attr("id","house");
        
    for (candidate of response.results){
        var name=titleCase(candidate.name);
        var party=titleCase(candidate.party_full);
        var election=titleCase(candidate.office_full);
        status=candidate.incumbent_challenge_full.toLowerCase();
        if(candidate.office_full.toUpperCase()==="HOUSE")
        {
            house.append($("<p>").text(name+" is a member of the "+party).addClass(status));
        }
        else
        {
            senate.append($("<p>").text(name+" is a member of the "+party).addClass(status));       
        }
    }
    $("#senate-data").append(senate);
    $("#house-data").append(house);
}




// titleCase() 
// takes "STRING HERE" or "string here" and returns "String Here"
function titleCase(str){
    if(!str) return false;
    allStr=str.toLowerCase().split(" ");
    final="";
    for(w of allStr){
        
        var l=w.charAt(0).toUpperCase();
        w=w.slice(1);
         w=l+w;
        final+=w+" ";
    }
    return final;
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




