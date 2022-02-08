import React from 'react';
import { TextField, Typography, Autocomplete } from '@mui/material';

const options = ['/headline','/textinput']

export const CommandLine = ({handleCommandInput,index,handleElement}) => {
    return <Autocomplete
        disablePortal
        id="combo-box-demo"
        fullWidth
        style={{marginBottom:20}}
        onChange={(_, newValue) => handleCommandInput(newValue,index)}
        options={options}
        renderInput={(params) => <TextField {...params} label="/Command" />}
    />
};

export const Headline = ({formElement,handleInputValue,index}) => {
    return <Typography contentEditable={true} onInput={(e) => handleInputValue(e.target.innerText,index)} variant='h1'>{formElement?.value}</Typography>
};

export const TextInput = ({index,handleElement,handleInputValue,formElement}) => {
    return <TextField
        fullWidth
        id="form-title"
        label={formElement.value}
        onChange={(e) => handleInputValue(e.target.value,index)}
        placeholder='Value'
        onKeyUp={(e) => handleElement(e,'input')}
        variant="standard"
        style={{ marginBottom: 20 }}
        value={formElement.value}
    />;
};