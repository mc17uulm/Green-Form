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
                        <a href="#"><img height="100px" src="public/img/logo.png" alt="logo" /></a>
                    </div>
                    <div className="login-box-body">
                        <p className="login-box-msg">Hier ist noch Platz für einen informativen Text</p>
                        <Form />
                    </div>
                </div>
                <div class="text-center hidden-xs" style={{color: "white"}}>
                    <small><b>Made with ❤️ by mc17uulm | Sourcecode at <a href="https://github.com/mc17uulm/Green-Form">GitHub</a></b></small>
                </div>
            </div>
        );
    }

}

export default App;

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : false;