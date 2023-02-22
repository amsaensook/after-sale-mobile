import React, { useState } from "react";
import { VStack, Alert, HStack, Text, IconButton } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

const AppAlert: React.FC<any> = ({ type, text }) => {
  const [show, setShow] = useState<boolean>(true);

  return (
    <>
      {show && (
        <Alert w="100%" variant="left-accent" colorScheme={type} status={type}>
          <VStack space={2} flexShrink={1} w="100%">
            <HStack
              flexShrink={1}
              space={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack space={2} flexShrink={1} alignItems="center">
                <Alert.Icon />
                <Text color="coolGray.800">{text}</Text>
              </HStack>
              <IconButton
                variant="unstyled"
                _focus={{
                  borderWidth: 0,
                }}
                _icon={{
                  as: MaterialIcons,
                  name: "close",
                  color: "coolGray.600",
                }}
                onPress={() => setShow(false)}
              />
            </HStack>
          </VStack>
        </Alert>
      )}
    </>
  );
};

export default AppAlert;
