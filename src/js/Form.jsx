import React, {Component} from "react";
import Input from "./Input.jsx";
import Rows from "./Rows.jsx";
import Row from "./Row.jsx";
import SelectInput from "./SelectInput.jsx";
import SelectGroup from "./SelectGroup.jsx";
import DateSelect from "./DateSelect.jsx";
import Textarea from "./Textarea.jsx";
import Alert from "./Alert.jsx";
import Modal from "./form/modal/Modal.jsx";
import APIHandler from "./Tasks/APIHandler.js";
import ReCAPTCHA from "react-google-recaptcha";

class Form extends Component
{

    constructor(props)
    {
        super(props);

        const obj = {value: "", error: false, errorText: ""}

        this.state = {
            state: "none",
            firstname: obj,
            lastname: obj,
            job: obj,
            date_of_birth: obj,
            family: "ledig",
            statement: obj,
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
            character: 100,
            captcha: {
                value: false,
                error: false,
                errorText: ""
            },
            modal: {
                hidden: true,
                title: "",
                content: null
            },
            children: 0,
            grandkids: 0,
            num: [],
            obj: obj
        }

        this.submitForm = this.submitForm.bind(this);
        this.update = this.update.bind(this);
        this.update_organization = this.update_organization.bind(this);
        this.update_district = this.update_district.bind(this);
        this.update_select = this.update_select.bind(this);
        this.update_small = this.update_small.bind(this);
        this.reset = this.reset.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
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
        if(!this.state.captcha.value) {this.setState({captcha: { value: false, error: true, errorText: "Bitte löse das Captcha!"}}); err=true;}
        
        if(Object.entries(this.state.gremium.value).every((el) => {
            return !el[1];
        })){
            this.setState({gremium: {value: this.state.gremium.value, error: true, errorText: "Bitte gib ein Gremium an!"}});
            err=true;
        }

        if(err) return;

        this.showModal("Daten überprüfen", {
            firstname: this.state.firstname.value,
            lastname: this.state.lastname.value,
            date_of_birth: this.state.date_of_birth.value,
            organization: this.state.organization.name,
            district: this.state.district,
            gremium: this.state.gremium.value,
            family: this.state.family,
            job: this.state.job.value,
            statement: this.state.statement.value,
            children: this.state.children,
            grandkids: this.state.grandkids
        });
    }

    async handleResponse(content){
        let resp = await APIHandler.post('add', content);
        this.setState({
            state: resp["type"]
        });
    }

    async componentDidMount()
    {
        let num = [];
        for(let i = 0; i <= 15; i++) {
            num.push(i);
        }
        let res = await APIHandler.get("init");
        let organizations = res["msg"];
        let organization = res["msg"][0];
        let districts = organization.districts;
        let district = organization.districts[0].name;
        let character = organization.districts[0].characters;
        this.setState({
            num: num,
            organizations: organizations, 
            organization: organization,
            districts: districts,
            district: district,
            character: character
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

    update_small(id, value)
    {
        this.setState({
            [id]: value
        });
    }

    update_organization(id, value)
    {
        let organization = this.state.organizations.filter(el => el.name === value)[0];
        let districts = organization.districts;
        let district = organization.districts[0].name;
        let character = organization.districts[0].characters;
        let s = this.state.statement;
        s.value = s.value.substring(0, character);
        this.setState({
            organization: organization,
            districts: districts,
            district: district,
            character: character,
            statement: s
        });
    }

    update_district(id, value)
    {
        let character = this.state.districts.find(el => el.name === value).characters;
        let s = this.state.statement;
        s.value = s.value.substring(0, character);
        this.setState({district: value, character: character, statement: s});
    }

    update_select(id, value)
    {
        let o = this.state.gremium;
        o.value[id] = value;
        this.setState({
            gremium: o
        });
    }

    async reset()
    {
        await this.setState({
            firstname: {value: this.state.firstname.value, error: false, errorText: ""},
            lastname: {value: this.state.lastname.value, error: false, errorText: ""},
            date_of_birth: {value: this.state.date_of_birth.value, error: false, errorText: ""},
            job: {value: this.state.job.value, error: false, errorText: ""},
            statement: {value: this.state.statement.value, error: false, errorText: ""},
            captcha: { value: this.state.captcha.value, error: false, errorText: ""}
        });
        await this.setState({
            gremium: {value: this.state.gremium.value, error: false, errorText: ""}
        });
    
    }

    showModal(title, content){
        this.setState({
            modal: {
                hidden: false,
                title: title,
                content: content
            }
        });
    }

    hideModal() {
        this.setState({
            modal: {
                hidden: true,
                title: "",
                content: null
            }
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
                            <Input id="firstname" label="Vorname" type="text" maxLength={25} placeholder="Vorname" attr={this.state.firstname} update={this.update} reset={this.reset}/>
                        </Row>
                        <Row size="4">
                            <Input id="lastname" label="Nachname" type="text" maxLength={25} placeholder="Nachname" attr={this.state.lastname} update={this.update} reset={this.reset}/>
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
                            <SelectInput id="district" label="Gemeinde" options={this.state.districts.length > 0 ? this.state.districts.map(el => el.name) : []} update={this.update_district} />
                        </Row>
                    </Rows>
                    <SelectGroup label="Gremium" id="gremium" attr={this.state.gremium} update={this.update_select} reset={this.reset}/>
                    <Rows>
                        <Row size="6">
                            <SelectInput id="family" label="Familienstand" options={["ledig", "geschieden", "verheiratet"]} update={this.update_small} />
                        </Row>
                        <Row size="6">
                            <Input id="job" label="Beruf" type="text" maxLength={50} placeholder="Beruf" attr={this.state.job} update={this.update} reset={this.reset} />
                        </Row>
                    </Rows>
                    <Rows>
                        <Row size="6">
                            <SelectInput id="children" label="Kinder" options={this.state.num} update={this.update_small}/>
                        </Row>
                        <Row size="6">
                            <SelectInput id="grandkids" label="Enkelkinder" options={this.state.num} update={this.update_small}/>
                        </Row>
                    </Rows>
                    <Textarea maxLength={this.state.character} label="Persönlicher Text" placeholder="..." text={this.state.statement} rows="3" id="statement" update={this.update} reset={this.reset}/>
                    <Rows>
                        <Row size="8">
                            <div className={"form-group" + (this.state.captcha.error ? " has-error" : "")}>
                                <ReCAPTCHA onChange={() => this.update("captcha", true)} sitekey="6LfJ75kUAAAAACFoY56NyooAjIZrreZU6YfIEDuv"/>
                            </div>
                            {this.state.captcha.error ? (
                                <span className="help-block"><small>{this.state.captcha.errorText}</small></span>
                            ) : ""}
                        </Row>
                        <Row size="4">
                            <button type="button" onClick={this.submitForm} className="btn btn-info pull-right"><i className="fa fa-paper-plane"></i> Abschicken</button>
                        </Row>
                    </Rows>
                    <Modal hidden={this.state.modal.hidden} title={this.state.modal.title} content={this.state.modal.content} close={this.hideModal} save={(c) => {this.hideModal(); this.handleResponse(c);}} btn_text="Abschicken" />
                    {this.state.modal.hidden ? "" : (
                        <div className="modal-backdrop fade show"></div>
                    )}
                </form>
            );
            
        };
    }

}

export default Form;