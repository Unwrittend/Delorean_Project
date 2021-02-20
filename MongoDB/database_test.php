<?php 

    

    function databaseCheck(string $username, string $pwd, string $cluster_adr) {
        $client = new MongoDB\Client(
            'mongodb+srv://'+$username+':'+$pwd+'@'+$cluster_adr+'/test?retryWrites=true&w=majority'
        );

        $db = $client->test;
    }
?>