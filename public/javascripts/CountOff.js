var autocomplete = true;
function SearchByID() {
	//alert('SearchByID');
	var Id = $('#IDTb').val();
	
	if(Id.length >= 1 && autocomplete) {
		$.ajax({
			url:'./QueryID?ID='+Id
			,type:'get'
			,dataType:'json'
			,success:function(Jdata) {
				//alert(Jdata.length);
				$('#IDList').show().empty();
				$.each(Jdata,function(i,item){
					var li = $('<li>'+item.ID+'</li>');
					li.attr({
						"ValId":item.ID
						,"ValNameVal":item.Name
						,"ValNote":item.Note
					});
					li.click(SelectItem);
					$('#IDList').append(li);
				});
			}
			,error:function(){
				
			}
		});
		
	}else {
		$('#IDList').empty().hidden();
	}
}
function SearchByName() {
	//alert('SearchByName');
	var Name = $('#NamtTb').val();
	
	if(Id.length >= 1 && autocomplete) {
		$.ajax({
			url:'./QueryName?Name='+Name
			,type:'get'
			,dataType:'json'
			,success:function(Jdata) {
				//alert(Jdata.length);
				$('#NameList').show().empty();
				$.each(Jdata,function(i,item){
					var li = $('<li>'+item.Name+'</li>');
					li.attr({
						"ValId":item.ID
						,"ValName":item.Name
						,"ValNote":item.Note
					});
					li.click(SelectItem);
					$('#NameList').append(li);
				});
			}
			,error:function(){
				
			}
		});
		
	}else {
		$('#NameList').empty().hidden();
	}
}
function SelectItem() {
	var Id = $(this).attr('ValId');
	var Name = $(this).attr('ValName');
	var Note = $(this).attr('ValNote');
	alert(Name);
	$('#IDList').hidden();
	$('#NameList').hidden();
	autocomplete = false;
}

function init() {
	//alert("init");
	$('#IDTb').keyup(SearchByID);
	$('#NamtTb').keyup(SearchByName);
	$('#IDList').hidden();
	$('#NameList').hidden();
	autocomplete = true;
}






$(document).ready(init);