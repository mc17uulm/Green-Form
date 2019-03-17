<?php
/**
 * Created by PhpStorm.
 * User: mc17uulm
 * Date: 17.03.2019
 * Time: 21:20
 */

require_once 'vendor/autoload.php';

PHPDatabase\config\Config::load(__DIR__);
try{
    \PHPDatabase\connection\Database::load_from_env(true);
} catch(\PHPDatabase\connection\DatabaseException $e)
{
    die($e->getMessage());
}

\server\Crawler::get_all("");

/*$dates = array(
    "25.05.1993",
    "26.05.1993",
    "27.05.1993",
    "01.01.1993",
    "31.12.1993"
);

foreach($dates as $date)
{
    echo "Date: $date\r\n";
    $age = \server\Crawler::calculate_age($date);
    echo "Age: $age\r\n\r\n";
}*/