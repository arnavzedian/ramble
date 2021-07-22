import logo from "./logo.svg";
import "./App.css";
import Context from "./Context";
import reducer from "./reducer";
import Tabs from "./components/Tabs";
// import Editor from "./components/Editor";
import Editor from "./components/EditorDraftJS";
import { useReducer, useState } from "react";
import styled from "styled-components";
import DynamicForm from "./components/DynamicForm";
function getInitialState() {
  let data = localStorage.getItem("notes-data");
  if (!data)
    return {
      notes: { A: { name: "First Note", data: null } },
      selectedNote: "A",
    };
  return JSON.parse(data);
}

let Container = styled.div`
  background-color: #222;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  overflow-y: scroll;
`;

function App() {
  let [state, dispatch] = useReducer(reducer, getInitialState());
  let [formData, setFormData] = useState(null);

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
