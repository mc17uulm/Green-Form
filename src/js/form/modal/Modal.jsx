import React , {Component} from "react";
import ContentTable from './ContentTable.jsx';

class Modal extends Component
{

    constructor(props)
    {
        super(props);

        this.state = {
            hidden: true
        };
    }

    render()
    {
        return (
            <div className={"modal fade" + (this.props.hidden ? "" : " show")} tabIndex="-1" style={{display: this.props.hidden ? "none" : "block"}} role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                        {this.props.hidden ? "" : (
                            <ContentTable obj={this.props.content} />
                        )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default pull-left" data-dismiss="modal" onClick={this.props.close}>Zurück</button>
                            <button type="button" className="btn btn-primary" onClick={() => this.props.save(this.props.content)}>Abschicken</button>
                        </div>
                    </div>
                </div>
          </div>
        );
    }

}

export default Modal;