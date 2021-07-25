import { EditorBlock, EditorState } from "draft-js";
import styled from "styled-components";

const Main = styled.div`
  /* display: flex;
  flex-direction: row;
  align-items: center; */
`;

function TodoBlock(props) {
  function updateData() {
    const { block, blockProps } = props;

    // This is the reason we needed a higher-order function for blockRendererFn
    const { onChange, getEditorState } = blockProps;
    const data = block.getData();
    const checked = data.has("checked") && data.get("checked") === true;
    const newData = data.set("checked", !checked);
    onChange(updateDataOfBlock(getEditorState(), block, newData));
  }

  const data = props.block.getData();
  const checked = data.get("checked") === true;
  return (
    <Main className={checked ? "block-todo-completed main" : ""}>
      <input type="checkbox" checked={checked} onChange={updateData} />
      <EditorBlock {...props} />
    </Main>
  );
}

function updateDataOfBlock(editorState, block, newData) {
  const contentState = editorState.getCurrentContent();
  const newBlock = block.merge({
    data: newData,
  });
  const newContentState = contentState.merge({
    blockMap: contentState.getBlockMap().set(block.getKey(), newBlock),
  });
  return EditorState.push(editorState, newContentState, "change-block-type");
}

export default TodoBlock;
