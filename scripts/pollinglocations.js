$(document).ready(function(){
    //get stored address
   // localStorage.getItem("userAddress");
    //push address info on the page
    pushInfo(localStorage.getItem("userAddress")); 

    
    function pushInfo(userAddress){
        //clear existing infomration on page
        $("#userpolling").empty();
        $("#earlypolling").empty();
        //call to API
        
        $.ajax({
            url: "https://civicinfo.googleapis.com/civicinfo/v2/voterinfo?electionId=7000&address=" + userAddress + "&key=AIzaSyDDcoCWMnPNLsXimjEmRL85TOfhM9yPsA8",
            method: "GET",
        }).then(function(response) {
            //logic to check if API returns targeted info
            //if yes then print infor on page
            if(response.hasOwnProperty("pollingLocations")=== true){

                //create div to hold info
                var newDiv = $("<div>");
                newDiv.attr("class", "callout small");
                //call info from APi and create new div for each info with own class.
                var pollName = $("<p>").text(response.pollingLocations[0].notes);
                pollName.attr("class", "location-name")
                
                var pollAddressCity = response.pollingLocations[0].address.city
                var pollAddressLine1 = response.pollingLocations[0].address.line1
                var pollAddressState = response.pollingLocations[0].address.state
                var pollAddress =  pollAddressLine1 + " " + pollAddressCity + ", " + pollAddressState;
                var address = $($("<p>").text("Address: ").attr("class", "poll-address"));
                
                address.append($("<span>").text(pollAddress).attr("class", "span"));
                address.attr("class", "address-name");

                var hours = $($("<p>").text("Hours: ").attr("class", "poll-hours")); 
                hours.append($("<span>").text(response.pollingLocations[0].pollingHours).attr("class", "span"));

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
                $("#poll-location").html("<h4>Your Polling Location:</h4>");
                $("#early-voting").html("<h4>Early Voting Locations:</h4>");
                $("#userpolling").append(newDiv);
                $("#userpolling").css("display","block");
                $("#earlypolling").css("display","block");
                
            
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
                    startDate.append($("<span>").text(response.earlyVoteSites[i].startDate).attr("class", "span"));

                    var endDate = $("<p>").text("End Date: ").attr("class", "end-date");  
                    endDate.append($("<span>").text(response.earlyVoteSites[i].endDate).attr("class", "span"));

                    var hours = $("<p>").text("Hours: ").attr("class", "poll-hours");
                    hours.append($("<span>").text("M-F: 8:30am-7pm || Sat-Sun: 9am-5pm").attr("class", "span"));

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
            }
            //if API response does not have targeted info then let user know
            else{
              
                $("#userpolling").text("No polling information found for this location.");
            }
        }); 
    }
    //create a click event for submitting address on pollingpage
    $("#submit-address").click(function(e){
        e.preventDefault();
        //get text from input field
        var userAddress = $("#findtext").val().trim();
        addresslogic(userAddress);

    });
    //create a function to display address from local storage if no user input on page
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

