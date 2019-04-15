import React, {Component} from "react";
import Rows from "./../../Rows.jsx";
import Row from "./../../Row.jsx";

class ContentTable extends Component
{

    constructor(props)
    {
        super(props);

        this.printDate = this.printDate.bind(this);
        this.printGremium = this.printGremium.bind(this);
    }

    printDate(date)
    {
        let election = "26.05.2019".split(".").map(el => parseInt(el));
        let birth = date.split("-").map(el => parseInt(el));
        if(birth.length === 1) {
            birth = date.split('.').map(el => parseInt(el));
            birth = birth.reverse();
        }

        if(birth[1] < election[1]) {
            return election[2] - birth[0];
        } else if(birth[1] === election[1]) {
            if(birth[2] <= election[0]) {
                return election[2] - birth[0];
            } else {
                return election[2] - birth[0] - 1;
            }
        } else {
            return election[2] - birth[0] - 1;
        }
    }

    printGremium(gremium)
    {
        let count = 0;
        let data = "";
        if(gremium.kt)
        {
            count++;
            data += "Kreistag";
        }
        if(gremium.gr)
        {
            if(count > 0){
                data += ", Gemeinderat";
            } else {
                data += "Gemeinderat";
            }
            count++;
        }
        if(gremium.or) {
            if(count > 0) {
                data += ", Ortschaftsrat";
            } else {
                data += "Ortschaftsrat";
            }
        }
        return data;
    }

    render() {
        return (
            <div>
                <div className="alert alert-info">
                    <h4><i className="icon fa fa-info"></i> Wichtig!</h4>
                    <small>Bitte überprüfe hier noch einmal deine eingegebenen Daten. Einer spätere Änderung ist
                    nicht mehr möglich! Wenn du noch etwas ändern möchstest, kannst du das mit einem Klick auf "Zurück" tun.
                    </small>
                </div>
                <Rows>
                    <Row size="4">
                        <dl>
                            <dt>Kreisverband:</dt>
                            <dd>{this.props.obj.organization}</dd>
                            <dt>Alter:</dt>
                            <dd>{this.printDate(this.props.obj.date_of_birth)} Jahre</dd>
                            <dt>Kinder:</dt>
                            <dd>{this.props.obj.children}</dd>
                        </dl>
                    </Row>
                    <Row size="4">
                        <dl>
                            <dt>Gemeinde:</dt>
                            <dd>{this.props.obj.district}</dd>
                            <dt>Familienstand:</dt>
                            <dd>{this.props.obj.family}</dd>
                            <dt>Enkelkinder:</dt>
                            <dd>{this.props.obj.grandkids}</dd>
                        </dl>
                    </Row>
                    <Row size="4">
                        <dl>
                            <dt>Name:</dt>
                            <dd>{this.props.obj.firstname} {this.props.obj.lastname}</dd>
                            <dt>Beruf:</dt>
                            <dd>{this.props.obj.job}</dd>
                            <dt>Kandidat/in für:</dt>
                            <dd>{this.printGremium(this.props.obj.gremium)}</dd>
                        </dl>
                    </Row>
                </Rows>
                <Rows>
                    <Row size="12">
                        <dl>
                            <dt>Eigener Text:</dt>
                            <dd>{this.props.obj.statement}</dd>
                        </dl>
                    </Row>
                </Rows>
            </div>
        );
    }

}

export default ContentTable;