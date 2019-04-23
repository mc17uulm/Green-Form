<?php
/**
 * Created by PhpStorm.
 * User: mc17uulm
 * Date: 17.03.2019
 * Time: 21:18
 */

namespace server;

use PHPDatabase\connection\Database;
use PhpOffice\PhpSpreadsheet\Reader\Csv;
use PhpOffice\PhpSpreadsheet\Reader\Exception;
use PhpOffice\PhpSpreadsheet\Writer\Xls;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;

class Crawler
{

    public static function get_all(string $type) : void
    {

        $dir = __DIR__ . "/../backup/";
        if(!file_exists($dir)){
            mkdir($dir);
        }
        if(is_dir($dir))
        {
            system("rm -rf " . escapeshellarg("$dir*"));
            $organizations = Database::select("SELECT id, name FROM organizations");
            foreach($organizations as $organization)
            {
                $prefix = str_replace(" ", "_", $organization["name"]);
                $tmp_dir = "$dir$prefix/";
                mkdir($tmp_dir);
                $districts = Database::select("SELECT name FROM districts WHERE organization_id = :id", array(":id" => $organization["id"]));
                foreach($districts as $district)
                {
                    $file = $tmp_dir . str_replace(" ", "_", $district["name"]);
                    $csv = "$file.csv";
                    $xls = "$file.xls";
                    $content = array("vorname;nachname;alter;kreistag;gemeinderat;ortschaftsrat;familienstand;beruf;text");
                    $people = Database::select("SELECT * FROM people WHERE district = :d", array(":d" => $district["name"]));
                    if(count($people) > 0){
                        foreach($people as $human)
                        {
                            $c = array($human["firstname"], $human["lastname"], self::calculate_age($human["date_of_birth"]), self::to_bool($human["in_kt"]), self::to_bool($human["in_gr"]), self::to_bool($human["in_or"]), $human["family"], $human["job"], $human["statement"]);
                            array_push($content, implode(";", $c));
                        }
                        $content = implode("\r\n", $content);
                        file_put_contents($csv, $content);
                        if(self::csv_to_xsl($csv, $xls))
                        {
                            unlink($csv);
                        }
                    }
                }
            }

            self::save_to_zip($dir);
            system("rm -rf " . escapeshellarg("$dir*"));
        }

    }

    public static function get_districts (array $districts, string $type) : void {
        foreach($districts as $district)
        {
            self::get_district($district, $type);
        }
    }

    public static function get_district(string $district, string $type) : void {
        switch($type)
        {
            case "json":
            case "odt":
            case "docx":
            case "csv":
            case "xls":
                break;
            default:
                die("Error: Invalid file type");
        }
        $dir = __DIR__ . "/../backup/";
        $doc = $dir . "$district.$type";
        if(!file_exists($dir)){
            mkdir($dir);
        }
        if(is_dir($dir)) {
            $people = Database::select("SELECT * FROM people WHERE district = :d", array(":d" => $district));
	        $count = count($people);
	        echo "Count: $count\r\n";
            if($count > 0){
                switch($type)
                {
                    case "json":
                        self::save_to_json($people, $doc);
                        break;
                    case "odt":
                        self::save_to_odt(self::build_text($people), $doc);
                        break;
                    case "docx":
                        self::save_to_docx(self::build_text($people), $doc);
                        break;
                }
                echo "finished";
            }
        }

    }

    private static function build_text(array $data) : string
    {
        $str = "";
        foreach($data as $human)
        {
            $str .= $human["firstname"] . " " . $human["lastname"] . "<w:br/>";
            $str .= self::calculate_age($human["date_of_birth"]) . " Jahre alt<w:br/>";
            $str .= $human["job"] . "<w:br/>";
            $str .= $human["family"] . "<w:br/>Kandidiert für ";
            if($human["in_kt"]) $str .= "Kreistag, ";
            if($human["in_gr"]) $str .= "Gemeinderat, ";
            if($human["in_or"]) $str .= "Ortschaftsrat";
            $str .= "<w:br/>";
            $str .= "Kinder: " . $human["children"] . " | Enkelkinder: " . $human["grandkids"] . "<w:br/>";
            $str .= $human["statement"] . "<w:br/><w:br/>";
        }
        return $str;
    }

