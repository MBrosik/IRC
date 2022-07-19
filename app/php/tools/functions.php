<?php

function get_data($dataBase, $table, $key = null, $value = null)
{
   $result = null;
   $arr = null;

   if ($key == null || $value == null) {
      $result = mysqli_query($dataBase, "SELECT * FROM " . $table);
      $arr = mysqli_fetch_all($result, MYSQLI_ASSOC);
   } else {
      $result = mysqli_query($dataBase, "SELECT * FROM " . $table . " WHERE '" . $key . "'='" . $value . "'");
      $arr = mysqli_fetch_all($result, MYSQLI_ASSOC);
   }

   return $arr;
}


function my_filter($old_array, $callback)
{
   $newArray = array();
   foreach ($old_array as $key => $value) {
      if ($callback($value) == 1) {
         array_push($newArray, $value);
      }
   }
   return $newArray;
}
