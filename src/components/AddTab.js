import { useContext } from "react";
import Context from "../Context";
import styled from "styled-components";
import { MdAdd } from "react-icons/md";

const Container = styled.button`
  width: 35px;
  height: 35px;
  border-radius: 5px;
  border: none;
  padding: 0 10px;
  cursor: pointer;
  display: flex;
  color: #eee;
  opacity: 0.6;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ isActive }) => (isActive ? "#111" : "#333")};
`;

function AddTab() {
  const { state, dispatch } = useContext(Context);

  return (
    <Container onClick={addTab}>
      <MdAdd />
    </Container>
  );

  function getDate() {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth();
    var d = date.getDate();
    return `${d} ${monthNames[m]} ${y} ${date.getHours()}:${date.getMinutes()}`;
  }

  function addTab() {
    let newState = { ...state };
    let id = Math.random().toString(36).slice(-10);
    let name = getDate();
    newState.notes[id] = { name: "Untitled", data: "" };
    newState.selectedNote = id;
    newState.ranking.unshift(id);
    dispatch({ type: "NEW_STATE", value: newState });
  }
}

export default AddTab;
