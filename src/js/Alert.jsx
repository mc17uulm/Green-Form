import React, {Component} from "react";

class Alert extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            hidden: false
        };

        this.hide = this.hide.bind(this);
        this.render_icon = this.render_icon.bind(this);
    }

    hide(e)
    {
        e.preventDefault();
        this.setState({hidden: true});
    }

    render_icon(type)
    {
        switch(type)
        {
            case "danger": return "ban";
            case "info": return "info";
            case "warning": return "warning";
            default: return "check";
        }
    }

    render()
    {
        return (
            <div>
                {this.state.hide ? (
                    <div className={"alert alert-" + this.props.type + " alert-dismissible"}>
                        <button type="button" className="close" onClick={this.hide}>&times;</button>
                        <h4><i className={"icon fa fa-" + this.render_icon(this.props.type)}></i> {this.props.title}</h4>
                        {this.props.text}
                    </div>
                ): ""}
            </div>
        );
    }

}

export default Alert;