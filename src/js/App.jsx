import "@babel/polyfill";
import React, {Component} from "react";
import ReactDOM from "react-dom";
import Form from "./Form.jsx";

class App extends Component
{

    constructor(props)
    {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="login-box">
                    <div className="login-logo">
                        <a href="#"><b>Green</b>Form</a>
                    </div>
                    <div className="login-box-body">
                        <p className="login-box-msg">Infotext</p>
                        <Form />
                    </div>
                </div>
            </div>
        );
    }

}

export default App;

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : false;