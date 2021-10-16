<?php 
    include 'config.php';

    $mysqli = new mysqli($host, $username, $password, $databaseName);
    $startQuery = 'INSERT INTO Product (title, price, sale, img, hoverImg, category) VALUES ';
    foreach (json_decode(file_get_contents($pathToJson))->goods as $product) {
        $query = $startQuery . "('$product->title', $product->price, " . ($product->sale + false) . ", '$product->img', '$product->hoverImg', '$product->category')";
        echo $mysqli->query($query);
    }
?>