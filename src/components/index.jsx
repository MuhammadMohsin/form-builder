import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

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
    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

const options = ['/headline', '/textinput']

export const CommandLine = ({ addCommandElement, index, onDragStart, onDrop }) => {
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

export const Headline = ({ formElement, handleInputValue, index, handleElementInsertion, onDragStart, onDrop }) => {
    const classes = useStyles();

    /**
     * remove editable field on enter to display h1
     * @param {event} e 
     */
    const handleTextCommandValue = (e) => {
        // Stop user to add empty heading
        if (!e.target.value) return;
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
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDrop={(e) => onDrop(e, index)}
            onDragOver={(e) => e.preventDefault()}
            placeholder='Enter text'
            autoComplete='off'
            onChange={(e) => handleInputValue(e.target.value, index)}
            onKeyUp={(e) => handleTextCommandValue(e)}
            InputProps={{ disableUnderline: true, style: { fontSize: 16, fontWeight: 700 } }}
            variant="standard"
            style={{ marginTop: 10, padding: 5, }}
            value={formElement?.value}
        />
        : <div draggable className={classes.iconContainer} onDragStart={(e) => onDragStart(e, index)} onDrop={(e) => onDrop(e, index)} onDragOver={(e) => e.preventDefault()}>
            <Typography
                variant='h1'
                style={{ fontSize: 16, marginTop: 10, fontWeight: 700 }}
                onClick={() => makeEditable()}
            >
                {formElement?.value}
            </Typography>
            <DragIndicatorIcon style={{ cursor: 'move' }} />
        </div>
};

export const TextInput = ({ index, handleElementInsertion, handleInputValue, formElement, onDragStart, onDrop }) => {
    return <TextField
        fullWidth
        name="textinput"
        id="textinput"
        draggable
        autoFocus
        onDragStart={(e) => onDragStart(e, index)}
        onDrop={(e) => onDrop(e, index)}
        onDragOver={(e) => e.preventDefault()}
        autoComplete='off'
        onChange={(e) => handleInputValue(e.target.value, index)}
        placeholder='Enter Value'
        onKeyUp={(e) => handleElementInsertion(e, 'input')}
        InputProps={{ endAdornment: <DragIndicatorIcon style={{ cursor: 'move' }} /> }}
        variant="standard"
        style={{ marginBottom: 20, marginTop: 10 }}
        value={formElement.value}
    />;
};