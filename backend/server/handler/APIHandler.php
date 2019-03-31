<?php
/**
 * Created by PhpStorm.
 * User: mc17uulm
 * Date: 16.03.2019
 * Time: 14:34
 */

namespace server\handler;

use PHPDatabase\connection\Database;
use PHPRouting\routing\Request;
use PHPRouting\routing\response\Response;

class APIHandler
{

    public static function get_init(Response $res) : void
    {

        $r = Database::select("SELECT * FROM organizations");
        $out = array();
        foreach($r as $org)
        {
            $r = Database::select("SELECT * FROM districts WHERE organization_id = :id", array(":id" => $org["id"]));
            $districts = array();
            foreach($r as $d)
            {
                array_push($districts, array("name" => $d["name"], "characters" => $d["characters"]));
            }
            array_push($out, array("name" => $org["name"], "districts" => $districts));
        }

        $res->send_success($out);

    }

    public static function add(Request $req, Response $res) : void
    {
        if(self::multiple_request($req)){
            $res->send_error("Invalid request");
            die();
        }
        $data = $req->get_body();
        $csrf = $req->get_headers()["CsrfToken"];
        $r = Database::insert(
            "INSERT INTO people (firstname, lastname, date_of_birth, organization, district, in_kt, in_gr, in_or, family, children, grandkids, job, statement, send, csrf) 
                  VALUES (:firstname, :lastname, :date_of_birth, :organization, :district, :in_kt, :in_gr, :in_or, :family, :children, :grandkids, :job, :statement, NOW(), :csrf)",
            array(
                ":firstname" => $data["firstname"],
                ":lastname" => $data["lastname"],
                ":date_of_birth" => $data["date_of_birth"],
                "organization" => $data["organization"],
                ":district" => $data["district"],
                ":in_kt" => intval($data["gremium"]["kt"]),
                ":in_gr" => intval($data["gremium"]["gr"]),
                ":in_or" => intval($data["gremium"]["or"]),
                ":family" => $data["family"],
                ":children" => $data["children"],
                ":grandkids" => $data["grandkids"],
                ":job" => $data["job"],
                ":statement" => $data["statement"],
                ":csrf" => $csrf
            )
        );
        $r ? $res->send_success() : $res->send_error("Database error");
    }

    private static function multiple_request(Request $req) : bool
    {
        $r = Database::select("SELECT send FROM people WHERE csrf = :c", array(":c" => $req->get_headers()["CsrfToken"]));
        return count($r) !== 0;
    }

}