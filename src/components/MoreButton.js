import { useContext } from "react";
import Context from "../Context";
import styled from "styled-components";
import { IoIosArrowUp } from "react-icons/io";
import setCurrentNote from "../controller/setCurrentNote";

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

function MoreButton() {
  const { state, dispatch, setFormData } = useContext(Context);

  return (
    <Container onClick={openNotesList}>
      <IoIosArrowUp />
    </Container>
  );

  function openNotesList() {
    let form = { headings: ["All Notes"], buttons: [] };

    for (let noteID of state.ranking) {
      let name = state.notes[noteID].name;
      form.buttons.push({
        name: name ? name : "untitled",
        onClick: () => {
          setFormData(null);
          setCurrentNote({ state, dispatch, noteID });
        },
      });
    }

    setFormData(form);
  }
}

export default MoreButton;
