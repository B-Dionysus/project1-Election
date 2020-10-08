
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
        // clear the last search results
        $(".container-pollingplace").empty();
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

            var startDate = $("<div>").text("Start Date: " +response.earlyVoteSites[i].startDate).attr("class", "start-date")
            var endDate = $("<div>").text("End Date: " + response.earlyVoteSites[i].endDate).attr("class", "end-date")
            var hours = $("<div>").text("Hours: M-F: 8:30am-7pm || S-S: 9am-5pm").attr("class", "poll-hours")
            // var hours = $("<div>").text("Hours: " + response.earlyVoteSites[i].pollingHours)

            var directions = $("<button>").text("Find Directions");
            directions.attr("class", "button-name");
            // create an attr to store the polling address in the button
            directions.attr("data-address", pollAddress);
            
            
            //append all individual info divs to one main div
            newDiv.append(pollName);
            newDiv.append(address);
            newDiv.append(hours);
            newDiv.append(startDate);
            newDiv.append(endDate);
            newDiv.append(directions);

            // apend div with all info to html
            $(".container-pollingplace").append(newDiv);
        }
        //create an on click event for each button.
        $(".button-name").click(function(){
            // use the created attr "data-address" to call the polling location's address, then reroute user to googlemaps for directions.
            window.open("https://www.google.com/maps/dir/" + userAddress + "/" + $(this).attr("data-address"), '_blank');
        })
    });    
});