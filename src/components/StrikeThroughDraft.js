import { useContext } from "react";
import Context from "../Context";
import styled from "styled-components";
import { MdFormatStrikethrough } from "react-icons/md";

const Button = styled.span`
  height: 34px;
  width: 34px;
  font-size: 13px;
  justify-content: center;
  cursor: pointer;
  border-radius: 30px;
  display: flex;
  align-items: center;

  :hover {
    background-color: #444;
  }
`;

function StrikeThrough({ RichUtils, setEditorState, editorState }) {
  return (
    <Button onMouseDown={doStrikeThrough}>
      <MdFormatStrikethrough fill={checkActive() ? "#50CB93" : "#fff"} />
    </Button>
  );

  function checkActive() {
    const currentFocus = editorState.getSelection().getFocusKey();
    const inlineStyle = editorState.getCurrentInlineStyle(currentFocus);
    console.log(
      inlineStyle,
      inlineStyle.has("BOLD"),
      inlineStyle.has("STRIKETHROUGH")
    );
    return inlineStyle.has("STRIKETHROUGH");
  }

  function doStrikeThrough(e) {
    e.preventDefault();
    const newState = RichUtils.toggleInlineStyle(editorState, "STRIKETHROUGH");
    setEditorState(newState);
  }
}

export default StrikeThrough;
