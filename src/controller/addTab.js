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

function addTab({ state, dispatch }) {
  let newState = { ...state };
  let id = Math.random().toString(36).slice(-10);
  newState.notes[id] = { name: "", data: "" };
  newState.selectedNote = id;
  newState.ranking.unshift(id);
  dispatch({ type: "NEW_STATE", value: newState });
}

export default addTab;
