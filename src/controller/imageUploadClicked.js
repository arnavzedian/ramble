import uploadImage from "./uploadImage";
import addImageToDraft from "./addImageToDraft";

function imageUploadClicked({ editorState, setEditorState }) {
  uploadImage().then((imageSrc) => {
    addImageToDraft({ imageSrc, editorState, setEditorState });
  });
}

export default imageUploadClicked;
