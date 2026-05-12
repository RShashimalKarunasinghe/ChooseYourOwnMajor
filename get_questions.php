<?php 

header("content-Type: application/json");




include("db.php");


$sql = "
SELECT q.question_id,
q.text,
o.option_id,
o.option_key,
o.option_text,
o.subtext,
o.feedback,
os.major_code,
os.score
FROM questions q
JOIN options o ON o.question_id = q.question_id
JOIN option_scores os ON os.option_id = o.option_id
";


$result = $mysqli->query($sql);

if ($result->num_rows > 0) {

    $questions = [];

    while($row = $result->fetch_assoc()) {
       // echo "id: " . $row["question_id"]. " - text: " . $row["text"]. " - option id" .$row["option_id"]. " - option_key" .$row["option_key"]. " - option_text".$row["option_text"]." - subtext".$row["subtext"]." - feedback".$row["feedback"]." - major_code".$row["major_code"]." - score".$row["score"]."<br>";
        $qid = $row["question_id"];
        


        if (!isset($questions[$qid])) {
            $questions[$qid] = [
                "id"        => (int)$row["question_id"],
                "text"      => $row["text"],
                "options"   => []
            ];
        }

        $oid = $row["option_id"];

        if (!isset($questions[$qid]["options"][$oid])){
            $questions[$qid]["options"][$oid] = [
                "key"       => $row["option_key"],
                "text"      => $row["option_text"],
                "feedback"  => $row["feedback"],
                "scores"    => [],
                "subtext"   => $row["subtext"],
                
            ];
        }
      $questions[$qid]["options"][$oid]["scores"][$row["major_code"]] = (int)$row["score"];

        
        
}} else {
    echo "0 results";
}



          $output = array_values($questions);
        foreach ($output as &$question) {
            $question["options"] = array_values($question["options"]);
        }
        echo json_encode($output);
    


$mysqli->close();
?>