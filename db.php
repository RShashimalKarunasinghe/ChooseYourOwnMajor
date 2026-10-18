<?php


//replace with your own details and use xammp to run 

$mysqli = new mysqli("localhost", "root", "password123", "chooseyourmajor", 3306);

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}




