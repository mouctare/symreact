import React from 'react'


const Select = ({name, value, error, label, onChange, children}) => {
    return (
    <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <select name={name} id={name}className="form-form-control">
        <option value="1">sss</option>
        <option value="2">perrr</option>
    </select>
    <p className="invalid-feedback">erreur</p>
</div>
);
};


export default Select;