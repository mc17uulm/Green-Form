import React, {Component} from "react";
import Input from "./Input.jsx";
import Rows from "./Rows.jsx";
import Row from "./Row.jsx";
import SelectInput from "./SelectInput.jsx";
import SelectGroup from "./SelectGroup.jsx";
import DateSelect from "./DateSelect.jsx";
import Textarea from "./Textarea.jsx";
import Alert from "./Alert.jsx";

import ReCAPTCHA from "react-google-recaptcha";

import APIHandler from "./Tasks/APIHandler.js";

class Form extends Component
{

    constructor(props)
    {
        super(props);

        this.state = {
            state: "none",
            firstname: {
                value: "",
                error: false,
                errorText: ""
            },
            lastname: {
                value: "",
                error: false,
                errorText: ""
            },
            job: {
                value: "",
                error: false,
                errorText: ""
            },
            date_of_birth: {
                value: "",
                error: false,
                errorText: ""
            },
            family: "ledig",
            statement: {
                value: "",
                error: false,
                errorText: ""
            },
            gremium: {
                value: {
                    kt: false,
                    gr: false,
                    or: false
                },
                error: false,
                errorText: ""
            },
            organizations: [],
            organization: [],
            districts: [],
            district: [],
            captcha: {
                success: false,
                error: false,
                errorText: ""
            }
        }

        this.submitForm = this.submitForm.bind(this);
        this.update = this.update.bind(this);
        this.update_organization = this.update_organization.bind(this);
        this.update_select = this.update_select.bind(this);
        this.update_family = this.update_family.bind(this);
        this.update_captcha = this.update_captcha.bind(this);
        this.reset = this.reset.bind(this);
    }

    async submitForm(e)
    {
        e.preventDefault();
        let err = false;
        if(this.state.firstname.value == "") { this.setState({firstname: {value: "", error: true, errorText: "Bitte gib deinen Vornamen mit an!"}}); err=true;}
        if(this.state.lastname.value == "") { this.setState({lastname: {value: "", error: true, errorText: "Bitte gib deinen Nachnamen mit an!"}}); err=true;}
        if(this.state.date_of_birth.value == "") { this.setState({date_of_birth: {value: "", error: true, errorText: "Bitte gib deinen Geburtstag mit an!"}}); err=true;}
        if(this.state.job.value == "") { this.setState({job: {value: "", error: true, errorText: "Bitte gib deinen Beruf mit an!"}}); err=true;}
        if(this.state.statement.value == "") { this.setState({statement: {value: "", error: true, errorText: "Bitte gib einen persönlichen Text von dir mit an!"}}); err=true;}
        //if(!this.state.captcha.success) {this.setState({captcha: { success: false, error: true, errorText: "Bitte löse das Captcha!"}}); err=true;}
        
        if(Object.entries(this.state.gremium.value).every((el) => {
            return !el[1];
        })){
            this.setState({gremium: {value: this.state.gremium.value, error: true, errorText: "Bitte gib ein Gremium an!"}});
            err=true;
        }

        if(err) return;

        let resp = await APIHandler.post('add', {
            firstname: this.state.firstname.value,
            lastname: this.state.lastname.value,
            date_of_birth: this.state.date_of_birth.value,
            organization: this.state.organization.name,
            district: this.state.district.name,
            gremium: this.state.gremium.value,
            family: this.state.family,
            job: this.state.job.value,
            statement: this.state.statement.value
        });

        this.setState({
            state: resp["type"]
        });
    }

    async componentDidMount()
    {
        let res = await APIHandler.get("init");
        let organizations = res["msg"];
        let organization = res["msg"][0];
        let districts = organization.districts;
        let district = organization.districts[0];
        this.setState({
            organizations: organizations, 
            organization: organization,
            districts: districts,
            district: district
        });
    }

    update(id, value)
    {
        this.setState({
            [id]: {
                value: value,
                error: false,
                errorText: ""
            }
        });
    }

    update_family(id, value)
    {
        this.setState({family: value});
    }