    private static function save_to_zip(string $dir) : string
    {
        $zip = new \ZipArchive();
        $zip->open(__DIR__ . "/../backup.zip", \ZipArchive::CREATE | \ZipArchive::OVERWRITE);

        $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($dir), \RecursiveIteratorIterator::LEAVES_ONLY);

        foreach($files as $name => $file)
        {
            if(!$file->isDir())
            {
                $path = $file->getRealPath();
                $relative = substr($path, strlen($dir) + 1);

                $zip->addFile($path, $relative);
            }
        }

        $zip->close();

        return "backup.zip";
    }

   private static function calculate_age(string $date) : int
    {
        $election = explode(".", "26.05.2019");
        $birth = explode("-", $date);

        if(intval($birth[1]) < intval($election[1]))
        {
            return intval($election[2]) - intval($birth[0]);
        }
        else if(intval($birth[1]) === intval($election[1]))
        {
            if(intval($birth[2]) <= intval($election[0]))
            {
                return intval($election[2]) - intval($birth[0]);
            }
            else
            {
                return intval($election[2]) - intval($birth[0]) -1;
            }
        }
        else
        {
            return intval($election[2]) - intval($birth[0]) -1;
        }
    }
    
    private static function to_bool(int $val) : string 
    {
        switch($val)
        {
            case 1: return "true";
            default: return "false";
        }
    }

    private static function save_to_docx(string $data, string $docx) : bool
    {
        $word = new PhpWord();
        $section = $word->addSection();
        $section->addText($data, array('name' => 'PT Sans', 'size' => 10));
        try {
            $writer = IOFactory::createWriter($word, 'Word2007');
            $writer->save($docx);
        } catch (\PhpOffice\PhpWord\Exception\Exception $e) {
            echo $e->getMessage();
            return false;
        }
        return true;
    }

    private static function save_to_odt(string $data, string $doc) : bool
    {
        $word = new PhpWord();
        $section = $word->addSection();
        foreach(explode("<w:br/>", $data) as $line) {
            $section->addText(htmlspecialchars($line), array('name' => 'PT Sans', 'size' => 10));
        }
        try {
            $writer = IOFactory::createWriter($word, 'ODText');
            $writer->save($doc);
        } catch (\PhpOffice\PhpWord\Exception\Exception $e) {
            echo $e->getMessage();
            return false;
        }
        return true;
    }

    private static function save_to_json(array $data, string $file) : bool
    {

        $candidates = array();
        foreach($data as $human)
        {
            array_push($candidates, array(
                "name" => $human["firstname"] . " " . $human["lastname"],
                "age" => self::calculate_age($human["date_of_birth"]),
                "job" => $human["job"],
                "family" => $human["family"],
                "children" => $human["children"],
                "grandchildren" => $human["grandkids"],
                "statement" => $human["statement"],
                "picture" => "https://combosch.de/public/kommunalwahl/" . str_replace(" ", "", $human["firstname"]) . "-" . str_replace(" ", "", $human["lastname"]) . ".jpg",
                "committee" => array(
                    "kt" => array("active" => boolval($human["in_kt"]), "position" => -1),
                    "gr" => array("active" => boolval($human["in_gr"]), "position" => -1),
                    "or" => array("active" => boolval($human["in_or"]), "position" => -1),
                )
            ));
        }

        file_put_contents($file, json_encode(array("candidates" => $candidates), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        return true;

    }

    private static function csv_to_xsl(string $csv, string $xls) : bool
    {
        $spreadsheet = new Spreadsheet();
        $reader = new Csv();
        $reader->setDelimiter(";");
        $reader->setSheetIndex(0);

        try {

            $spreadsheet = $reader->load($csv);

            $writer = new Xls($spreadsheet);
            $writer->save($xls);

            $spreadsheet->disconnectWorksheets();
            unset($spreadsheet);

            return true;

        } catch (Exception $e) {
            echo $e->getMessage();
            return false;
        } catch (\PhpOffice\PhpSpreadsheet\Writer\Exception $e) {
            echo $e->getMessage();
            return false;
        }

    }

}
