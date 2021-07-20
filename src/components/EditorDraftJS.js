import { useContext, useEffect, useRef, useState } from "react";
import Context from "../Context";
import styled from "styled-components";
import {
  EditorState,
  RichUtils,
  Modifier,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

import Editor from "draft-js-plugins-editor";

const Title = styled.input`
  width: 100vw;
  height: 60px;
  overflow: hidden;
  color: #fff;
  outline: none;
  padding: 20px;
  padding-bottom: 0;
  font-size: 20px;
  background-color: transparent;
  border: none;
`;

const Container = styled.div`
  width: 100vw;
  height: calc(100vh - 60px);
  overflow: hidden;
  resize: none;
  color: #fff;
  outline: none;
  overflow-y: scroll;
  font-size: 15px;
  background-color: transparent;
  border: none;
  padding: 20px;
`;

function MyEditor() {
  let { state, dispatch } = useContext(Context);

  let [editorState, setEditorState] = useState(getState());

  let note = state.notes[state.selectedNote];

  useEffect(() => {
    setEditorState(getState());
  }, [state.selectedNote]);

  function getState() {
    let note = state.notes[state.selectedNote];
    if (note.data) {
      return EditorState.createWithContent(convertFromRaw(note.data));
    } else {
      return EditorState.createEmpty();
    }
  }

  function changeName(e) {
    let newState = { ...state };
    newState.notes[state.selectedNote].name = e.target.value;
    dispatch({ type: "NEW_STATE", value: newState });
  }

  function saveState(editorState) {
    const contentState = editorState.getCurrentContent();
    let data = convertToRaw(contentState);

    let newState = { ...state };

    newState.notes[state.selectedNote].data = data;

    dispatch({ type: "NEW_STATE", value: newState });
  }

  function onChange(editorState) {
    setEditorState(editorState);
    saveState(editorState);
  }

  const keyDown = (e) => {
    if (e.key === "Tab") {
      // Preventing default behavior to keep cursor in the editor
      e.preventDefault();

      // Defining number of spaces to apply after tab press
      let tabIndent = "    ";

      // Getting current state
      let currentState = editorState;

      // Getting variables to know text selection
      let selectionState = editorState.getSelection();
      let anchorKey = selectionState.getAnchorKey();
      let currentContent = editorState.getCurrentContent();
      let currentContentBlock = currentContent.getBlockForKey(anchorKey);
      let start = selectionState.getStartOffset();
      let end = selectionState.getEndOffset();
      let selectedText = currentContentBlock.getText().slice(start, end);

      // Defining next state
      let nextState = Modifier.replaceText(
        currentContent,
        selectionState,
        tabIndent + selectedText
      );

      // Setting next state
      setEditorState(EditorState.push(currentState, nextState, "indent"));
    }
  };

  function handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    console.log(editorState);

    if (newState) {
      onChange(newState);
      return "handled";
    }

    return "not-handled";
  }

  console.log(note.data);

  return (
    <div>
      <Title onChange={changeName} value={note.name} />
      <Container>
        <Editor
          editorState={editorState}
          keyBindingFn={keyDown}
          handleKeyCommand={handleKeyCommand}
          onChange={onChange}
          placeholder="Type Here"
        />
      </Container>
    </div>
  );
}

export default MyEditor;
