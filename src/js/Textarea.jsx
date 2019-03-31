import React, {Component} from "react";

class Textarea extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            text: ""
        }

        this.update = this.update.bind(this);
    }

    update(e)
    {
        e.preventDefault();
        if(this.props.attr.error)
        {
            this.props.reset();
        }
        this.setState({text: e.target.value});
        this.props.update(this.props.id, e.target.value);
    }

    render()
    {
        return (
            <div className={"form-group" + (this.props.attr.error ? " has-error" : "")}>
                <label>{this.props.label + " (" + (this.props.maxLength - this.state.text.length) + " Zeichen übrig)"}</label>
                <textarea maxLength={this.props.maxLength} className="form-control" rows={this.props.rows} placeholder={this.props.placeholder} value={this.state.text} onChange={this.update}></textarea>
                {this.props.attr.error ? (
                    <span className="help-block"><small>{this.props.attr.errorText}</small></span>
                ) : ""}
            </div>
        );
    }

}

export default Textarea;