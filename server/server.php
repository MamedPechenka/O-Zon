<?php
    include 'config.php';

    echo json_encode((new mysqli($host, $username, $password, $databaseName))->query('SELECT * FROM Product')->fetch_all(MYSQLI_ASSOC));
?>
