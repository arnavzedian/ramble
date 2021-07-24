import { useContext, useEffect, useRef, useState, useMemo } from "react";
import Context from "../Context";
import styled from "styled-components";
import {
  EditorState,
  RichUtils,
  Modifier,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import "./draftEditorStyle.css";
import Editor from "@draft-js-plugins/editor";
import createInlineToolbarPlugin, {
  Separator,
} from "@draft-js-plugins/inline-toolbar";

import "@draft-js-plugins/inline-toolbar/lib/plugin.css";
import { MdFormatStrikethrough } from "react-icons/md";
import buttonStyles from "./buttonStyles.module.css";
import toolbarStyles from "./toolbarStyles.module.css";

import StyleButton from "./StyleButton";
import getCurrentBlock from "../controller/getCurrentBlock";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from "@draft-js-plugins/buttons";
import ChangeBlockType from "./ChangeBlockType";

const customStyleMap = {
  STRIKETHROUGH: {
    textDecoration: "line-through",
  },
};

const ToolbarButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Title = styled.input`
  width: 100%;
  height: 70px;
  overflow: hidden;
  color: #fff;
  outline: none;
  font-weight: 900;
  font-size: 30px;
  padding: 20px 0;
  background-color: transparent;
  border: none;
`;

const Container = styled.div`
  width: 100%;
  position: relative;
  resize: none;
  color: #fff;
  outline: none;
  font-size: 15px;
  background-color: transparent;
  border: none;

  min-height: 200px;

  :global(.public-DraftEditor-content) {
    min-height: 140px;
  }
`;

const Div = styled.div`
  width: 62vw;
  margin-left: 19vw;
  position: relative;
`;

const inlineToolbarPlugin = createInlineToolbarPlugin({
  theme: { buttonStyles, toolbarStyles },
});
const { InlineToolbar } = inlineToolbarPlugin;
const plugins = [inlineToolbarPlugin];

function MyEditor() {
  let { state, dispatch } = useContext(Context);
  let [editorState, setEditorState] = useState(getState());
  const [, forceRender] = useState({});

  useEffect(() => {
    setEditorState(getState());
  }, [state.selectedNote]);

  let note = state.notes[state.selectedNote];

  const editor = useRef(null);

  function getState() {
    let note = state.notes[state.selectedNote];
    if (note.data) {
      return EditorState.createWithContent(convertFromRaw(note.data));
    } else {
      return EditorState.createEmpty();
    }
  }

  function changeName(e) {
    let newState = { ...state };
    newState.notes[state.selectedNote].name = e.target.value;
    dispatch({ type: "NEW_STATE", value: newState });
  }

  function saveState(editorState) {
    const contentState = editorState.getCurrentContent();
    let data = convertToRaw(contentState);

    let newState = { ...state };

    newState.notes[state.selectedNote].data = data;

    dispatch({ type: "NEW_STATE", value: newState });
  }

  function onChange(editorState) {
    setEditorState(editorState);
    saveState(editorState);
  }

  const addIndent = (e) => {
    // if (e.key === "Tab") {
    // Preventing default behavior to keep cursor in the editor
    e.preventDefault();

    // Defining number of spaces to apply after tab press
    let tabIndent = "     ";

    // Getting current state
    let currentState = editorState;

    // Getting variables to know text selection
    let selectionState = editorState.getSelection();

    let anchorKey = selectionState.getAnchorKey();
    let currentContent = editorState.getCurrentContent();

    let currentContentBlock = currentContent.getBlockForKey(anchorKey);

    let start = selectionState.getStartOffset();
    let end = selectionState.getEndOffset();
    let selectedText = currentContentBlock.getText().slice(start, end);

    // Defining next state
    let nextState = Modifier.replaceText(
      currentContent,
      selectionState,
      tabIndent + selectedText
    );

    // Setting next state
    setEditorState(EditorState.push(currentState, nextState, "indent"));
    // }
  };

  function handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    console.log(editorState);

    if (newState) {
      onChange(newState);
      return "handled";
    }

    // forceRender({});
    return "not-handled";
  }

  const resetBlockType = (editorState) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const key = selectionState.getStartKey();
    const blockMap = contentState.getBlockMap();
    const block = blockMap.get(key);

    const newBlock = block.merge({
      text: "",
      type: "unordered-list-item",
      data: {},
    });

    const newContentState = contentState.merge({
      blockMap: blockMap.set(key, newBlock),
      selectionAfter: selectionState.merge({
        anchorOffset: 0,
        focusOffset: 0,
      }),
    });

    return EditorState.push(editorState, newContentState, "change-block-type");
  };

  function handleBeforeInput(str) {
    if (str !== " ") {
      return false;
    }

    /* Get the selection */
    const selection = editorState.getSelection();

    /* Get the current block */
    const currentBlock = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    const blockLength = currentBlock.getLength();
    if (blockLength === 1 && currentBlock.getText() === "*") {
      setEditorState(resetBlockType(editorState));
      return "handled";
    }
    return "not-handled";
  }

  const focus = () => {
    if (editor.current) editor.current.focus();
  };

  function onTab(e) {
    let block = getCurrentBlock(editorState);
    if (block) console.log(block.type);

    if (block.type == "unstyled") {
      addIndent(e);
    } else {
      const maxDepth = 4;
      let newState = RichUtils.onTab(e, editorState, maxDepth);
      setEditorState(newState);
    }
  }

  return (
    <Div>
      <ChangeBlockType {...{ editorState, setEditorState, RichUtils }} />
      <Title placeholder={"Title"} onChange={changeName} value={note.name} />
      <Container onClick={focus}>
        <Editor
          editorState={editorState}
          editorKey="SimpleInlineToolbarEditor"
          ref={(element) => {
            editor.current = element;
          }}
          customStyleMap={customStyleMap}
          onTab={onTab}
          plugins={plugins}
          handleKeyCommand={handleKeyCommand}
          handleBeforeInput={handleBeforeInput}
          onChange={onChange}
          placeholder="Type Here"
        />

        <InlineToolbar>
          {
            // may be use React.Fragment instead of div to improve perfomance after React 16
            (externalProps) => (
              <ToolbarButtonContainer>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <HeadlineOneButton {...externalProps} />
                <HeadlineTwoButton {...externalProps} />
                <HeadlineThreeButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
                <CodeBlockButton {...externalProps} />
                <StyleButton
                  Icon={MdFormatStrikethrough}
                  newStyle={"STRIKETHROUGH"}
                  {...{ editorState, setEditorState, RichUtils }}
                />
              </ToolbarButtonContainer>
            )
          }
        </InlineToolbar>
      </Container>
    </Div>
  );
}

export default MyEditor;
