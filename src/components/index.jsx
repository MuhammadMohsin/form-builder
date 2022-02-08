import React, { useState } from 'react';
import { TextField, Typography, Autocomplete } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    optionStyle: {
        fontSize: 12,
        backgroundColor: '#fff',
        padding: 5,
        '&:hover': {
            backgroundColor: '#a8a6a600',
            cursor: 'pointer'
        }
    },
});

const options = ['/headline', '/textinput']

export const CommandLine = ({ handleCommandInput, index, handleElement }) => {
    const classes = useStyles();
    const [showState, setShowState] = useState(false)

    const handleFieldCommand = (e) => {
        console.log(e.keyCode)
        if (e.keyCode === 191) {
            setShowState(true)
        }
    }
    return <>
        <TextField
            fullWidth
            id="form-title"
            label={'Enter /{command}'}
            placeholder='Enter /{command}'
            onKeyUp={(e) => handleFieldCommand(e)}
            variant="standard"
            style={{ marginTop: 10 }}
        />
        {showState && <div>{options.map((value, ind) => <Typography key={ind} onClick={() => handleCommandInput(value, index)} className={classes.optionStyle}>{value}</Typography>)}</div>}
    </>
};

export const Headline = ({ formElement, handleInputValue, index, handleElement }) => {
    const classes = useStyles();

    const handleTextCommand = (e) => {
        if (e.keyCode === 13) {
            delete formElement.isEditable
            handleElement(e, 'input')
        }
    }

    const makeEditable = () => {
        handleInputValue(formElement, index, false)
    }

    return formElement.isEditable ?
        <TextField
            fullWidth
            id="form-title"
            placeholder='Place text'
            onChange={(e) => handleInputValue(e.target.value, index)}
            onKeyUp={(e) => handleTextCommand(e)}
            InputProps={{ disableUnderline: true }}
            variant="standard"
            style={{ marginTop: 10, border: '1px solid #000', padding: 5,borderRadius:'0.3rem' }}
            value={formElement?.value}
        />
        : <Typography
            style={{ fontSize: '20px', marginTop: 10 }}
            variant='h1'
            tabIndex={1}
            onClick={() => makeEditable()}
        >
            {formElement?.value}
        </Typography>
};

export const TextInput = ({ index, handleElement, handleInputValue, formElement }) => {
    return <TextField
        fullWidth
        id="form-title"
        onChange={(e) => handleInputValue(e.target.value, index)}
        placeholder='Value'
        onKeyUp={(e) => handleElement(e, 'input')}
        variant="standard"
        style={{ marginBottom: 20, marginTop: 10 }}
        value={formElement.value}
    />;
};