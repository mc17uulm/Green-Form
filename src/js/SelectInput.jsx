import React, {Component} from "react";

class SelectInput extends Component
{

    constructor(props)
    {
        super(props);

        this.change = this.change.bind(this);
    }

    change(e)
    {
        e.preventDefault();
        this.props.update(this.props.id, e.target.value);
    }

    render()
    {
        return (
            <div className="form-group">
                <label>{this.props.label}</label>
                <select className="form-control" onChange={this.change}>
                    {this.props.options.length > 0 ? this.props.options.map(el => (
                        <option key={el}>{el}</option>
                    )) : ("")}
                </select>
            </div>
        );
    }

}

export default SelectInput;