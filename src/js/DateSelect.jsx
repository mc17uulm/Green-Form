import React, {Component} from "react";

class DateSelect extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            date: 'yyyy-mm-dd'
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e)
    {
        e.preventDefault();
        if(this.props.attr.error)
        {
            this.props.reset();
        }
        this.setState({date: e.target.value});
        this.props.update(this.props.id, e.target.value);
    }

    render()
    {
        return (
            <div className={"form-group" + (this.props.attr.error ? " has-error" : "")}>
                <label>{this.props.label}</label>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"><i className="fa fa-calendar"></i></span>
                        <input type="date" className="form-control" min="1900-01-01" max="2001-05-26" value={this.state.date} onChange={this.handleChange}/>
                    </div>
                </div>
                {this.props.attr.error ? (
                    <span className="help-block"><small>{this.props.attr.errorText}</small></span>
                ) : ""}
            </div>
        );
    }

}

export default DateSelect;