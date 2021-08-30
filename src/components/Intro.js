import Context from "../Context";

import { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import logo from "../logos/ramble.svg";
import addTab from "../controller/addTab";
import { MdAdd } from "react-icons/md";

let Container = styled.div`
  color: #fff;
`;

let Logo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 50px;
  align-items: center;
  width: 100%;
`;

let LogoImg = styled.img`
  height: 35px;
  object-fit: contain;
  width: 35px;
  margin-right: 15px;
  margin-bottom: -5px;
`;

let LogoText = styled.div`
  font-size: 45px;
  line-height: 0;
  font-weight: 900;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

let Hero = styled.div`
  margin-top: 180px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

let Heading = styled.h1`
  width: 80%;
  font-size: 60px;
  text-align: center;
  margin-bottom: 15px;
  font-family: "Playfair Display", Georgia, "Times New Roman", Times, serif;
  @media (max-width: 700px) {
    font-size: 20px;
    width: 90%;
  }
`;

let HeroButton = styled.div`
  width: auto;
  font-family: Sanchez, Georgia, "Times New Roman", Times, serif;
  background-color: #fff;
  color: #111 !important;
  border-radius: 55px;
  cursor: pointer;
  margin-top: 100px;
  padding: 15px 40px;
  font-size: 15px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
  transition: 0.15s ease-in-out;
  :hover {
    transform: scale(1.1);
  }
`;

let Span = styled.span`
  color: #222;
  font-size: 20px;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

let Circles = styled.div`
  width: 100vw;
  height: 100vw;
  border-radius: 100vw;
  border: 1px solid #fff;
  position: absolute;

  top: -25vw;
  pointer-events: none;
  transform: ${({ scale }) => (scale ? `scale(${scale})` : `scale(1)`)};
  opacity: ${({ opacity }) => (opacity ? opacity : 1)};

  @media (max-width: 700px) {
    display: none;
  }
`;

let Description = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  width: 80%;
  text-align: center;
  font-size: 20px;
  opacity: 0.5;

  @media (max-width: 700px) {
    font-size: 17px;
    width: 90%;
  }
`;

function Intro() {
  const { state, dispatch } = useContext(Context);

  return (
    <Container>
      <Logo>
        <LogoImg src={logo}></LogoImg>
        <LogoText>Ramble</LogoText>
      </Logo>

      <Hero>
        <Heading>FAST . MINIMAL . NOTE TAKING</Heading>
        <Description>
          Notes are stored locally so it’s fast & secure. Its minimal design is
          intended to keep you in the flow
        </Description>

        <HeroButton
          onClick={() => {
            addTab({ state, dispatch });
          }}
        >
          <MdAdd style={{ marginTop: "2px" }} size={20} /> <Span>Note</Span>
        </HeroButton>
      </Hero>

      <Circles scale={0.8} opacity={0.2} />
      <Circles scale={0.9} opacity={0.3} />
      <Circles scale={1} opacity={0.5} />
    </Container>
  );
}

export default Intro;
