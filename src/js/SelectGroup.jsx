import React, {Component} from "react";
import Checkbox from "./Checkbox.jsx";
import Rows from "./Rows.jsx";
import Row from "./Row.jsx";

class SelectGroup extends Component
{

    constructor(props)
    {
        super(props);
        this.update = this.update.bind(this);
    }

    update(id, value)
    {
        if(this.props.attr.error)
        {
            this.props.reset();
        }
        this.props.update(id, value);
    }

    render()
    {
        return (
            <div className={"form-group" + (this.props.attr.error ? " has-error" : "")}>
                <label>{this.props.label}</label>
                <Rows>
                    <Row size="4">
                        <Checkbox id="kt" name="Kreistag" update={this.update}/>
                    </Row>
                    <Row size="4">
                        <Checkbox id="gr" name="Gemeinderat" update={this.update}/>
                    </Row>
                    <Row size="4">
                        <Checkbox id="or" name="Ortschaftsrat" update={this.update}/>
                    </Row>
                </Rows>
                {this.props.attr.error ? (
                    <span className="help-block"><small>{this.props.attr.errorText}</small></span>
                ) : ""}
            </div>
        );
    }

}

export default SelectGroup;