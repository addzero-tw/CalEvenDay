var UserList = new Array();
var ShowUserList = new Array();
var filter = undefined;
var CustomerPage = 0;
var MaxUserId = 0;

function initTable() {
	ReBuildTable();
	ReBuildPage();
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
function Search() {
	var SearchVal = $('#SearchTb').val();
	if(SearchVal.length > 0)
		filter = true;
	else {
		filter = false;
		ReBuildTable();
		return;
	}
	ShowUserList.splice(0,ShowUserList.length);
	for(var i=0;i<UserList.length;i++) {
		if(UserList[i].ID.toString().indexOf(SearchVal) >= 0
			|| UserList[i].Name.indexOf(SearchVal) >= 0
			|| UserList[i].Note.indexOf(SearchVal) >= 0)
		ShowUserList.push(UserList[i]);
	}
	//alert(ShowUserList.length);
	CustomerPage = 0;
	ReBuildTable();
	ReBuildPage();
}
function ReBuildPage() {
	var DataSource = filter ? ShowUserList:UserList;
	var SumPage = Math.ceil(DataSource.length/10);
	//alert(DataSource.length+","+SumPage);
	var MinPage = CustomerPage - 5;
	var MaxPage = CustomerPage + 4;
	if(MinPage < 0) {
		MaxPage -= MinPage;
		MinPage = 0;
	}
	if(MaxPage > SumPage) {
		MaxPage = SumPage;
	}
	$('#PagesDiv').empty();
	if(MinPage > 0) {
		var PrevPageA = $('<a href="#" class="ui-btn"><<<</a>');
		PrevPageA.bind("tap",PageClick);
		$('#PagesDiv').append(PrevPageA);
	}
	for(var i=MinPage;i<MaxPage;i++) {
		var PageA = $('<a href="#" class="ui-btn">'+(i+1).toString()+'</a>');
		if(i == CustomerPage) {
			PageA.addClass('CurrentPage');
		}
		else {
			PageA.bind("tap",PageClick);
		}
		$('#PagesDiv').append(PageA);
	}
	if(MaxPage < SumPage) {
		var NextPageA = $('<a href="#" class="ui-btn">>>></a>');
		NextPageA.bind("tap",PageClick);
		$('#PagesDiv').append(NextPageA);
	}
}

function ReBuildTable() {
	var DataSource = filter ? ShowUserList:UserList;
	var table = $('<table></table>');
	var tbody = $('<tbody></tbody>');
	
	table.append(tbody);
	tbody.append('<tr><th>編號</th><th>姓名</th><th>註記</th><th>刪除</th></tr>');
	for(var i=CustomerPage * 10;i<(10 * (CustomerPage+1)) && i < DataSource.length;i++) {
		var onerow = DataSource[i];
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
	
}
function PageClick(event) {
	var Page = $( event.target ).text();
	//alert(Page);
	if(Page == '>>>') {
		CustomerPage += 10;
		var DataSource = filter ? ShowUserList:UserList;
		var SumPage = Math.ceil(DataSource.length/10);
		if(CustomerPage > SumPage) {
			CustomerPage = SumPage;
		}
	}
	else if(Page == '<<<') {
		CustomerPage -= 10;
		if(CustomerPage < 0) {
			CustomerPage = 0;
		}
	}
	else {
		CustomerPage = parseInt(Page)-1;
	}
	initTable();
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
	$('#SearchTb').change(Search);
}






$(document).ready(init);