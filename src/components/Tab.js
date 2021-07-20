import { useContext } from "react";
import Context from "../Context";
import styled from "styled-components";
import { MdClose } from "react-icons/md";

const Container = styled.button`
  width: 130px;
  height: 35px;
  border-radius: 5px;
  border: none;
  padding: 0 10px;
  cursor: pointer;
  display: flex;
  color: #eee;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ isActive }) => (isActive ? "#111" : "#333")};
`;

const Name = styled.span`
  width: 90px;
  overflow: hidden;
  text-align: left;
  opacity: 0.6;
  padding-left: 5px;
  white-space: nowrap;
`;

const Cross = styled.span`
  opacity: 0.5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function Tab({ noteID }) {
  const { state, dispatch, setFormData } = useContext(Context);

  let note = state.notes[noteID];

  function isSelected() {}

  return (
    <Container
      isActive={noteID == state.selectedNote}
      onClick={isSelected() ? null : setCurrentNote}
    >
      <Name>{note.name}</Name>
      {noteID == state.selectedNote ? (
        <Cross onClick={shouldDelete}>
          <MdClose />
        </Cross>
      ) : (
        []
      )}
    </Container>
  );

  function setCurrentNote() {
    dispatch({ type: "UPDATE", field: "selectedNote", value: noteID });
  }

  function shouldDelete() {
    let form = {
      headings: ["Are you sure about deleting this note?"],
      buttons: [
        {
          name: "Yes",
          onClick: deleteNote,
        },
        { name: "No", onClick: cleanForm },
      ],
    };

    setFormData(form);

    function cleanForm() {
      setFormData(null);
    }
  }

  function deleteNote() {
    setFormData(null);
    let newState = JSON.parse(JSON.stringify(state));

    delete newState.notes[noteID];

    let IDs = Object.keys(newState.notes);

    if (newState.selectedNote == noteID) {
      if (IDs[0]) {
        console.log("Deleted tab");
        newState.selectedNote = IDs[0];
      } else {
        newState.selectedNote = null;
      }
    }

    console.log(newState);

    dispatch({
      type: "NEW_STATE",
      value: newState,
    });
  }
}

export default Tab;
