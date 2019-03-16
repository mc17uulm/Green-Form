import React, {Component} from "react";

class Input extends Component
{

    constructor(props)
    {
        super(props);

        this.state = {
            value: this.props.value
        }

        this.change = this.change.bind(this);
    }

    change(e)
    {
        e.preventDefault();

        this.setState({value: e.target.value});
        this.props.update(this.props.id, e.target.value);

    }

    render()
    {
        return (
            <div className="form-group">
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <input type={this.props.type} className="form-control" id={this.props.id} placeholder={this.props.placeholder} value={this.props.value} onChange={this.change} />
            </div>
        );
    }

}

export default Input;