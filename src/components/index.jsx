import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    optionStyle: {
        fontSize: 12,
        backgroundColor: '#fff',
        padding: 5,
        '&:hover': {
            backgroundColor: '#efefef',
            cursor: 'pointer'
        }
    },
});

const options = ['/headline', '/textinput']

export const CommandLine = ({ addCommandElement, index }) => {
    const classes = useStyles();
    const [showState, setShowState] = useState(false)

    /**
     * show command popup on /
     * @param {event} e 
     */
    const handleFieldCommandValue = (e) => {
        if (e.keyCode === 191) {
            setShowState(true)
        } else if (e.keyCode === 8) {
            setShowState(false)
        }
    }
    return <>
        <TextField
            fullWidth
            id="form-title"
            placeholder='Enter /{command}'
            autoComplete='off'
            autoFocus
            InputProps={{ disableUnderline: true }}
            onKeyUp={(e) => handleFieldCommandValue(e)}
            variant="standard"
            style={{ marginTop: 10 }}
        />
        {showState &&
            <div>
                {options.map((value, ind) => <Typography key={ind} onClick={() => addCommandElement(value, index)} className={classes.optionStyle}>{value}</Typography>)}
            </div>
        }
    </>
};

export const Headline = ({ formElement, handleInputValue, index, handleElementInsertion }) => {

    /**
     * remove editable field on enter to display h1
     * @param {event} e 
     */
    const handleTextCommandValue = (e) => {
        if (e.keyCode === 13) {
            delete formElement.isEditable
            handleElementInsertion(e, 'input')
        }
    }

    /**
     * Make h1 field editable
     */
    const makeEditable = () => {
        handleInputValue(formElement, index, false)
    }

    return formElement.isEditable ?
        <TextField
            fullWidth
            id="headline"
            name="headline"
            autoFocus
            placeholder='Place text'
            autoComplete='off'
            onChange={(e) => handleInputValue(e.target.value, index)}
            onKeyUp={(e) => handleTextCommandValue(e)}
            InputProps={{ disableUnderline: true }}
            variant="standard"
            style={{ marginTop: 10, padding: 5 }}
            value={formElement?.value}
        />
        : <Typography
            variant='h1'
            tabIndex={1}
            style={{ fontSize: '20px', marginTop: 10 }}
            onClick={() => makeEditable()}
        >
            {formElement?.value}
        </Typography>
};

export const TextInput = ({ index, handleElementInsertion, handleInputValue, formElement }) => {
    return <TextField
        fullWidth
        name="textinput"
        id="textinput"
        autoFocus
        autoComplete='off'
        onChange={(e) => handleInputValue(e.target.value, index)}
        placeholder='Enter Value'
        onKeyUp={(e) => handleElementInsertion(e, 'input')}
        variant="standard"
        style={{ marginBottom: 20, marginTop: 10 }}
        value={formElement.value}
    />;
};