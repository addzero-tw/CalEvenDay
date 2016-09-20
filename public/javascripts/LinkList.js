
function init() {
	$.ajax({
			url:'../buddha/TodayBuddhaCountLink'
			,type:'get'
			,dataType:'json'
			,success:function(Jdata) {
				$('#LinkDiv').empty();
				var TodaySpan = $('<span>今日念佛報數 : '+Jdata.BuddhaCountLink+' <span>');
				var UserListA = $('<a href="UserList.htm" class="ui-btn">念佛信眾名單</a>');
				var YesterDayA = $('<a href="../buddha/YesterdayCountList" class="ui-btn">昨日念佛報數統計</a>');
				var LastMonthA = $('<a href="../buddha/ThisMonthCountList" class="ui-btn">本月念佛報數統計</a>');
				$('#LinkDiv')
					.append(TodaySpan)
					.append($('<span></span>').append(UserListA))
					.append($('<span></span>').append(YesterDayA))
					.append($('<span></span>').append(LastMonthA));
			}
			,error:function(){
				
			}
		});
}
$(document).ready(init);