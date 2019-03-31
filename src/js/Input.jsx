import React, {Component} from "react";

class Input extends Component
{

    constructor(props)
    {
        super(props);

        this.change = this.change.bind(this);
    }

    change(e)
    {
        e.preventDefault();
        if(this.props.attr.error)
        {
            this.props.reset();
        }
        this.props.update(this.props.id, e.target.value);

    }

    render()
    {
        return (
            <div className={"form-group" + (this.props.attr.error ? " has-error" : "")}>
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <input maxLength={this.props.maxLength} type={this.props.type} className="form-control" id={this.props.id} placeholder={this.props.placeholder} value={this.props.attr.value} onChange={this.change} />
                {this.props.attr.error ? (
                    <span className="help-block"><small>{this.props.attr.errorText}</small></span>
                ) : ""}
            </div>
        );
    }

}

export default Input;