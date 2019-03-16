import React, {Component} from "react";

class Checkbox extends Component
{

    constructor(props)
    {
        super(props);
        this.change = this.change.bind(this);
    }

    change(e)
    {
        this.props.update(this.props.id, e.target.checked);
    }

    render()
    {
        return (
            <div className="checkbox">
                <label>
                    <input type="checkbox" onChange={this.change} />
                    {" " + this.props.name}
                </label>
           </div>
        );
    }

}

export default Checkbox;