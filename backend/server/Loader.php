<?php
/**
 * Created by PhpStorm.
 * User: mc17uulm
 * Date: 16.03.2019
 * Time: 13:39
 */

namespace server;

use PHPDatabase\connection\Database;
use PHPDatabase\connection\DatabaseException;
use PHPRouting\routing\Request;
use PHPRouting\routing\response\Response;
use PHPRouting\routing\Router;
use server\handler\StaticHandler;

class Loader
{

    public static function handle()
    {

        try{
            Database::load_from_env(true);
        } catch(DatabaseException $e)
        {
            die($e->getMessage());
        }

        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: *");
        header("Access-Control-Allow-Credentials: true");

        Router::init("");

        Router::add_dir("/public", __DIR__ . "/../public/");

        Router::get("/", function(Request $req, Response $res) {
            $res->send("Running");
        });

        Router::get("/init", function(Request $req, Response $res) {
            StaticHandler::get_init($res);
        });

        Router::get("/get_organizations", function(Request $req, Response $res) {
            $res->send_success(array("Kreisverband Heidenheim", "Kreisverband Aalen-Ellwangen", "Kresiverband Schwäbisch Gmünd"));
        });

        Router::run();

    }

}