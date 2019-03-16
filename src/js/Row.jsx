import React, {Component} from "react";

class Row extends Component
{

    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <div className={"col-md-" + this.props.size}>
                {this.props.children}
            </div>
        );
    }

}

export default Row;