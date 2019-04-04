import React, {Component} from "react";

class Textarea extends Component
{

    constructor(props)
    {
        super(props);

        this.update = this.update.bind(this);
    }

    update(e)
    {
        e.preventDefault();
        if(this.props.text.error)
        {
            this.props.reset();
        }
        this.props.update(this.props.id, e.target.value);
    }

    render()
    {
        return (
            <div className={"form-group" + (this.props.text.error ? " has-error" : "")}>
                <label>{this.props.label + " (" + (this.props.maxLength - this.props.text.value.length) + " Zeichen übrig)"}</label>
                <textarea maxLength={this.props.maxLength} className="form-control" rows={this.props.rows} placeholder={this.props.placeholder} value={this.props.text.value} onChange={this.update}></textarea>
                {this.props.text.error ? (
                    <span className="help-block"><small>{this.props.text.errorText}</small></span>
                ) : ""}
            </div>
        );
    }

}

export default Textarea;