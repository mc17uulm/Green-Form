<?php
/**
 * Created by PhpStorm.
 * User: mc17uulm
 * Date: 17.03.2019
 * Time: 21:20
 */

function show_help() : void
{
    echo "GreenForm Crawler\r\n-------------\r\n";
    echo "Usage: php crawler.php [--help] | [--crawl crawl_type [--type data_type]]\r\n";
    echo "\r\nManual:\r\n\t--help\tShows this help menu\r\n";
    echo "\t--crawl\tCrawls selected targets (Options: all | single district | multiple districts)\r\n";
    echo "\t--type\tSpecifies type of ouput crawling data (Options: json | docx | odt)\r\n\r\n";
    echo "2019 by mc17uulm";
    die();
}

function split_array(array $argv) : array
{
    $values = array();
    $key = "";
    for($i = 0; $i < count($argv); $i++)
    {
        if(substr($argv[$i], 0, 2) === "--")
        {
            $key = substr($argv[$i], 2);
            $values[$key] = array();
        }
        else
        {
            array_push($values[$key], $argv[$i]);
        }
    }

    return $values;
}

require_once 'vendor/autoload.php';

use server\Crawler;

PHPDatabase\config\Config::load(__DIR__);
try{
    \PHPDatabase\connection\Database::load_from_env(true);
} catch(\PHPDatabase\connection\DatabaseException $e)
{
    die($e->getMessage());
}

if(count($argv) > 1)
{
    array_shift($argv);
    $parts = split_array($argv);
    if(isset($parts["help"]))
    {
        show_help();
    }
    if(count($parts["crawl"]) === 1) {
        if($parts["crawl"][0] === "all"){
            Crawler::get_all($parts["type"] ?? "json");
        } else {
            Crawler::get_district($parts["crawl"][0], $parts["type"] ?? "json");
        }
    } else if(count($parts["crawl"]) > 1) {
        Crawler::get_districts($parts["crawl"], $parts["type"] ?? "json");
    }

}