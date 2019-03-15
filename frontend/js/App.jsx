import "@babel/polyfill";
import React, {Component} from "react";
import ReactDOM from "react-dom";

class App extends Component
{

    constructor(props)
    {
        super(props);
    }

    render() {
        return (
            <p>
                Running
            </p>
        );
    }

}

export default App;

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : false;