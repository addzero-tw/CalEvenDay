var UserList = new Array();
var ShowUserList = new Array();
var filter = undefined;
var page = 0;
function initTable() {
	
	var table = $('<table></table>');
	var tbody = $('<tbody></tbody>');
	
	table.append(tbody);
	tbody.append('<tr><th>編號</th><th>姓名</th><th>註記</th><th>刪除</th></tr>');
	for(var i=0;i<10 && i < UserList.length;i++) {
		var onerow = UserList[i];
		var tr = $('<tr></tr>');
		tr.attr('UserID',onerow.ID);
		var IdTd = $('<td></td>')
			,NameTd = $('<td></td>')
			,NoteTd = $('<td></td>')
			,DelTd = $('<td></td>');
		IdTd.text(onerow.ID);
		NameTd.text(onerow.Name);
		NoteTd.text(onerow.Note == undefined ? '':onerow.Note);
		DelTd.append('<a href="#" class="ui-btn">刪除</a>');
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


function init() {
	$.ajax({
			url:'../buddha/UserList'
			,type:'get'
			,dataType:'json'
			,success:function(Jdata) {
				for(var i=0;i<Jdata.length;i++) {
					UserList.push({ID:Jdata[i].ID,Name:Jdata[i].Name,Note:Jdata[i].Note});
				}
				initTable();
			}
			,error:function(){
				
			}
		});
}






$(document).ready(init);