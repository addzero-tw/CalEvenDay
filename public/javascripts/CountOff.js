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
		$('#IDList').empty().hide();
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
		$('#NameList').empty().hide();
	}
}
function SelectItem() {
	var Id = $(this).attr('ValId');
	var Name = $(this).attr('ValName');
	var Note = $(this).attr('ValNote');
	//alert(Name);
	$('#IDList').hide();
	$('#NameList').hide();
	autocomplete = false;
}
function CommitCount() {
	var Id = $('#IDTb').val();
	var Name = $('#NamtTb').val();
	var Count = $('#CountTb').val();
	//console.log(Id);
	//console.log(Name);
	//console.log(Count);
	var AlertMsg = new Array();
	
	if(Id == undefined && Name == undefined) {
		AlertMsg.push('沒有輸入必要資訊');
	}
	if(Count == undefined) {
		AlertMsg.push('沒有輸入次數');
	}
	if(AlertMsg.length > 0) {
		alert(AlertMsg.join('\n'));
		
		return;
	}
	$.ajax({
		url:'./CommitCount/'+Id+'/'+Name+'/'+Count
		,type:'get'
		,dataType:'json'
		,success:function(Jdata) {
		}
		,error:function(){
			
		}
	});

	
	
	
	
	
}

function init() {
	//alert("init");
	$('#IDTb').keyup(SearchByID);
	$('#NamtTb').keyup(SearchByName);
	
	$('#IDList').hide();
	$('#NameList').hide();
	$('#CommitCountBtn').click(CommitCount);

	autocomplete = true;
}






$(document).ready(init);