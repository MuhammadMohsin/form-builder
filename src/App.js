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
  },
  formStyle: {
    maxHeight: 500,
    overflowY: 'auto',
    maxWidth: 600,
    width: '50%',
    padding: 5,
    '& > div': {
      padding: 5
    }
  }
});

function App() {
  // Refs
  const formRef = useRef(null);

  // States
  const [formElement, setFormElement] = useState({ formtitle: '', formElements: [{ name: 'CommandLine', value: '' }] }) // Maintains the JSON object
  const [isTitlePresent, setIsTitlePresent] = useState(false)

  /**
   *  Add element on enter key and set title field
   * @param {event} e 
   * @param {string} field 
   */
  const handleElementInsertion = (e, field = 'title') => {
    let _formElement = JSON.parse(JSON.stringify(formElement))
    if (e.keyCode === 13) { // Insert command line on enter
      let element = { name: 'CommandLine', value: '' }
      _formElement = { ..._formElement, formElements: [..._formElement.formElements, element] }
      setIsTitlePresent(true)
    } else if (field?.toLowerCase() === 'title') {
      _formElement = { ..._formElement, formtitle: e.target.value }
    }
    setFormElement(_formElement)
  }

  /**
   *  Add the appropriate element based on the command
   * @param {string} command 
   * @param {Int} index 
   */
  const addCommandElement = (command, index) => {
    let _formElement = JSON.parse(JSON.stringify(formElement))
    if (command?.toLowerCase() === '/headline') {
      _formElement.formElements[index] = { name: 'Headline', value: '', isEditable: true } // isEditable for rendering headline as editable
    } else if (command?.toLowerCase() === '/textinput') {
      _formElement.formElements[index] = { name: 'TextInput', value: '' }
    }
    setFormElement(_formElement)
  }

  /**
   * set the index of dragged element
   * @param {event} e 
   * @param {Int} index 
   */
  const onDragStart = (e, index) => {
    formRef.current.classList.add('dragStart');
    e.dataTransfer.setData("index", index);
  }

  /**
   * get the index of dropped element and swap the two elements
   * @param {event} e 
   * @param {Int} dropIndex 
   */
  const onDrop = (e, dropIndex) => {
    formRef.current.classList.remove('dragStart');
    let _formElement = JSON.parse(JSON.stringify(formElement))
    let dragIndex = e.dataTransfer.getData("index");
    let DraggedValue = _formElement.formElements.splice(dragIndex, 1)
    _formElement.formElements.splice(dropIndex, 0, DraggedValue.pop())
    setFormElement(_formElement)
  }
  /**
   * Renders appropriate html element based on command
   * @param {string} value 
   * @param {Int} key 
   * @returns ReactElement
   */
  const RenderElement = (value, key) => {
    let obj = {
      CommandLine:
        <CommandLine
          key={key}
          index={key}
          addCommandElement={(...args) => addCommandElement(...args)}
          onDragStart={(...args) => onDragStart(...args)}
          onDrop={(...args) => onDrop(...args)}
        />,
      Headline:
        <Headline
          formElement={formElement.formElements[key]}
          key={key}
          index={key}
          setFormElement={setFormElement}
          handleElementInsertion={(...args) => handleElementInsertion(...args)}
          handleInputValue={(...args) => handleInputValue(...args)}
          onDragStart={(...args) => onDragStart(...args)}
          onDrop={(...args) => onDrop(...args)}
        />,
      TextInput:
        <TextInput
          key={key}
          formElement={formElement.formElements[key]}
          index={key}
          handleElementInsertion={(...args) => handleElementInsertion(...args)}
          handleInputValue={(...args) => handleInputValue(...args)}
          onDragStart={(...args) => onDragStart(...args)}
          onDrop={(...args) => onDrop(...args)}
        />,
    };
    return obj[value]
  }

  /**
   * handle onchange for text input
   * @param {string | object} value 
   * @param {Int} index 
   * @param {bool} isString 
   */
  const handleInputValue = (value, index, isString = true) => {
    let _formElement = JSON.parse(JSON.stringify(formElement))
    if (isString) {
      _formElement.formElements[index] = { ..._formElement.formElements[index], value }
    } else {
      _formElement.formElements[index] = { ..._formElement.formElements[index], isEditable: true }
    }
    setFormElement(_formElement)
  }

  /**
   * autofocus to form title on click
   */
  const autoFocus = () => {
    setIsTitlePresent(false)
  }

  /**
   * Export file to JSON
   */
  const exportToJSON = () => {
    let dataType = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(formElement))}`
    let anchorNode = document.createElement('a')
    anchorNode.href = dataType
    anchorNode.download = 'form.json'
    document.body.appendChild(anchorNode)
    anchorNode.click()
    anchorNode.remove()
  }

  /**
 * Import file to JSON
 */
  const importJSON = (e) => {
    let fileReader = new FileReader()
    fileReader.readAsText(e.target.files[0], 'UTF-8')
    fileReader.onload = (e) => { setFormElement(JSON.parse(e.target.result)) }
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
          <Button style={{ marginLeft: 10 }} component='span' variant='contained'>Import JSON</Button>
        </label>
      </div>
      <form className={classes.formStyle}
        onSubmit={(e) => e.preventDefault()}
        ref={formRef}>
        {isTitlePresent ?
          <ClickAwayListener onClickAway={() => setIsTitlePresent(true)}>
            <Typography onClick={() => autoFocus()} variant='h2' style={{ fontSize: 24, fontWeight: 700 }} tabIndex='1'>{formElement.formtitle}</Typography>
          </ClickAwayListener>
          : <TextField
            fullWidth
            id="form-title"
            autoFocus
            variant="standard"
            placeholder='Enter a nice name!'
            InputProps={{ disableUnderline: true, style: { fontSize: 24, fontWeight: 700 } }}
            style={{ marginBottom: 20, }}
            value={formElement.formtitle}
            onChange={(e) => handleElementInsertion(e)}
          />}
        {formElement?.formElements?.length ? formElement?.formElements?.map((element, index) => RenderElement([element['name']], index)) : null}
        <Button variant='contained' style={{ marginTop: 20 }}>Submit</Button>
      </form>
    </div>
  );
}

export default App;