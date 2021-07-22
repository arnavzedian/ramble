function setCurrentNote({ state, dispatch, noteID }) {
  let newState = JSON.parse(JSON.stringify(state));
  newState.ranking = newState.ranking.filter((e) => e !== noteID);
  console.log(newState.ranking);
  newState.selectedNote = noteID;
  if (noteID) newState.ranking.unshift(noteID);
  dispatch({ type: "NEW_STATE", value: newState });
}

export default setCurrentNote;
