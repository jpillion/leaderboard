<?php

// handles communication with the tblPlayers database

class scoreTable
{    
    private $dbconn;

    function __construct() 
    {
        $this->connectToDB();
    }

    /**
     *  Get the scores and rankings of all players
     *
     *  @return array a multi-dim array of players and their attributes
     * 
     */
    public function getScores()
    {
        // alias for the DB connection
        $db = $this->dbconn;

        // select all the players and their attributes from the database
        $scoresQry = "SELECT plrPlayerID, plrName, plrScore FROM tblPlayers order by plrScore desc, plrName";
        
        $scores = array();
        // retrieve each record, and add it to a multi-dim array
        foreach ($db->query($scoresQry) as $row) 
        {
            $scores[] = $row;
        }

        // return the full data set
        return $scores;
    }

    /**
     *  Increments a player's points
     *
     *  @param int The ID of the player to add points to
     *  @param int The number of points to add
     */
    public function addPoints($playerID, $pointsToAdd)
    {
        // alias for the DB connection
        $db = $this->dbconn;

        if(!is_numeric($playerID) || !is_numeric($pointsToAdd))
        {
            return false;
        }

        // prepare an update statement, to update the specified players points
        $addPointsStmt = $db->prepare('update tblPlayers SET plrScore = plrScore + ?  WHERE plrPlayerID = ?');

        // if the prepare was successful, then run the update
        if($addPointsStmt !== false)
        {
            $addPointsStmt->execute(array($pointsToAdd, $playerID));
        }        
    }

    /**
     *  Connect to the DB
     *  Only called on the initial construct
     */
    private function connectToDB()
    {
        // the connection details are stored in config.php
        try
        {
            $this->dbconn = new PDO(DBSERVER, DBUSER, DBPASS);
        }
        catch (PDOException $error)
        {
            echo 'DB Connection failed to connect!: ' . $error->getMessage();
        }
    }
}