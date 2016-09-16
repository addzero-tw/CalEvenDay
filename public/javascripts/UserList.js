var UserList = new Array();
var ShowUserList = new Array();
var filter = undefined;
var page = 0;
var MaxUserId = 0;

function initTable() {
	
	var table = $('<table></table>');
	var tbody = $('<tbody></tbody>');
	
	table.append(tbody);
	tbody.append('<tr><th>編號</th><th>姓名</th><th>註記</th><th>刪除</th></tr>');
	for(var i=0;i<10 && i < UserList.length;i++) {
		var onerow = UserList[i];
		var tr = $('<tr></tr>');
		tr.attr('UserID',onerow.ID.toString());
		var IdTd = $('<td></td>')
			,NameTd = $('<td></td>')
			,NoteTd = $('<td></td>')
			,DelTd = $('<td></td>');
		var DelBtn = $('<a href="#" class="ui-btn">刪除</a>');
		IdTd.text(onerow.ID);
		NameTd.text(onerow.Name);
		NoteTd.text(onerow.Note == undefined ? '':onerow.Note);
		DelBtn.attr('UserID',onerow.ID);
		DelBtn.bind('tap',DelNewUserEvent);
		DelTd.append(DelBtn);
		tr.append(IdTd);
		tr.append(NameTd);
		tr.append(NoteTd);
		tr.append(DelTd);
		tbody.append(tr);
	}
	$('#UserListTableDiv').empty().append(table);

	var SumPage = Math.floor(UserList.length/10);
	$('#PagesDiv').empty();
	for(var i = 0;i<10 && i < SumPage ;i++ ){
		var PageA = $('<a href="#" class="ui-btn"></a>');
		PageA.text((i+1).toString());
		$('#PagesDiv').append(PageA);
	}
	if(SumPage > 10 ) {
		var NextPageA = $('<a href="#" class="ui-btn">>>></a>');
		
		$('#PagesDiv').append(NextPageA);
	}
}
function AddNewUserEvent(event) {
	var NewId =$('#IdTb').val();
	var NewName =$('#NameTb').val();
	var NewNote =$('#NoteTb').val();
	NewNote = NewNote == undefined ? '':NewNote;
	var Errors = new Array();
	for(var i=0;i<UserList.length;i++) {
		var oneUser = UserList[i];
		if(oneUser.ID == NewId) {
			Errors.push("已有此編號:"+NewId);
			break;
		}
	}
	if(NewId == '' || NewName == '') {
		Errors.push("編號或姓名未填");
	}
	if(Errors.length > 0) {
		alert(Errors.join('\n'));
		return;
	}
	$.ajax({
		url:'../buddha/AddUser/'+NewId.toString()+'/'+NewName+'/'+NewNote
		,type:'get'
		,dataType:'json'
		,success:function(Jdata) {
			if(Jdata.result == 'Success') {
				var tr = $('<tr></tr>');
				tr.attr('UserID',NewId.toString());
				var IdTd = $('<td></td>')
					,NameTd = $('<td></td>')
					,NoteTd = $('<td></td>')
					,DelTd = $('<td></td>');
				var DelBtn = $('<a href="#" class="ui-btn">刪除</a>');
				IdTd.html('<p class="NewIdFont">New!!</p>'+NewId);
				NameTd.text(NewName);
				NoteTd.text(NewNote);
				DelTd.append(DelBtn);
				DelBtn.attr('UserID',NewId);
				DelBtn.bind('tap',DelNewUserEvent);
				tr.append(IdTd);
				tr.append(NameTd);
				tr.append(NoteTd);
				tr.append(DelTd);
				$('#UserListTableDiv tbody').append(tr);
				UserList.append({ID:NewId,Name:NewName,Note:NewNote});
				
			}
			else {
				Alert('加入失敗');
			}
		}
		,error:function(){
			
		}
	});
	
	
}
function DelNewUserEvent(event) {
	//alert($(event.target).attr('UserID'));
	var DelID = $(event.target).attr('UserID');
	$.ajax({
		url:'../buddha/DelUser/'+DelID.toString()
		,type:'get'
		,dataType:'json'
		,success:function(Jdata) {
			if(Jdata.result == 'Success') {
				$('#UserListTableDiv tbody tr[UserID=\''+DelID+'\']').remove();
				for(var i=0;i<UserList;i++) {
					if(UserList[i].ID == parseInt(DelID)) {
						UserList.splice(i,1);
						break;
					}
				}
				Alert('刪除成功');
				
			}
			else {
				Alert('加入失敗');
			}
		}
		,error:function(){
			
		}
	});
}


function init() {
	$.ajax({
			url:'../buddha/UserList'
			,type:'get'
			,dataType:'json'
			,success:function(Jdata) {
				MaxUserId = 0;
				for(var i=0;i<Jdata.length;i++) {
					UserList.push({ID:Jdata[i].ID,Name:Jdata[i].Name,Note:Jdata[i].Note});
					if(Jdata[i].ID > MaxUserId)
						MaxUserId = Jdata[i].ID;
				}
				initTable();
				$('#IdTb').val(MaxUserId+1);
			}
			,error:function(){
				
			}
		});
	$('#AddNewUserBtn').bind('tap',AddNewUserEvent);
}






$(document).ready(init);