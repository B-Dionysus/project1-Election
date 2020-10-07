src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js";      

var userAddress = $("#findtext").val().trim();
$.ajax({
  url: "https://civicinfo.googleapis.com/civicinfo/v2/voterinfo?address=" + userAddress + "&key=AIzaSyDDcoCWMnPNLsXimjEmRL85TOfhM9yPsA8",
  method: "GET",
}).then(function(response) {
  console.log(response)
  for( i=0; i <11; i++){
    var newDiv = $("<div>");
    var pollName = $("<div>").text(response.earlyVoteSites[i].address.locationName);
    var pollAddressCity = response.earlyVoteSites[i].address.city
    var pollAddressLine1 = response.earlyVoteSites[i].address.line1
    var pollAddressState = response.earlyVoteSites[i].address.state
    var pollAddress =  pollAddressLine1 + " " + pollAddressCity + ", " + pollAddressState;
    var address = $("<div>").text(pollAddress);
    var directions = $("<button>").text("Find Directions");

    newDiv.append(pollName);
    newDiv.append(address);
    newDiv.append(directions);
    $("body").append(newDiv);
  }