<?php 

header("content-Type: application/json");


include("db.php");

$sql = "SELECT * FROM majors";

$result = $mysqli->query($sql);



if ($result->num_rows > 0) {
    $majors = [];
    while($row = $result->fetch_assoc()){

    $majors[] = [
        "code"              =>  $row["major_code"],
        "title"             =>  $row["title"],
        "careers"           =>  $row["careers"],
        "resultReason"      =>  $row["result_reason"],
        "exploreText"       =>  $row["explore_text"],
        "personalityTags"   =>  $row["personality_tags"]
    ];

    }
    echo json_encode($majors);
} else {
    echo json_encode([]);
}

?>