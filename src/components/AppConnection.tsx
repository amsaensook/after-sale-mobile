import React from "react";
import { Text, Slide, Box, Alert } from "native-base";

const AppConnection: React.FC<any> = ({isOpenTop}) => {
  return (
    <Box h="32" w="300" position={"absolute"}>
      <Slide in={isOpenTop} placement="top">
        <Alert justifyContent="center" status="error">
          <Alert.Icon />
          <Text color="error.600" fontWeight="medium">
            No Internet Connection
          </Text>
        </Alert>
      </Slide>
    </Box>
  );
};

export default AppConnection;
