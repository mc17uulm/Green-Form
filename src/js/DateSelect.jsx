import React, {Component} from "react";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/de';

class DateSelect extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            date: new Date()
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e)
    {
        e.preventDefault();
    }

    render()
    {
        return (
            <div className="form-group">
                <label>{this.props.label}</label>
                <DayPickerInput dayPickerProps={{
                    month: new Date(),
                    showWeekNumbers: true,
                    todayButton: 'Heute',
                    locale: 'de',
                    localeUtils: MomentLocaleUtils
                }} />
            </div>
        );
    }

}

export default DateSelect;