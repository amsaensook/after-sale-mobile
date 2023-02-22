import React from "react";
import { TouchableWithoutFeedback, Keyboard, Dimensions } from "react-native";
import { Text, Icon, VStack, Center } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

const Error404: React.FC = () => {
  const windowWidth = Dimensions.get("window").width;
  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Center flex={1} width={windowWidth}>
          <VStack space={2}>
            <Center>
              <Icon
                color="coolGray.400"
                as={<MaterialIcons name="warning" />}
                size="6xl"
              />
              <Text color="coolGray.400" fontSize="md">
                Data Not Found
              </Text>
            </Center>
          </VStack>
        </Center>
      </TouchableWithoutFeedback>
    </>
  );
};

export default Error404;
