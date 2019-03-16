import React, {Component} from "react";

class Textarea extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            text: "",
            label: ""
        }

        this.update = this.update.bind(this);
    }

    componentDidMount()
    {
        this.setState({label: this.props.label + "(" + this.props.maxLength + " Zeichen übrig)"});
    }

    update(e)
    {
        e.preventDefault();
        if(this.props.attr.error)
        {
            this.props.reset();
        }
        this.setState({text: e.target.value, label: this.props.label + "(" + (this.props.maxLength - e.target.value.length) + " Zeichen übrig)"});
        this.props.update(this.props.id, e.target.value);
    }

    render()
    {
        return (
            <div className={"form-group" + (this.props.attr.error ? " has-error" : "")}>
                <label>{this.state.label}</label>
                <textarea maxLength={this.props.maxLength} className="form-control" rows={this.props.rows} placeholder={this.props.placeholder} value={this.state.text} onChange={this.update}></textarea>
                {this.props.attr.error ? (
                    <span className="help-block"><small>{this.props.attr.errorText}</small></span>
                ) : ""}
            </div>
        );
    }

}

export default Textarea;