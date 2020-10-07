$(document).ready(init);
var senate=[];
var house=[];
var president=[];
getHouseAndSenate

// Add whether is incumbant or challenger
function getRepInfo(response){
    response=response;
    var house=$("<div>").addClass("senate candidate");
    var senate=$("<div>").addClass("house candidate");
    senate.append($("<h2>").text("Senate"));
    house.append($("<h2>").text("House"));

    var senate=$("<div>").attr("id","senate");
    senate.addClass("container");
    var house=$("<div>").attr("id","senate");
    house.addClass("container");
    $("body").append(senate);
    $("body").append(house);
        
    for (candidate of response.results){
        var name=titleCase(candidate.name);
        var party=titleCase(candidate.party_full);
        var election=titleCase(candidate.office_full);
        if(candidate.office_full.toUpperCase()==="HOUSE")
            house.append($("<div>").text(name+" is a member of the "+party+" running for "+election));
        else
            senate.append($("<div>").text(name+" is a member of the "+party+" running for "+election));        
    }
    main.append(senate, house);
}




// titleCase() take "STRING HERE" or "string here" and returns "String Here"
function titleCase(str){
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




// API Call, calls displayBallot() on success
function getHouseAndSenate(){
    var APIKey="y7BRgIT6VX4YDceQNfig6Lf7UnvdUh1NVLTxLcef";
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.open.fec.gov/v1/candidates/?sort=party_full&sort_null_only=false&sort_hide_null=false&is_active_candidate=true&election_year=2020&per_page=100&page=1&sort_nulls_last=true&state=IL&candidate_status=C&api_key="+APIKey,
        "method": "GET",
        "headers": {

        }
    }    
    $.ajax(settings).done(function (response) {
        getRepInfo(response);
    });
}




