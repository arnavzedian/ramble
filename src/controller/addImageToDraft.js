import { convertToRaw, EditorState, AtomicBlockUtils } from "draft-js";

function addImageToDraft({ imageSrc, editorState, setEditorState }) {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    "image",
    "IMMUTABLE",
    { src: imageSrc }
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(editorState, {
    currentContent: contentStateWithEntity,
  });
  setEditorState(
    AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
  );
}

export default addImageToDraft;
