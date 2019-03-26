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
                        <p className="login-box-msg">Bitte gib unten alle Informationen für unseren Kommunalwahlflyer ein. Überprüfe vor dem Absenden bitte noch einmal alle Daten!<br />Danke!</p>
                        <Form />
                    </div>
                </div>
                <div class="text-center hidden-xs" style={{color: "white"}}>
                    <small><b>Made with ❤️ by mc17uulm | Sourcecode at <a href="https://github.com/mc17uulm/Green-Form" target="_blank">GitHub</a></b></small>
                </div>
            </div>
        );
    }

}

export default App;

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : false;