import React, { useState, useRef } from 'react'
import { makeStyles } from '@mui/styles';
import { Button, ClickAwayListener, TextField, Typography } from '@mui/material';
import { CommandLine, TextInput, Headline } from './components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#efefef'
  },
  formStyle: {
    maxHeight: 500,
    overflowY: 'auto',
    maxWidth: 600,
    width: '50%',
  }
});

function App() {

  const textRef = useRef(null);

  const [formElement, setFormElement] = useState({ formtitle: '', formElements: [] })
  const [isTitlePresent, setIsTitlePresent] = useState(false)

  const handleElement = (e, field = 'title') => {
    let _formElement = JSON.parse(JSON.stringify(formElement))
    if (e.keyCode === 13) {
      let element = {
        name: 'CommandLine',
        value: ''
      }
      _formElement = {
        ..._formElement,
        formElements: [..._formElement.formElements, element]
      }
      setIsTitlePresent(true)
    } else if (field?.toLowerCase() === 'title') {
      _formElement = {
        ..._formElement,
        formtitle: e.target.value,
      }
    }
    setFormElement(_formElement)
  }

  const handleCommandInput = (command, index) => {
    let _formElement = JSON.parse(JSON.stringify(formElement))
    if (command?.toLowerCase() === '/headline') {
      _formElement.formElements[index] = {
        name: 'Headline',
        value: '',
        isEditable: true
      }
    } else if (command?.toLowerCase() === '/textinput') {
      _formElement.formElements[index] = {
        name: 'TextInput',
        value: ''
      }
    }
    setFormElement(_formElement)
  }

  const elementRender = (value, key, ...args) => {
    let obj = {
      CommandLine: <CommandLine key={key} index={key} handleCommandInput={(...args) => handleCommandInput(...args)} />,
      Headline: <Headline formElement={formElement.formElements[key]} key={key} index={key} setFormElement={setFormElement} handleElement={(...args) => handleElement(...args)} handleInputValue={(...args) => handleInputValue(...args)} />,
      TextInput: <TextInput key={key} formElement={formElement.formElements[key]} index={key} handleElement={(...args) => handleElement(...args)} handleInputValue={(...args) => handleInputValue(...args)} />,
    };
    return obj[value]
  }

  const handleInputValue = (value, index, isString = true) => {
    let _formElement = JSON.parse(JSON.stringify(formElement))
    if (isString) {
      _formElement.formElements[index] = {
        ..._formElement.formElements[index],
        value,
      }
    } else {
      _formElement.formElements[index] = {
        ..._formElement.formElements[index],
        isEditable: true,
      }
    }
    setFormElement(_formElement)
  }

  const autoFocus = () => {
    setIsTitlePresent(false)
    textRef?.current?.focus()
  }

  const exportToJSON = () => {
    let dataType = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(formElement))}`
    let anchorNode = document.createElement('a')
    anchorNode.href = dataType
    anchorNode.download = 'form.json'
    document.body.appendChild(anchorNode)
    anchorNode.click()
    anchorNode.remove()
  }

  const importJSON = (e) => {
    let fileReader = new FileReader()
    fileReader.readAsText(e.target.files[0],'UTF-8')
    fileReader.onload = (e) => {
      setFormElement(JSON.parse(e.target.result))
    }
  }

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div>
        <Button style={{ marginLeft: 10 }} variant='contained' onClick={exportToJSON}>Export JSON</Button>
        <input
          accept="application/JSON"
          className={classes.input}
          onChange={(e) => importJSON(e)}
          style={{ display: 'none' }}
          id="jsonInput"
          type="file"
        />
        <label htmlFor="jsonInput">
          <Button style={{ marginLeft: 10 }} component='span' variant='contained'>
            Import JSON
          </Button>
        </label>
      </div>
      <form className={classes.formStyle} onSubmit={(e) => e.preventDefault()}>
        {isTitlePresent ?
          <ClickAwayListener onClickAway={() => setIsTitlePresent(true)}>
            <Typography onClick={() => autoFocus()} variant='h2' style={{ fontSize: 24 }} tabIndex='1'>{formElement.formtitle}</Typography>
          </ClickAwayListener>
          : <TextField
            fullWidth
            id="form-title"
            label="Form title"
            variant="standard"
            placeholder='Title'
            ref={textRef}
            style={{ marginBottom: 20, fontSize: 20 }}
            value={formElement.formtitle}
            onChange={(e) => handleElement(e)}
            onKeyUp={(e) => handleElement(e)}
          />}
        {
          formElement?.formElements?.length ? formElement?.formElements?.map((element, index) => elementRender([element['name']], index)) : null
        }
        <Button variant='contained' style={{ marginTop: 20 }}>Submit</Button>
      </form>
    </div>
  );
}

export default App;
