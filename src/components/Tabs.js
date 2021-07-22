import { useContext } from "react";
import Context from "../Context";
import styled from "styled-components";
import Tab from "./Tab";
import AddTab from "./AddTab";

const Container = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  background-color: #222;
  gap: 10px;
  z-index: 5;
  justify-content: center;
  flex-direction: row;
  padding: 10px 0;
`;

function Tabs() {
  const { state } = useContext(Context);
  let list = [];

  list.push(<AddTab />);

  for (let noteID in state.notes) {
    list.push(<Tab key={noteID} noteID={noteID} />);
  }

  return <Container>{list}</Container>;
}

export default Tabs;
