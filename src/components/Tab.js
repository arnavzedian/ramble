import { useContext } from "react";
import Context from "../Context";
import styled from "styled-components";
import { MdClose } from "react-icons/md";
import setCurrentNote from "../controller/setCurrentNote";

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
      onClick={
        isSelected()
          ? null
          : () => {
              setCurrentNote({ state, dispatch, noteID });
            }
      }
    >
      <Name>{note.name ? note.name : "Untitled"}</Name>
      {noteID == state.selectedNote ? (
        <Cross onClick={shouldDelete}>
          <MdClose />
        </Cross>
      ) : (
        []
      )}
    </Container>
  );

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

    newState.ranking = newState.ranking.filter((e) => e !== noteID);

    let IDs = Object.keys(newState.notes);

    let newNoteID = null;
    if (newState.selectedNote == noteID) {
      if (IDs[0]) {
        console.log("Deleted tab");
        newNoteID = IDs[0];
      }
    }

    console.log(newState);

    setCurrentNote({ state: newState, dispatch, noteID: newNoteID });
  }
}

export default Tab;
