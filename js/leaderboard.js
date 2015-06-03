/**
*  File name: leaderboard.js
*  Developer(s): John Pillion
*/

window.leaderboard = window.leaderboard || {};

leaderboard.constants = leaderboard.constants || {};

leaderboard.constants.pointsPerClick = 5; // incremental point value
leaderboard.constants.pulse = 1; // seconds between each sync

leaderboard.selectedPlayer = {}; // data structure for storing the focused player


/**
 * The init function is called at the beginning of the program. No business logic should
 * be included here, only functions to init the program state
 */
leaderboard.init = function()
{
	leaderboard.initEvents();
	leaderboard.initButtonText();
	leaderboard.initPulse();
};


/**
 * Initialize all the global event listeners.
 */
leaderboard.initEvents = function()
{
	// handle when a player is clicked
	$(".playerList").on("click", ".player", leaderboard.clickPlayer);

	// handle when points are awarded
	$(".givePointsBtn").on("click", leaderboard.givePoints);
};


/**
 * The button text is dynamic, based on the points awarded config setting above
 */
leaderboard.initButtonText = function()
{
	var btnText = "Give " + leaderboard.constants.pointsPerClick + " points";
	$(".givePointsBtn button").text(btnText);
};


/**
 * The pulse checks the server and updates the leaderboard at intervals
 * defined by the config set at the top
 */
leaderboard.initPulse = function()
{
	// config is set in seconds, calculate to microseconds
	var pulseMicro = leaderboard.constants.pulse * 1000;

	// refresh the leaderboard
	setInterval(leaderboard.getScores, pulseMicro);
};


/**
 * When a player is clicked, we need to highlight them, and set save the selected
 * player in the data structure for future reference
 */
leaderboard.clickPlayer = function()
{
	// only relevant to the first click - hide the instructions
	// and show the player in the controller/details
	$(".instructions").hide();
	$(".controller .player").show();

	// we want to clear any previously selected players
	// and then highlight the player clicked on
	$(".player.selected").removeClass("selected");
	$(this).addClass("selected");

	// save off the selected player data
	leaderboard.selectedPlayer = $(this).data();

	// display the selected player in the controller
	$(".controller .player .playerName").text(leaderboard.selectedPlayer.playername);
};


/**
 * query the server for the latest scores and ranking. This is done via ajax
 * on a pulse interval, as well as at the end of the givePoints() function.
 */
leaderboard.getScores = function()
{
	// make the request
	var request = $.ajax({
		url:"php/api.php",
		dataType: "json",
		cache: false
	});

	request.done(leaderboard.buildLeaderboard);
};


/**
 * award points to the selected player.  The number of points awarded are defined
 * in the config set at the top of the program.
 */
leaderboard.givePoints = function()
{
	// params for the server request
	var params = {
		"task":"add",
		"pts":leaderboard.constants.pointsPerClick,
		"plr":leaderboard.selectedPlayer.playerid
	}

	// make the request
	var request = $.ajax({
		url:"php/api.php",
		dataType: "json",
		cache: false,
		data: params
	});

	// parse the response
	request.done(leaderboard.buildLeaderboard);

	// theoretically, we should also have a .fail() and .always() for better
	// stability and error handling. 
};


/**
 * Parse the score and ranking data, and output it to the page.
 */
leaderboard.buildLeaderboard = function(data)
{
	// clear the current listing
	$(".playerList").html("");

	// for each player in the response
	$(data).each(function(){

		// "this" represents a single player, which we pass to the 
		// function that returns the html player segment
		var playerRow = $(leaderboard.playerRow(this));

		// if "this" player's id matches the ID that we have saved 
		// then highlight it as the selected player
		if(this.plrPlayerID == leaderboard.selectedPlayer.playerid)
		{
			playerRow.addClass("selected");
		}

		// add the player to the list
		$(".playerList").append(playerRow);
	});
};


/**
 *	Takes a player object, and returns the HTML segment to display them in the list
 */
leaderboard.playerRow = function(player)
{
	var playerRow = "<div class='player' data-playerid='" + player.plrPlayerID + "' data-playername='" + player.plrName + "'><div class='playerName'>" + player.plrName + "</div><div class='playerScore'>" + player.plrScore + "</div></div>";

	return playerRow;
};