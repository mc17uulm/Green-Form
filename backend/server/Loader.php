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
use server\handler\APIHandler;

class Loader
{

    public static function handle(bool $dev = false)
    {

        try{
            Database::load_from_env($dev);
        } catch(DatabaseException $e)
        {
            die($e->getMessage());
        }
        session_start();

        if($dev){

            error_reporting(E_ALL);
            ini_set('display_errors',1);

            header("Access-Control-Allow-Origin: *");
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
            header("Access-Control-Allow-Headers: *");
            header("Access-Control-Allow-Credentials: true");
        }

        Router::init("");

        Router::add_dir("/public", __DIR__ . "/../public/");

        Router::get("/", function(Request $req, Response $res) {
            $res->parse_php_file(__DIR__ . "/../sites/index.php");
        });

        Router::get("/api/init", function(Request $req, Response $res) {
            $req->is_valid_api_request() ? APIHandler::get_init($res) : $res->send_error("Invalid request");
        });

        Router::post("/api/add", function(Request $req, Response $res) {
            $req->is_valid_api_request() ? APIHandler::add($req, $res) : $res->send_error("Invalid request");
        });

        /**if($dev)
        {
            Router::get("/main.js", function(Request $req, Response $res) {
                header("Location: http://localhost:8081/main.js");
            });
        }*/

        Router::handle404(function($t) {
           header("Location: /");
        });

        Router::run();

    }

}