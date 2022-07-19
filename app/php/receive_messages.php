<?php
include("./tools/functions.php");

$json = file_get_contents('php://input');
$json_req = json_decode($json, true);

include("./tools/dbconfig.php");

$conn = mysqli_connect($host, $user, $passwd, $dbname);

function get_messages()
{
   global $conn;
   return my_filter(get_data($conn, "messages"), function ($el) {
      global $json_req;
      return $el["room"] == $json_req["room"] && strtotime($el["time"]) > ($json_req["change_time"] / 1000);
   });
}

if ($json_req["last_id"] == 0) {
   $pre_messages = get_messages();
   if (count($pre_messages) != 0) {
      $json_req["last_id"] = end($pre_messages)["id"];
   }
}

$new_messages = array();

$time = microtime(true);

while (microtime(true) - $time < 20) {
   $messages = get_messages();

   $last_id = -1;
   if (count($messages) != 0) {
      $last_id = end($messages)["id"];
   }

   if (intval($json_req["last_id"]) < intval($last_id)) {

      $stmt = mysqli_prepare($conn, "DELETE FROM messages WHERE time < (current_timestamp() - INTERVAL 2 SECOND)");
      mysqli_stmt_execute($stmt);

      $new_messages = my_filter($messages, function ($el) {
         global $json_req;
         return $el["id"] > $json_req["last_id"];
      });
      break;
   }
   usleep(1000);
}

echo json_encode($new_messages, JSON_UNESCAPED_UNICODE);
