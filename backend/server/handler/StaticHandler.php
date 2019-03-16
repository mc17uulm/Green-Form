<?php
/**
 * Created by PhpStorm.
 * User: mc17uulm
 * Date: 16.03.2019
 * Time: 14:34
 */

namespace server\handler;

use PHPDatabase\connection\Database;
use PHPRouting\routing\response\Response;

class StaticHandler
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

}