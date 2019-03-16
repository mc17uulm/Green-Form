import React, {Component} from "react";
import Input from "./Input.jsx";
import Rows from "./Rows.jsx";
import Row from "./Row.jsx";
import SelectInput from "./SelectInput.jsx";
import SelectGroup from "./SelectGroup.jsx";
import DateSelect from "./DateSelect.jsx";
import Textarea from "./Textarea.jsx";

import APIHandler from "./Tasks/APIHandler.js";

class Form extends Component
{

    constructor(props)
    {
        super(props);

        this.state = {
            firstname: "",
            lastname: "",
            beruf: "",
            organizations: [],
            organization: [],
            districts: [],
            district: [],
            options: []
        }

        this.submitForm = this.submitForm.bind(this);
        this.update = this.update.bind(this);
        this.update_organization = this.update_organization.bind(this);
        this.update_district = this.update_district.bind(this);
    }

    submitForm(e)
    {
        e.preventDefault();
    }

    async componentDidMount()
    {
        let res = await APIHandler.get("init");
        let organizations = res["msg"];
        let organization = res["msg"][0];
        let districts = organization.districts;
        let district = organization.districts[0];
        let options = district.options;
        this.setState({
            organizations: organizations, 
            organization: organization,
            districts: districts,
            district: district,
            options: options
        });
    }

    update(id, value)
    {
        this.setState({
            [id]: value
        });
    }

    update_organization(id, value)
    {
        let organization = this.state.organizations.filter(el => el.name === value)[0];
        let districts = organization.districts;
        let district = organization.districts[0];
        let options = district.options;
        this.setState({
            organization: organization,
            districts: districts,
            district: district,
            options: options
        });
    }

    update_district(id, value)
    {
        let district = this.state.districts.filter(el => el.name === value)[0];
        let options = district.options;
        this.setState({
            district: district,
            options: options
        });
    }

    render()
    {
        return (
            <form onSubmit={this.sumitForm}>
                <Rows>
                    <Row size="6">
                        <Input id="firstname" label="Vorname" type="text" placeholder="Vorname" value={this.state.firstname} update={this.update}/>
                    </Row>
                    <Row size="6">
                    <Input id="lastname" label="Nachname" type="text" placeholder="Nachname" value={this.state.lastname} update={this.update}/>
                    </Row>
                </Rows>
                <SelectInput id="organization" label="Kreisverband" options={this.state.organizations.length > 0 ? this.state.organizations.map(el => el.name): []} update={this.update_org} />
                <SelectInput id="distric" label="Gemeinde" options={this.state.districts.length > 0 ? this.state.districts.map(el => el.name) : []} update={this.update} />
                <SelectGroup label="Gremium" options={this.state.options}/>
                <DateSelect label="Geburtsdatum" />
                <Input id="beruf" label="Beruf" type="text" placeholder="Beruf" value={this.state.beruf} update={this.update} />
                <Textarea label="Persönlicher Text" placeholder="..." rows="3" />
                <Rows>
                    <button type="button" class="btn btn-info pull-right"><i className="fa fa-paper-plane"></i> Abschicken</button>
                </Rows>
            </form>
        );
    }

}

export default Form;