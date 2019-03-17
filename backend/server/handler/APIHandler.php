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
                array_push($districts, array("name" => $d["name"], "options" => array(
                    "Kreistag" => boolval(intval($d["has_kt"])),
                    "Gemeinderat" => boolval(intval($d["has_gr"])),
                    "Ortschaftsrat" => boolval(intval($d["has_or"]))
                )));
            }
            array_push($out, array("name" => $org["name"], "districts" => $districts));
        }

        $res->send_success($out);

    }

    public static function add(Request $req, Response $res) : void
    {
        $data = $req->get_body();
        $r = Database::insert(
            "INSERT INTO people (firstname, lastname, date_of_birth, organization, district, in_kt, in_gr, in_or, family, job, statement, send) 
                  VALUES (:firstname, :lastname, :date_of_birth, :organization, :district, :in_kt, :in_gr, :in_or, :family, :job, :statement, NOW())",
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
                ":job" => $data["job"],
                ":statement" => $data["statement"]
            )
        );
        $r ? $res->send_success() : $res->send_error("Database error");
    }

}