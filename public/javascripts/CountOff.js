function SearchByID() {
	alert('SearchByID');
}
function SearchByName() {
	alert('SearchByName');
}

function init() {
	//alert("init");
	$('#IDTb').change(SearchByID);
	$('#NamtTb').change(SearchByName);
}






$(document).ready(init);