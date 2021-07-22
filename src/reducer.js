export default function reducer(prevState, action) {
  switch (action.type) {
    case "UPDATE":
      if (action.number) {
        action.value = Number(action.value);
        if (isNaN(action.value)) action.value = 0;
      }

      return save({ ...prevState, [action.field]: action.value });
    case "NEW_STATE":
      return save({ ...action.value });

    default:
      throw Error("Invalid reducer type", action);
  }
}

function save(data) {
  localStorage.setItem("notes-data", JSON.stringify(data));
  return data;
}
