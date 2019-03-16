import React, {Component} from "react";

class Rows extends Component
{

    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <div className="row">
                {this.props.children}
            </div>
        );
    }

}

export default Rows;