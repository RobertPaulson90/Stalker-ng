var game = "bf3";

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
function parsePlayerStatus (status) {
	switch (status) {
		case 0: 
			return "No"
			break;
		case 1:
			return "Online"
			break;
		case 2:
			return "Playing"
			break;
		default:
			return "No"
	}
}

function addToTable (playerData) {
	$(playerData).each(function (index, player) {
		if (player.n) {
			$("#example").dataTable().fnAddData([
				'<div class="platform platform-' + player.p + '"></div>' +
				(player.url !== '#' ? '<a target="_blank" href="' + player.u + '">' + player.t + '</a>' : player.t), 
				'<a target="_blank" href="' + "http://battlelog.battlefield.com/" + game + "/user/" + player.n + '">' + (player.a ? player.n + " (" + player.a + ")" : player.n) + '</a>',
				parsePlayerStatus(player.s),
				(player.s == 2 ? '<a target="_blank" href="' + player.su + '">' + player.st + '</a>' : "")
			]);
		}
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
		"oLanguage": { "sSearch": "" },
		"aaData": [
			/* Reduced data set */
		],
		"aaSorting": [[2, "desc"], [0, "desc"]],
		"aoColumns": [
			{"sTitle": "Type"},
			{"sTitle": "Name"},
			{"sTitle": "Playing"},
			{"sTitle": "Server"}
		]
	});
	$(".dataTables_filter").before('<a class="btn" id="refresh-button" style="float:right; margin-left:5px;"><i class="icon-refresh"></i></a>');
	$("#refresh-button").click(function () {
		refreshData();
	});
});