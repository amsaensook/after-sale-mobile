import React from "react";
import { Container } from "native-base";
import { useSelector } from "react-redux";

import Error404 from "../Error404";

import { selectAuth } from "../../contexts/slices/authSlice";

import ListMenu from "./ListMenu";

const Menu: React.FC<any> = ({navigation}) => {
  
  const { authResult } = useSelector(selectAuth);

  return (
    <Container h="100%">
      { authResult?.data?.permission ?  <ListMenu items={authResult?.data?.permission.slice().sort((a:any, b:any) => a.Seq - b.Seq)} col={3} navigation={navigation} /> : <Error404/> }
    </Container>
  );
};

export default Menu;
