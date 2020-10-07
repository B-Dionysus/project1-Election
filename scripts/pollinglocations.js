
// create click event for the submit address button
$("#submitAddress").click(function(e){
    e.preventDefault();
    //get user address from input field.
    var userAddress = $("#findtext").val().trim();
    // access the Google Civic jquery
    $.ajax({
        url: "https://civicinfo.googleapis.com/civicinfo/v2/voterinfo?address=" + userAddress + "&key=AIzaSyDDcoCWMnPNLsXimjEmRL85TOfhM9yPsA8",
        method: "GET",
    }).then(function(response) {
        console.log(response)
        // create a for loop that loops 10 times
        for( i=0; i <11; i++){                    
            //create a new div to hold polling locations info
            var newDiv = $("<div>");
            newDiv.attr("class", "polling-locations");
            //call info from APi and create new div for each info with own class.
            var pollName = $("<div>").text(response.earlyVoteSites[i].address.locationName);
            pollName.attr("class", "location-name")
            
            var pollAddressCity = response.earlyVoteSites[i].address.city
            var pollAddressLine1 = response.earlyVoteSites[i].address.line1
            var pollAddressState = response.earlyVoteSites[i].address.state
            var pollAddress =  pollAddressLine1 + " " + pollAddressCity + ", " + pollAddressState;
            var address = $("<div>").text("Address: " + pollAddress);
            address.attr("class", "address-name");

            // var hours = $("<div>").text("Hours: " + response.earlyVoteSites[i].pollingHours)

            var directions = $("<button>").text("Find Directions");
            directions.attr("class", "button-name");
            
            //append all individual info divs to one main div
            newDiv.append(pollName);
            newDiv.append(address);
            // newDiv.append(hours);
            newDiv.append(directions);

            // apend div with all info to html
            $(".container-pollingplace").append(newDiv);
        }
    });
});