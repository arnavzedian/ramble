import Context from "../Context";

import { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import logo from "../logos/run.svg";

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
  font-family: sacramento;
`;

let Hero = styled.div`
  margin-top: 100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

let Heading = styled.h1`
  width: 100%;
  font-size: 45px;
  text-align: center;
`;

let Description = styled.div`
  font-family: sacramento;
  width: 100%;
  text-align: center;
  font-size: 35px;
  width: 38vw;
  opacity: 0.5;
`;

function Intro() {
  return (
    <Container>
      <Logo>
        <LogoImg src={logo}></LogoImg>
        <LogoText>run notes</LogoText>
      </Logo>

      <Hero>
        <Heading>Fast minimal note taking</Heading>
        <Description>
          notes are stored locally so it’s fast & secure. Its minimal design is
          intended to keep you in the flow
        </Description>
      </Hero>
    </Container>
  );
}

export default Intro;
