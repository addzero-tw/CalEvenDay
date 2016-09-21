var autocomplete = true;
function SearchByID() {
	//alert('SearchByID');
	var Id = $('#IDTb').val();
	
	if(Id.length >= 1 && autocomplete) {
		$.ajax({
			url:'../buddha/QueryID?ID='+Id
			,type:'get'
			,dataType:'json'
			,success:function(Jdata) {
				//alert(Jdata.length);
				$('#IDList').show().empty();
				$.each(Jdata,function(i,item){
					var li = $('<li>'+item.ID+'</li>');
					li.attr({
						"ValId":item.ID
						,"ValName":item.Name
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
	var Name = $('#NameTb').val();
	
	if(Name.length >= 1 && autocomplete) {
		$.ajax({
			url:'../buddha/QueryName?Name='+encodeURI(Name)
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
	$('#IDTb').val(Id);
	$('#NameTb').val(Name);
	//alert(Name);
	$('#IDList').hide();
	$('#NameList').hide();
	autocomplete = false;
}
function CommitCount() {
	var Id = $('#IDTb').val();
	var Name = $('#NameTb').val();
	var Count = $('#CountTb').val();
	//console.log(Id);
	//console.log(Name);
	//console.log(Count);
	var AlertMsg = new Array();
	
	if(Id == undefined && Name == undefined) {
		AlertMsg.push('沒有輸入必要資訊');
	}
	if(Count == undefined || Count == 0) {
		AlertMsg.push('沒有輸入次數');
	}
	if(AlertMsg.length > 0) {
		alert(AlertMsg.join('\n'));
		
		return;
	}
	$.ajax({
		url:'../buddha/CommitCount/'+Id+'/'+Name+'/'+Count
		,type:'get'
		,dataType:'json'
		,success:function(Jdata) {
			if(Jdata.result == 'Success') {
				alert('提交成功');
			}
			else {
				alert('提交失敗');
			}
		}
		,error:function(){
			alert('提交失敗');
		}
	});

	
	
	
	
	
}
function getTodayStr() {
	$.ajax({
		url:'../buddha/TodayStr'
		,type:'get'
		,dataType:'json'
		,success:function(Jdata) {
			$('#DateP').text(Jdata.Today);
		}
		,error:function(){
			
		}
	});
}

function init() {
	//alert("init");
	$('#IDTb').keyup(SearchByID);
	$('#NameTb').keyup(SearchByName);
	
	$('#IDList').hide();
	$('#NameList').hide();
	$('#CommitCountBtn').click(CommitCount);

	autocomplete = true;
	getTodayStr();
	
}






$(document).ready(init);