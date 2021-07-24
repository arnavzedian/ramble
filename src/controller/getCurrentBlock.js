function getCurrentBlock(editorState) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  return blockMap.get(key);
}

export default getCurrentBlock;
