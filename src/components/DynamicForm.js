import styled, { ThemeProvider } from "styled-components";
import BarLoader from "./BarLoader";
import { useState } from "react";
import { VscClose } from "react-icons/vsc";
const Button = styled.button`
  width: 100%;
  padding: 15px 25px;
  border-radius: 25px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.fc};
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 0;
  outline: none;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid;
  background: transparent;
  color: ${({ theme }) => theme.fc};
`;

const Heading = styled.h1`
  font-size: ${({ size }) => size + "px"};
  margin-top: 0;
`;

const Headings = styled.div`
  color: ${({ theme }) => theme.fc};
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 25px;
  z-index: 55;
  width: 30%;
  padding: 30px;
  display: flex;
  flex-direction: column;
  left: 35%;

  gap: 20px;
  border-radius: 25px;
  max-height: 80vh;
  overflow: hidden;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.bgs};

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
    border: 1px solid black;
  }

  @media (max-width: 500px) {
    left: 5%;
    width: 90vw;
  }
`;

const MainContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 55;
  overflow: hidden;
`;

const CloseButton = styled.div`
  color: ${({ theme }) => theme.fc};
  position: absolute;
  top: 30px;
  color: #fff;
  cursor: pointer;
  right: 30px;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${({ backgroundColor }) =>
    backgroundColor ? backgroundColor : "#303030b8"};

  z-index: 5;
  height: 100vh;
  backdrop-filter: blur(25px);
  width: 100vw;
`;

const ButtonIcon = styled.div`
  margin-right: ${({ gap }) => (gap ? gap : "7px")};
  display: flex;
  justify-content: center;
  align-items: center;
`;

function DynamicForm({ formData, setFormData, background }) {
  let [allValues, setValues] = useState({});

  if (!formData) return [];

  let headingWidgets = [];
  let inputWidgets = [];

  let buttonWidgets = [];

  function inputChanged(e) {
    let name = e.target.dataset.name;
    let value = e.target.value;
    let newValues = { ...allValues };
    newValues[name] = value;
    setValues(newValues);
  }

  function buttonClicked(e, callback) {
    let name = e.target.dataset.name;

    callback({ inputValues: allValues, buttonName: name });
  }

  processElements("input", formData.inputs);
  processElements("heading", formData.headings);
  processElements("button", formData.buttons);

  function processElements(type, elements) {
    if (!elements) return;
    for (let elementData of elements) {
      if (type == "heading") {
        let size = 15;
        let text = "";

        if (typeof elementData == "string") {
          text = elementData;
        } else {
          size = elementData.size;
          text = elementData.text;
        }

        headingWidgets.push(<Heading size={size}>{text}</Heading>);
      } else if (type == "input") {
        let name,
          placeholer = "";

        if (typeof elementData == "string") {
          name = elementData;
          placeholer = elementData;
        } else {
          name = elementData.name;
          placeholer = elementData.placeholer;
        }

        let value = allValues[name];
        if (typeof value == "undefined") value = "";

        inputWidgets.push(
          <Input
            onChange={inputChanged}
            placeholder={placeholer}
            data-name={name}
            value={value}
          ></Input>
        );
      } else if (type == "button") {
        let icon = null;

        if (elementData.icon) {
          icon = (
            <ButtonIcon gap={elementData.gap}>{elementData.icon}</ButtonIcon>
          );
        }

        buttonWidgets.push(
          <Button
            onClick={(e) => {
              buttonClicked(e, elementData.onClick);
            }}
            data-name={elementData.name}
          >
            {[icon, elementData.name]}
          </Button>
        );
      }
    }
  }

  function closeButton() {
    let settings = formData.settings;
    console.log(settings);
    if (!settings) return setFormData(null);

    if (settings.disableCloseButton) return;

    if (setFormData) setFormData(null);
  }

  let mainContent = [
    <Headings key="headings">{headingWidgets}</Headings>,
    <Inputs key="inputs">{inputWidgets}</Inputs>,
    <Buttons key="buttons">{buttonWidgets}</Buttons>,
  ];

  let theme = { bgs: "#111", bg: "#222", fc: "#fff" };

  let clsButton = (
    <CloseButton onClick={closeButton}>
      <VscClose />
    </CloseButton>
  );

  return (
    <ThemeProvider theme={theme}>
      <MainContainer>
        <Container>
          {formData.loading ? (
            <BarLoader height={4} color="#fff" width={"100%"} />
          ) : (
            [mainContent, clsButton]
          )}
        </Container>
        <Background {...background} onClick={closeButton} />
      </MainContainer>
    </ThemeProvider>
  );
}

export default DynamicForm;
