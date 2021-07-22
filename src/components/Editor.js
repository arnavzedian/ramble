import { useContext, useEffect, useRef } from "react";
import Context from "../Context";
import styled from "styled-components";

const Container = styled.textarea`
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

const Title = styled.input`
  width: 100vw;
  height: 60px;
  overflow: hidden;
  color: #fff;
  outline: none;
  padding: 20px;
  padding-bottom: 0;
  font-size: 30px;
  background-color: transparent;
  border: none;
`;

function Editor() {
  let editorRef = useRef(null);
  const { state, dispatch } = useContext(Context);
  useEffect(() => {
    if (editorRef.current) {
      putInitialData(editorRef.current);
    }
  }, [state.selectedNote, editorRef]);

  let note = state.notes[state.selectedNote];

  if (!note) return "Please select a note";

  return (
    <div>
      <Title onChange={changeName} value={note.name} />
      <Container ref={editorRef} onKeyDown={rewire}></Container>
    </div>
  );

  function changeName(e) {
    let newState = { ...state };
    newState.notes[state.selectedNote].name = e.target.value;
    dispatch({ type: "NEW_STATE", value: newState });
  }

  function putInitialData(element) {
    element.value = note.data;
  }

  function rewire(e) {
    let { keyCode } = e;
    let codebox = e.target;
    let { value, selectionStart, selectionEnd } = codebox;
    console.log(selectionStart, selectionEnd);

    function resetTheCursor(increment = 0) {
      codebox.setSelectionRange(
        selectionStart + increment,
        selectionStart + increment
      );
    }

    function sliceAndPut(toPut, start = selectionStart, end = selectionEnd) {
      codebox.value = value.slice(0, start) + toPut + value.slice(end);
    }

    function addTab() {
      e.preventDefault();
      sliceAndPut("\t");
      resetTheCursor(1);
    }

    function parseBulletPoint() {
      if (value[selectionStart - 1] == "*") {
        // e.preventDefault();
        sliceAndPut("•", selectionStart - 1, selectionStart);
        resetTheCursor(0);
      }
    }
    switch (keyCode) {
      case 9:
        addTab();
        break;
      case 32:
        parseBulletPoint();
        break;
    }

    let newState = { ...state };

    newState.notes[state.selectedNote].data = codebox.value;

    dispatch({ type: "NEW_STATE", value: newState });
  }
}

export default Editor;
