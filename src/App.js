import logo from "./logo.svg";
import "./App.css";
import Context from "./Context";
import reducer from "./reducer";
import Tabs from "./components/Tabs";
// import Editor from "./components/Editor";
import Editor from "./components/EditorDraftJS";
import { useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import DynamicForm from "./components/DynamicForm";
import localforage from "localforage";
import Intro from "./components/Intro";

async function getInitialState() {
  let data = await localforage.getItem("notes-data");
  if (!data)
    return {
      ranking: [],
      notes: {},
      selectedNote: null,
    };
  return data;
}

let Container = styled.div`
  background-color: #222;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

let ScrollContainer = styled.div`
  background-color: #222;
  height: calc(100vh - 50px);
  width: 100vw;
  overflow: hidden;
  overflow-y: scroll;
`;

function App() {
  let [state, dispatch] = useReducer(reducer, null);
  let [formData, setFormData] = useState(null);

  useEffect(() => {
    getInitialState().then((data) => {
      dispatch({ type: "NEW_STATE", value: data });
    });
  }, []);

  if (!state) return [];

  let editors = [
    <Editor noteID={state.selectedNote} />,
    // <Editor noteID={state.ranking[1]} />,
    // <Editor noteID={state.ranking[2]} />,
  ];

  var isScrolling;

  function scrollStop(callback) {
    // Clear our timeout throughout the scroll
    window.clearTimeout(isScrolling);

    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(function () {
      // Run the callback
      callback();
      console.log("Scrolling has stopped.");
    }, 66);
  }

  function setCorrectTab() {
    window.clearTimeout(isScrolling);

    let target = document.querySelector(".editorScrollParent");
    let children = target.children;

    console.log(children);

    for (let child of children) {
      if (child.dataset.note_id) {
        if (isInView(child)) {
          if (state.selectedNote !== child.dataset.note_id)
            dispatch({
              type: "UPDATE",
              field: "selectedNote",
              value: child.dataset.note_id,
            });
        }
      }
    }
  }

  return (
    <Container
    // onScroll={() => scrollStop(setCorrectTab)}
    >
      <Context.Provider value={{ dispatch, state, setFormData }}>
        <DynamicForm formData={formData} setFormData={setFormData} />
        <Tabs></Tabs>
        <ScrollContainer className="editorScrollParent">
          {state.selectedNote ? editors : <Intro />}
        </ScrollContainer>
      </Context.Provider>
    </Container>
  );
}

function isInView(el) {
  const box = el.getBoundingClientRect();
  return box.top < window.innerHeight && box.bottom >= 0;
}

export default App;
