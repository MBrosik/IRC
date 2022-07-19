<?php
include("./tools/functions.php");

$json = file_get_contents('php://input');
$json_req = json_decode($json, true);

if (
   $json_req["message"] != ""
   && $json_req["name"] != ""
   && $json_req["color"] != ""
   && $json_req["room"] != ""
) {
   include("./tools/dbconfig.php");
   $conn = mysqli_connect($host, $user, $passwd, $dbname);

   $stmt = mysqli_prepare($conn, "INSERT INTO messages (message, user, color, room) VALUES (?,?,?,?)");
   mysqli_stmt_bind_param($stmt, "ssss", $json_req["message"], $json_req["name"], $json_req["color"], $json_req["room"]);
   mysqli_stmt_execute($stmt);
}
