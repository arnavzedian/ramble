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

  return (
    <Container>
      <Context.Provider value={{ dispatch, state, setFormData }}>
        <DynamicForm formData={formData} setFormData={setFormData} />
        <Tabs></Tabs>
        {state.selectedNote ? <Editor></Editor> : []}
      </Context.Provider>
    </Container>
  );
}

export default App;
