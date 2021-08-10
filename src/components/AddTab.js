import { useContext } from "react";
import Context from "../Context";
import styled from "styled-components";
import { MdAdd } from "react-icons/md";
import addTab from "../controller/addTab";
const Container = styled.button`
  width: 35px;
  height: 35px;
  border-radius: 5px;
  border: none;
  padding: 0 10px;
  cursor: pointer;
  display: flex;
  color: #eee;
  opacity: 0.6;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ isActive }) => (isActive ? "#111" : "#222")};
`;

function AddTab() {
  const { state, dispatch } = useContext(Context);

  return (
    <Container
      onClick={() => {
        addTab({ state, dispatch });
      }}
    >
      <MdAdd />
    </Container>
  );
}

export default AddTab;
