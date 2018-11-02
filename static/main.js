'''
1. Create a Google Form with 3 field
2. cheack Form fields id with "inspect element" with your browser
3. Generate a Google Sheet which will store the responses received by the form
4. Fetch Google Sheet data as JSON with this macro : 
https://script.google.com/macros/s/AKfycbygukdW3tt8sCPcFDlkMnMuNu9bH5fpt7bKV50p2bM/exec?id=YourSheetID&sheet=SheetName

'''


fetchBookmarks();

$('#btn1').click(function(e){

		e.preventDefault();
		var siteName = $('#name').val(); // returns the data of the form which has a ID of 'name'
		var siteUrl = $('#url').val(); // same as previous
		var siteDescription = $('#description').val(); // same as previous

		validForm = formValidity(siteName , siteUrl); // cheack 'formValidiy' function
 
		if(validForm == false){
			return false // If form validation does not satisfy , exits the loop
		}

// Below ajax request is pushing data to a Google form which is created particularly to store these data.

		$.ajax({
            url: <google-sheet-url>',
            data: {
              "entry.1091620218" : siteName,
              "entry.38005729" : siteUrl,
              "entry.1445633298" : siteDescription
            },
            type: 'POST'
        });

		fetchBookmarks();
        $('#form').trigger('reset'); // resetting the form after saving a bookmark
	});

$('#refreshBookmarks').click(function(e){ // For refresh Bookmark button

		fetchBookmarks();
		e.preventDefault();

});


function formValidity(siteName , siteUrl){

		if(siteName == "" || siteUrl == ""){
			alert('please fill up the form');
			return false
		}

		// Below Expression checks if a url is valid or not..
		var re = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

		validUrl = re.test(siteUrl);

		if(validUrl == false){
			alert('Please enter a valid url');
			return false;
		}

		return true;
}

function fetchBookmarks(){


	$('#bookMarks').empty();

	$.ajax({

// This macro is used for pulling excel data as JSON format
// https://script.google.com/macros/s/<sheetID>/exec?id=YourSheetID&sheet=SheetName

          url: '<MacroName>',
          type: 'GET'
        }).done(function(data){

          bookmarks = data.Sheet1 // bookmarks is an Object which contains tha data of Sheet1 of google sheet

          bookmarks = bookmarks.reverse();

          // Excel database which is connected to the above "Google form", Our bookmark data will be saved here.
          excel_db = '<google-form-link>'

  	if (bookmarks != null){

		$.each( bookmarks , function( key, value ) {

		  	name = value.name;
		  	url = value.url;
		  	description = value.description;
		  	timestamp = value.Timestamp;
 		  	// Example : "Timestamp":"2017-03-15T12:26:20.238Z"

		  	// Below functions are used for parsing the time stamp.
		  	timestamp = timestamp.slice(0, -5); // Removing the last 5 'char' of string
 		  	timestamp = timestamp.split("T"); // Splitting the string where 'T' is found 

	  	
		  	$('#bookMarks').append('<div class="col-md-12">'+
		  								'<div class="panel panel-primary">'+
		  								'<div class="panel-heading">'+
										'<h3>'+name+' '+
										'<a class="btn btn-default btn-sm" target="_blank" href="'+url+'">Visit</a> '+
										'<a class="btn btn-danger btn-sm" target="_blank" href="'+excel_db+'">Delete</a> '+
										'</h3>'+
										'</div>'+
										'<div class="panel-body">'+
										'<p>' + description + '</p>' +
										// '<div class="panel-footer">'+
										'<p>Bookmarked On: ' + timestamp + '</p>' +
										'</div>'+
										'</div>'+
										'</div>');


		});

		}
  	});

}
