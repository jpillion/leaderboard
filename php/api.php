<?php
	
	require_once("config.php");
	require_once("scoreTable.class.php");

	// initialize a new scoreTable object, which contains
	// all the I/O functionality 
	$scoreKeeper = new scoreTable();

	// retrieve the task.  Known options are "add" and <blank>
	$task = strtolower($_GET["task"]);
	
	// if the task is "add", then we are adding points to a player
	if ( $task == "add" )
	{
		$playerID = $_GET["plr"];
		$pointsToAdd = $_GET["pts"];
		$scoreKeeper->addPoints($playerID, $pointsToAdd);
	}

	// in all cases, output the resulting leaderboard
	echo json_encode($scoreKeeper->getScores());
?>