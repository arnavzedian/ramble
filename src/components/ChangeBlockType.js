import { useContext, useState } from "react";
import Context from "../Context";
import styled from "styled-components";
import { FiPlus } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import getCurrentBlock from "../controller/getCurrentBlock";
import StyleButton from "./StyleButton";
import imageUploadClicked from "../controller/imageUploadClicked";
import { CgImage } from "react-icons/cg";
import { AiOutlineUnorderedList, AiOutlineOrderedList } from "react-icons/ai";
import { BiTask } from "react-icons/bi";
const Container = styled.div`
  height: 20px;
  width: 20px;
  display: flex;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  align-items: center;
  transition: 0.25s ease-in;
  transform: ${({ active }) => (active ? "rotate(45deg)" : "unset")};
`;

const MainContainer = styled.div`
  position: fixed;
  left: 16vw;
  z-index: 555;
  display: flex;
  transition: 0.2s ease-in;
  flex-direction: row;
  top: ${({ top }) => (top ? top + "px" : "0px")};
  visibility: ${({ visibility }) => (visibility ? visibility : "none")};
`;

const ButtonsContainer = styled.div`
  margin-left: 8px;
  z-index: 55;
  margin-top: -8px;
  display: flex;
  background-color: #111;
  border-radius: 15px;
  transition: 0.2s ease-in;
  flex-direction: row;
  transform: ${({ active }) => (active ? "scale(1)" : "scale(0)")};
`;

function ChangeBlockType({ editorState, setEditorState, RichUtils }) {
  const { state, dispatch, setFormData } = useContext(Context);
  let [active, setActive] = useState(false);
  let [posY, setPosY] = useState(false);
  let [show, setShow] = useState(true);

  function openMenu(e) {
    e.preventDefault();
    setActive(!active);
  }

  setTimeout(() => {
    setPosY(getPositionY());
    setShow(shouldShow());
  }, 50);

  if (posY == false) return [];

  function callback() {
    setActive(false);
  }
  return (
    <MainContainer top={posY} visibility={show ? "visible" : "hidden"}>
      <Container onMouseDown={openMenu} active={active}>
        <FiPlus />
      </Container>

      <ButtonsContainer active={active}>
        <StyleButton
          coverEntireBlock={true}
          Icon={"H1"}
          callback={callback}
          newStyle={"header-one"}
          {...{ editorState, setEditorState, RichUtils }}
        />
        <StyleButton
          Icon={"H2"}
          callback={callback}
          coverEntireBlock={true}
          newStyle={"header-two"}
          {...{ editorState, setEditorState, RichUtils }}
        />
        <StyleButton
          Icon={"H3"}
          coverEntireBlock={true}
          callback={callback}
          newStyle={"header-three"}
          {...{ editorState, setEditorState, RichUtils }}
        />
        <StyleButton
          Icon={"H3"}
          coverEntireBlock={true}
          callback={callback}
          newStyle={"header-three"}
          {...{ editorState, setEditorState, RichUtils }}
        />
        <StyleButton
          Icon={AiOutlineUnorderedList}
          coverEntireBlock={true}
          callback={callback}
          newStyle={"unordered-list-item"}
          {...{ editorState, setEditorState, RichUtils }}
        />
        <StyleButton
          Icon={AiOutlineOrderedList}
          coverEntireBlock={true}
          callback={callback}
          newStyle={"ordered-list-item"}
          {...{ editorState, setEditorState, RichUtils }}
        />

        <StyleButton
          Icon={CgImage}
          coverEntireBlock={true}
          callback={callback}
          actionFunction={imageUploadClicked}
          {...{ editorState, setEditorState, RichUtils }}
        />
        <StyleButton
          Icon={BiTask}
          coverEntireBlock={true}
          callback={callback}
          newStyle={"todo"}
          {...{ editorState, setEditorState, RichUtils }}
        />
      </ButtonsContainer>
    </MainContainer>
  );

  function getPositionY() {
    let y = false;
    const isSupported = typeof window.getSelection !== "undefined";
    if (isSupported) {
      const selection = window.getSelection();
      if (selection.rangeCount !== 0) {
        const range = selection.getRangeAt(0).cloneRange();
        range.collapse(true);
        const rect = range.getClientRects()[0];
        if (rect) {
          y = rect.top;
        } else {
          let ele = range.startContainer;
          if (ele) {
            y = ele.getBoundingClientRect().top;
            // console.log("rect  0", y, range);
          }
        }
      } else {
        // console.log("range count 0");
      }
    }

    let scrollParent = document.querySelector(".editorScrollParent");
    // console.log(scrollParent);
    // y += scrollParent.scrollTop;
    return y;
  }

  function shouldShow() {
    let show = true;
    let block = getCurrentBlock(editorState);
    if (block) {
      if (block.getText()) {
        // console.log(block.getText());
        show = false;
      }
    }

    return show;
  }
}

export default ChangeBlockType;
