import React, {Component} from "react";

class Checkbox extends Component
{

    constructor(props)
    {
        super(props);

        this.state = {
            checked: false
        }
        this.change = this.change.bind(this);
    }

    change(e)
    {
        e.preventDefault();
        this.setState(s => ({
            checked: !s.checked
        }));
        console.log(this.state.checked);
    }

    render()
    {
        return (
            <div className="checkbox">
                <label>
                    <input name={this.props.name} type="checkbox" disabled={this.props.disabled} defaultChecked={this.state.checked} onChange={() => {this.change}}/>
                    {" " + this.props.name}
                </label>
           </div>
        );
    }

}

export default Checkbox;