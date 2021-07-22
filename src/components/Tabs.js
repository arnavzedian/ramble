import { useContext } from "react";
import Context from "../Context";
import styled from "styled-components";
import Tab from "./Tab";
import AddTab from "./AddTab";
import MoreButton from "./MoreButton";

const Container = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  background-color: #222;
  gap: 10px;
  z-index: 5;
  justify-content: center;
  overflow-x: auto;
  flex-direction: row;
  padding: 10px 10px;
`;

function Tabs() {
  const { state } = useContext(Context);
  let list = [];

  list.push(<AddTab />);

  let limit = window.innerWidth / 200;

  let count = 0;
  for (let noteID of state.ranking) {
    count++;
    if (count < limit) list.push(<Tab key={noteID} noteID={noteID} />);
  }

  if (state.ranking.length > limit) list.push(<MoreButton />);

  return <Container>{list}</Container>;
}

export default Tabs;
