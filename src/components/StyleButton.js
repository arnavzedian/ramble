import { useContext } from "react";
import Context from "../Context";
import styled from "styled-components";
import { EditorState } from "draft-js";

const Button = styled.span`
  height: 34px;
  width: 34px;
  font-size: 13px;
  justify-content: center;
  cursor: pointer;
  border-radius: 30px;
  display: flex;
  align-items: center;
  color: ${({ isActive }) => (isActive ? "#50CB93" : "#fff")};
  :hover {
    background-color: #444;
  }
`;

function StyleButton({
  RichUtils,
  setEditorState,
  editorState,
  newStyle,
  coverEntireBlock,
  Icon,
  callback,
}) {
  if (!Icon) {
    console.warn("Icon undefiend");
    return [];
  }

  return (
    <Button isActive={checkActive()} onMouseDown={doStyling}>
      {typeof Icon == "string" ? (
        Icon
      ) : (
        <Icon fill={checkActive() ? "#50CB93" : "#fff"} />
      )}
    </Button>
  );

  function styleWholeBlock() {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const key = selectionState.getStartKey();
    const blockMap = contentState.getBlockMap();
    const block = blockMap.get(key);

    const newBlock = block.merge({
      text: "",
      type: newStyle,
      data: {},
    });

    const newContentState = contentState.merge({
      blockMap: blockMap.set(key, newBlock),
      selectionAfter: selectionState.merge({
        anchorOffset: 0,
        focusOffset: 0,
      }),
    });

    return EditorState.push(editorState, newContentState, "added-" + newStyle);
  }

  function checkActive() {
    const currentFocus = editorState.getSelection().getFocusKey();
    const inlineStyle = editorState.getCurrentInlineStyle(currentFocus);
    return inlineStyle.has(newStyle);
  }

  function doStyling(e) {
    e.preventDefault();

    let newState;

    if (coverEntireBlock) {
      newState = styleWholeBlock();
    } else {
      newState = RichUtils.toggleInlineStyle(editorState, newStyle);
    }

    if (newState) setEditorState(newState);
    if (callback) callback();
  }
}

export default StyleButton;
