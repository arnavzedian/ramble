import { useContext } from "react";
import Context from "../Context";
import styled from "styled-components";
import Tab from "./Tab";
import AddTab from "./AddTab";
import MoreButton from "./MoreButton";

const Container = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  background-color: #111;
  gap: 10px;
  z-index: 5;
  justify-content: center;
  overflow-x: auto;
  flex-direction: row;
  padding: 10px 10px;
  opacity: 0.7;
`;

function Tabs() {
  const { state } = useContext(Context);

  if (!state.ranking.length) return [];

  let list = [];
  let limit = window.innerWidth / 150;

  let count = 0;
  for (let noteID of state.ranking) {
    count++;
    if (count < limit) list.push(<Tab key={noteID} noteID={noteID} />);
  }

  list.unshift(<AddTab />);

  if (state.ranking.length > limit) list.push(<MoreButton />);

  return <Container>{list}</Container>;
}

export default Tabs;
