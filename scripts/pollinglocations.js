$(document).ready(function(){
  
    localStorage.getItem("userAddress");
    pushInfo(localStorage.getItem("userAddress")); 

    $("#userpolling").empty();
    $("#earlypolling").empty();
    function pushInfo(userAddress){
        $.ajax({
            url: "https://civicinfo.googleapis.com/civicinfo/v2/voterinfo?electionId=7000&address=" + userAddress + "&key=AIzaSyDDcoCWMnPNLsXimjEmRL85TOfhM9yPsA8",
            method: "GET",
        }).then(function(response) {
            console.log(response);

            // $("#userpolling").empty();
            var newDiv = $("<div>");
            newDiv.attr("class", "callout small");
            //call info from APi and create new div for each info with own class.
            var pollName = $("<p>").text(response.pollingLocations[0].notes);
            pollName.attr("class", "location-name")
            
            var pollAddressCity = response.pollingLocations[0].address.city
            var pollAddressLine1 = response.pollingLocations[0].address.line1
            var pollAddressState = response.pollingLocations[0].address.state
            var pollAddress =  pollAddressLine1 + " " + pollAddressCity + ", " + pollAddressState;
            var address = $("<p>").text("Address: ").attr("class", "poll-address");
            address.append($("<span>").text(pollAddress).attr("class", "span"));
            address.attr("class", "address-name");

            var hours = $("<p>").text("Hours: ").attr("class", "poll-hours"); 
            hours.append("<span>").text(response.pollingLocations[0].pollingHours).attr("class", "span");
            // var hours = $("<div>").text("Hours: " + response.earlyVoteSites[i].pollingHours)

            var directions = $("<button>").text("Find Directions");
            directions.attr("class", "button-name");
            // create an attr to store the polling address in the button
            directions.attr("data-address", pollAddress);
            
            
            //append all individual info divs to one main div
            newDiv.append(pollName);
            newDiv.append(address);
            newDiv.append(hours);
            newDiv.append(directions);

            // apend div with all info to html
            $("#userpolling").append(newDiv);
        
            // Store user zipcode in localStorage
            localStorage.setItem("userZip",response.normalizedInput.zip);
        
            // create a for loop that loops 10 times
            for( i=0; i <10; i++){                    
                //create a new div to hold polling locations info
                var newDiv = $("<div>");
                newDiv.attr("class", "callout small");
                //call info from APi and create new div for each info with own class.
                var pollName = $("<h5>").text(response.earlyVoteSites[i].address.locationName);
                pollName.attr("class", "location-name")
            
                var pollAddressCity = response.earlyVoteSites[i].address.city
                var pollAddressLine1 = response.earlyVoteSites[i].address.line1
                var pollAddressState = response.earlyVoteSites[i].address.state
                var pollAddress =  pollAddressLine1 + " " + pollAddressCity + ", " + pollAddressState;
                var address = $("<p>").text("Address: ").attr("class", "poll-address");
                address.append($("<span>").text(pollAddress).attr("class", "span"));
                address.attr("class", "address-name");

                var startDate = $("<p>").text("Start Date: ").attr("class", "start-date"); 
                tartDate.append($("<span>").text(response.earlyVoteSites[i].startDate).attr("class", "span"));

                var endDate = $("<p>").text("End Date: ").attr("class", "end-date");  
                endDate.append($("<span>").text(response.earlyVoteSites[i].endDate).attr("class", "span"));

                var hours = $("<p>").text("Hours: ").attr("class", "poll-hours");
                hours.append($("<span>").text("M-F: 8:30am-7pm || Sat-Sun: 9am-5pm").attr("class", "span"));
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
                $("#earlypolling").append(newDiv);
            }
            //create an on click event for each button.
            $(".button-name").click(function(){
                // use the created attr "data-address" to call the polling location's address, then reroute user to googlemaps for directions.
                window.open("https://www.google.com/maps/dir/" + userAddress + "/" + $(this).attr("data-address"), '_blank');
            })
        }); 
    }

    $("#submitAddress").click(function(e){
        e.preventDefault();
        var userAddress = $("#findtext").val().trim();
        addresslogic(userAddress);

    });
    function addresslogic(userAddress){
        if (userAddress === null) {
            $("#userpolling").empty();
            $("#earlypolling").empty();
            localStorage.getItem("userAddress");
            pushInfo(localStorage.getItem("userAddress")); 
    
        }
        else{
            $("#userpolling").empty();
            localStorage.setItem("userAddress", userAddress)
            pushInfo(localStorage.getItem("userAddress")); 
        }
    }
})

// test