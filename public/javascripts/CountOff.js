function SearchByID() {
	//alert('SearchByID');
	var Id = $('#IDTb').val();
	
	if(Id.length == 1) {
		$.getJSON({url:'./QueryID?ID='+Id,function(data){
			$('#IDList').show().empty();
			alert(data);
			$.each( data, function( ID, Name,Note ) {
				//items.push( "<li id='" + ID + "' Name='"+Name+"' Note='"+Note+"'>" + ID + "</li>" );
				var li = $('<li>'+ID+'</li>');
				li.attr({
					"id":ID
					,"Name":Name
					,"Note":Note
				});
				$('#IDList').append(li);
			});
			var count = $("#IDList li").length;
			alert(count);
			
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