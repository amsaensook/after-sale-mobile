import React from "react";
import { useNetInfo } from "@react-native-community/netinfo";
import AppContainer from "./src/components/AppContainer";
import AppConnection from "./src/components/AppConnection";

import Main from "./src/views/Main/Main";

const App: React.FC = () => {

  const NetInfo = useNetInfo();

  return (
    <AppContainer>
      <AppConnection isOpenTop={NetInfo.isConnected ? false : true} />
      <Main/>
    </AppContainer>
  );
};

export default App;
