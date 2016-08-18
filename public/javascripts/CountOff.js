function SearchByID() {
	//alert('SearchByID');
	var Id = $('#IDTb').val();
	
	
	if(Id.length == 1) {
		$.getJSON({url:'./QueryID?ID='+Id,function(data){
			$('#IDList').show().empty()
			$.each( data, function( ID, Name,Note ) {
				//items.push( "<li id='" + ID + "' Name='"+Name+"' Note='"+Note+"'>" + ID + "</li>" );
			});
			
			
		}})
	}
}
function SearchByName() {
	//alert('SearchByName');
}

function init() {
	//alert("init");
	$('#IDTb').change(SearchByID);
	$('#NamtTb').change(SearchByName);
	$('#IDList').hidden();
	$('#NameList').hidden();
}






$(document).ready(init);