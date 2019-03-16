import React, {Component} from "react";
import Checkbox from "./Checkbox.jsx";

class SelectGroup extends Component
{

    constructor(props)
    {
        super(props);
    }

    render()
    {
        console.log(this.props.options);
        return (
            <div className="form-group">
                <label>{this.props.label}</label>
                {Object.entries(this.props.options).map(([key, value]) => (
                    <Checkbox name={key} disabled={!value} />
                ))}
            </div>
        );
    }

}

export default SelectGroup;