    update_organization(id, value)
    {
        let organization = this.state.organizations.filter(el => el.name === value)[0];
        let districts = organization.districts;
        let district = organization.districts[0];
        this.setState({
            organization: organization,
            districts: districts,
            district: district
        });
    }

    update_select(id, value)
    {
        let o = this.state.gremium;
        o.value[id] = value;
        this.setState({
            gremium: o
        });
    }

    update_captcha()
    {
        this.setState({
            captcha: {
                success: true,
                error: false,
                errorText: ""
            }
        });
    }

    async reset()
    {
        await this.setState({
            firstname: {value: this.state.firstname.value, error: false, errorText: ""},
            lastname: {value: this.state.lastname.value, error: false, errorText: ""},
            date_of_birth: {value: this.state.date_of_birth.value, error: false, errorText: ""},
            job: {value: this.state.job.value, error: false, errorText: ""},
            statement: {value: this.state.statement.value, error: false, errorText: ""}
        });
        await this.setState({
            gremium: {value: this.state.gremium.value, error: false, errorText: ""}
        });
    
    }

    render()
    {
        switch(this.state.state){
            case "success": return (
                <Alert type="success" title="Danke!" text="Deine Informationen sind bei uns angekommen. Vielen Dank!" />
            );
    
            case "error": return (
                <Alert type="danger" title="Fehler!" text="Leider gab es bei der Übermittlung deiner Daten ein Problem. Wende dich bitte an den Administrator!"/>
            );
            default: return (
                <form>
                    <Rows>
                        <Row size="4">
                            <Input id="firstname" label="Vorname" type="text" placeholder="Vorname" attr={this.state.firstname} update={this.update} reset={this.reset}/>
                        </Row>
                        <Row size="4">
                            <Input id="lastname" label="Nachname" type="text" placeholder="Nachname" attr={this.state.lastname} update={this.update} reset={this.reset}/>
                        </Row>
                        <Row size="4">
                            <DateSelect id="date_of_birth" label="Geburtsdatum" attr={this.state.date_of_birth} update={this.update} reset={this.reset} />
                        </Row>
                    </Rows>
                    <Rows>
                        <Row size="6">
                            <SelectInput id="organization" label="Kreisverband" options={this.state.organizations.length > 0 ? this.state.organizations.map(el => el.name): []} update={this.update_organization} />
                        </Row>
                        <Row size="6">
                            <SelectInput id="distric" label="Gemeinde" options={this.state.districts.length > 0 ? this.state.districts.map(el => el.name) : []} update={this.update} />
                        </Row>
                    </Rows>
                    <SelectGroup label="Gremium" id="gremium" attr={this.state.gremium} update={this.update_select} reset={this.reset}/>
                    <Rows>
                        <Row size="6">
                            <SelectInput id="family" label="Familienstand" options={["ledig", "geschieden", "verheiratet"]} update={this.update_family} />
                        </Row>
                        <Row size="6">
                            <Input id="job" label="Beruf" type="text" placeholder="Beruf" attr={this.state.job} update={this.update} reset={this.reset} />
                        </Row>
                    </Rows>
                    <Textarea maxLength="300" label="Persönlicher Text" placeholder="..." attr={this.state.statement} rows="3" id="statement" update={this.update} reset={this.reset}/>
                    <Rows>
                        <Row size="8">
                            <div className={"form-group" + (this.state.captcha.error ? " has-error" : "")}>
                                <ReCAPTCHA onChange={this.update_captcha} sitekey="6LeRHJgUAAAAAP5EgLikcgKLZrEyIpTMBJYra7Xx"/>
                            </div>
                            {this.state.captcha.error ? (
                                <span className="help-block"><small>{this.state.captcha.errorText}</small></span>
                            ) : ""}
                        </Row>
                        <Row size="4">
                            <button type="button" onClick={this.submitForm} className="btn btn-info pull-right"><i className="fa fa-paper-plane"></i> Abschicken</button>
                        </Row>
                    </Rows>
                </form>
            );
            
        };
    }

}

export default Form;