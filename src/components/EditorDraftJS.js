import { useContext, useEffect, useRef, useState, useMemo } from "react";
import Context from "../Context";
import { Map } from "immutable";
import TodoBlock from "./TodoBlock";
import styled from "styled-components";
import {
  EditorState,
  RichUtils,
  Modifier,
  convertFromRaw,
  DefaultDraftBlockRenderMap,
  convertToRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import "./draftEditorStyle.css";
import Editor from "@draft-js-plugins/editor";
import createInlineToolbarPlugin, {
  Separator,
} from "@draft-js-plugins/inline-toolbar";

import createImagePlugin from "draft-js-image-plugin";
import "@draft-js-plugins/inline-toolbar/lib/plugin.css";
import { MdFormatStrikethrough, MdSignalCellularNull } from "react-icons/md";
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
import PlusButton from "./PlusButton";

import { RiText } from "react-icons/ri";
import { MdTitle } from "react-icons/md";
const TODO_BLOCK = "todo";

export const BLOCK_TYPE = {
  // This is used to represent a normal text block (paragraph).
  UNSTYLED: "unstyled",
  HEADER_ONE: "header-one",
  HEADER_TWO: "header-two",
  HEADER_THREE: "header-three",
  HEADER_FOUR: "header-four",
  HEADER_FIVE: "header-five",
  HEADER_SIX: "header-six",
  UNORDERED_LIST_ITEM: "unordered-list-item",
  ORDERED_LIST_ITEM: "ordered-list-item",
  BLOCKQUOTE: "blockquote",
  CODE: "code-block",
  // This represents a "custom" block, not for rich text, with arbitrary content.
  ATOMIC: "atomic",
};

const imagePlugin = createImagePlugin();

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
  text-align: center;
  color: #fff;
  outline: none;
  font-weight: 900;
  font-size: 35px;
  margin-bottom: 25px;
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
  font-size: 16px;
  background-color: transparent;
  border: none;

  min-height: 50vh;

  :global(.public-DraftEditor-content) {
    min-height: 140px;
  }
`;

const Div = styled.div`
  width: 46vw;
  margin-left: 27vw;
  position: relative;
  padding: 100px 0;
  font-size: 16px;
`;

const inlineToolbarPlugin = createInlineToolbarPlugin({
  theme: { buttonStyles, toolbarStyles },
});

const { InlineToolbar } = inlineToolbarPlugin;
const plugins = [inlineToolbarPlugin, imagePlugin];

function MyEditor({ noteID }) {
  let { state, dispatch } = useContext(Context);
  let [editorState, updateEditorState] = useState(getState());

  const editor = useRef(null);

  let blockRenderMap = null;

  useEffect(() => {
    blockRenderMap = new Map({
      [TODO_BLOCK]: {
        element: "div",
      },
    }).merge(DefaultDraftBlockRenderMap);

    let note = state.notes[noteID];
    if (note) updateEditorState(getState());
  }, [noteID]);

  // if (!blockRenderMap) return [];
  let note = state.notes[noteID];

  if (!note) return [];

  function getState() {
    let note = state.notes[noteID];
    if (!note) return {};
    if (note.data) {
      return EditorState.createWithContent(convertFromRaw(note.data));
    } else {
      return EditorState.createEmpty();
    }
  }

  function hidePlaceholder() {
    const contentState = editorState.getCurrentContent();
    return (
      contentState.hasText() ||
      contentState.getBlockMap().first().getType() !== BLOCK_TYPE.UNSTYLED
    );
  }

  function changeName(e) {
    let newState = { ...state };
    newState.notes[noteID].name = e.target.value;
    dispatch({ type: "NEW_STATE", value: newState });
  }

  function saveState(editorState) {
    const contentState = editorState.getCurrentContent();
    let data = convertToRaw(contentState);

    let newState = { ...state };

    newState.notes[noteID].data = data;

    dispatch({ type: "NEW_STATE", value: newState });
  }

  function setEditorState(editorState) {
    updateEditorState(editorState);
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

  function getEditorState() {
    return editorState;
  }

  const getBlockRendererFn = (block) => {
    const type = block.getType();
    console.log(type, blockRenderMap);
    switch (type) {
      case TODO_BLOCK:
        return {
          component: TodoBlock,
          props: {
            onChange: setEditorState,
            getEditorState: getEditorState,
          },
        };
      default:
        return null;
    }
  };

  function handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    console.log(editorState);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    // forceRender({});
    return "not-handled";
  }

  // const addEmptyBlock = (editorState) => {
  //   const newBlock = new ContentBlock({
  //     key: genKey(),
  //     type: "unstyled",
  //     text: "",
  //     characterList: List(),
  //   });

  //   const contentState = editorState.getCurrentContent();
  //   const newBlockMap = contentState.getBlockMap().set(newBlock.key, newBlock);

  //   setEditorState(
  //     EditorState.push(
  //       editorState,
  //       ContentState.createFromBlockArray(newBlockMap.toArray())
  //     )
  //   );
  // };

  const resetBlockType = (editorState, type, data = {}) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const key = selectionState.getStartKey();
    const blockMap = contentState.getBlockMap();
    const block = blockMap.get(key);

    const newBlock = block.merge({
      text: "",
      type: type,
      data: data,
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
    if (str !== " ") return "not-handled";
    const selection = editorState.getSelection();

    const currentBlock = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    const blockLength = currentBlock.getLength();

    if (blockLength === 1 && currentBlock.getText() === "*") {
      setEditorState(resetBlockType(editorState, "unordered-list-item"));
      return "handled";
    } else if (blockLength === 1 && currentBlock.getText() === "1") {
      setEditorState(resetBlockType(editorState, "ordered-list-item"));
      return "handled";
    } else if (blockLength === 2 && currentBlock.getText() === "1.") {
      setEditorState(resetBlockType(editorState, "ordered-list-item"));
      return "handled";
    } else if (blockLength === 1 && currentBlock.getText() === "#") {
      setEditorState(resetBlockType(editorState, "header-one"));
      return "handled";
    } else if (blockLength === 2 && currentBlock.getText() === "##") {
      setEditorState(resetBlockType(editorState, "header-two"));
      return "handled";
    } else if (blockLength === 3 && currentBlock.getText() === "###") {
      setEditorState(resetBlockType(editorState, "header-three"));
      return "handled";
    } else if (blockLength === 2 && currentBlock.getText() === "[]") {
      setEditorState(
        resetBlockType(editorState, TODO_BLOCK, { checked: false })
      );
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

  // function isActive() {
  //   if (noteID == state.selectedNote) return true;
  //   return false;
  // }

  function blockStyleFn(block) {
    switch (block.getType()) {
      case TODO_BLOCK:
        return "block block-todo";
      default:
        return "block";
    }
  }

  return (
    <Div data-note_id={noteID}>
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
          blockStyleFn={blockStyleFn}
          blockRendererFn={getBlockRendererFn}
          blockRenderMap={blockRenderMap}
          handleKeyCommand={handleKeyCommand}
          handleBeforeInput={handleBeforeInput}
          onChange={setEditorState}
          placeholder={hidePlaceholder() ? "" : "Type Here"}
        />
        {/* {isActive() ? ( */}
        {/* <div> */}{" "}
        <PlusButton {...{ editorState, setEditorState, RichUtils }} />
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
        {/* </div> */}
        {/* ) : (
          []
        )} */}
      </Container>
    </Div>
  );
}

export default MyEditor;
