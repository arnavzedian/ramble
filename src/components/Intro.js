import Context from "../Context";

import { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import logo from "../logos/ramble.svg";
import addTab from "../controller/addTab";

let Container = styled.div`
  color: #fff;
`;

let Logo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 25px;
  align-items: center;
  width: 100%;
`;

let LogoImg = styled.img`
  height: 35px;
  object-fit: contain;
  width: 35px;
  margin-right: 15px;
`;

let LogoText = styled.div`
  font-size: 35px;
  font-weight: 900;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

let Hero = styled.div`
  margin-top: 75px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

let Heading = styled.h1`
  width: 80%;
  font-size: 75px;
  text-align: center;
  margin-bottom: 15px;
  font-family: Sanchez, Georgia, "Times New Roman", Times, serif;
  @media (max-width: 700px) {
    font-size: 25px;

    width: 90%;
  }
`;

let HeroButton = styled.h1`
  width: auto;
  font-family: Sanchez, Georgia, "Times New Roman", Times, serif;
  background-color: #fff;
  color: #111;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 100px;
  padding: 15px 25px;
  font-size: 15px;
`;

let Description = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  width: 62%;
  text-align: center;
  font-size: 25px;
  opacity: 0.5;

  @media (max-width: 700px) {
    font-size: 22px;
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
        <Heading>Fast minimal note taking</Heading>
        <Description>
          notes are stored locally so it’s fast & secure. Its minimal design is
          intended to keep you in the flow
        </Description>

        <HeroButton
          onClick={() => {
            addTab({ state, dispatch });
          }}
        >
          + NOTE
        </HeroButton>
      </Hero>
    </Container>
  );
}

export default Intro;
