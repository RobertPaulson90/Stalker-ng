function showPage (page) {
	$(".page").hide();
	$(".menu-button").parent().removeClass("active");
	$("#" + page + "-page").show();
	$("#" + page + "-button").parent().addClass("active");
}
function showCorrectPage () {
	var hashtag = window.location.hash.replace('#', '');
	switch (hashtag) {
		case "players": showPage("players");
			break;
		case "about": showPage("about");
			break;
		case "changelog": showPage("changelog");
			break;
		default: showPage("players");
			break;
	}
}
function timeConverter(UNIX_timestamp){
	var a = new Date(UNIX_timestamp*1000);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var time = date + ' ' + month + ' ' + year + ' at ' + (hour < 10 ? '0' + hour : hour) + ':' + (min < 10 ? '0' + min : min);
	return time;
}
function addToTable (playerData) {
	$(playerData).each(function (index, player) {
			$("#example").dataTable().fnAddData([
				'<div class="platform platform-' + player.platform + '"></div>' +
				(player.url !== '#' ? '<a target="_blank" href="' + player.url + '">' + player.type + '</a>' : player.type), 
				'<a target="_blank" href="' + player.battlelog + '">' + player.name + '</a>',
				player.status,
				(player.playing ? '<a target="_blank" href="' + player.serverUrl + '">' + player.serverTitle + '</a>' : "")
			]);
	});
}
function refreshData () {
	$.getJSON("api/api.php?game=bf3", function (data) {
		$("#example").dataTable().fnClearTable();
		addToTable(data.players);
		//$("#example_length").html('<label>Data is continuously updated</label>');
		//$("#success").fadeTo(1000,1);
	});
}

$(document).ready(function() {
	$("#players-button, #brand-button").click(function () {
		showPage("players");
	});
	$("#opt-out-button").click(function () {
		showPage("opt-out");
	});
	$("#about-button").click(function () {
		showPage("about");
	});
	showCorrectPage();
	$.getJSON("api/api.php?game=bf3", function (data) {
		//$("#example_wrapper").prepend('<div id="example_length" class="dataTables_length"></div>');
		refreshData();
	});

	$('#player-table').html('<table cellpadding="0" cellspacing="0" border="0" class="table table-bordered" id="example"></table>');
	$('#example').dataTable( {
		"bPaginate": false,
		"bAutoWidth": true,
		"aaData": [
			/* Reduced data set */
		],
		"aaSorting": [[ 2, "desc" ]],
		"aoColumns": [
			{ "sTitle": "Type" },
			{ "sTitle": "Name" },
			{ "sTitle": "Playing" },
			{ "sTitle": "Server" }
		]
	});
	$(".dataTables_filter").before('<a class="btn" id="refresh-button" style="float:right; margin-left:5px;"><i class="icon-refresh"></i></a>');
	$("#refresh-button").click(function () {
		refreshData();
	});
});