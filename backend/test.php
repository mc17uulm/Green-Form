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

\server\Crawler::get_all();
