import React, { useState } from 'react';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

export default function TableData_date(props) {
    const [date, setDate] = useState(props.data.date)
    return (
        <div className="table-date">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DateTimePicker
                    variant="inline"
                    value={date}
                    onChange={(e) => {
                        setDate(e); 
                        props.edit_cell(props.data.property_type, e, props.data.id);
                    }}
                    fullWidth={true}
                    InputProps={{
                        disableUnderline: true,
                    }}
                />
            </MuiPickersUtilsProvider> 
        </div>
    )
}
