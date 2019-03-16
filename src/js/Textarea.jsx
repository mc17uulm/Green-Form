import React, {Component} from "react";

class Textarea extends Component
{

    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <div className="form-group">
                <label>{this.props.label}</label>
                <textarea className="form-control" rows={this.props.rows} placeholder={this.props.placeholder}></textarea>
            </div>
        );
    }

}

export default Textarea;