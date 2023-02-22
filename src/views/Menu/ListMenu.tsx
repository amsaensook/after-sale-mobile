import React from "react";
import { StyleSheet, Dimensions, SafeAreaView } from "react-native";
import { FlatList, Box, Pressable, Icon, Center } from "native-base";
import { MaterialIcons, Foundation } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;

const GridList: React.FC<any> = ({ navigation, col, items }) => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        contentContainerStyle={styles.grid}
        numColumns={col}
        data={items}
        keyExtractor={(item: any) => item.Menu_Index}
        bg={"white"}
        renderItem={({ item }: any) => {
          return (
            <Pressable onPress={() => navigation.navigate(item.MenuId)}>
              {({ isHovered, isPressed }) => {
                return (
                  <Box
                    pt={5}
                    pb={5}
                    m={2}
                    w={(windowWidth / col) * 0.88}
                    bg={
                      isPressed
                        ? "gray.50"
                        : isHovered
                        ? "gray.50"
                        : "white"
                    }
                    rounded="md"
                    style={{
                      transform: [
                        {
                          scale: isPressed ? 0.96 : 1,
                        },
                      ],
                    }}
                    _text={{
                      fontSize: "md",
                      fontWeight: "bold",
                      color: "coolGray.500",
                      textAlign: "center",
                    }}
                  >
                    <Center m={2}>
                      <Icon
                        ml={item.Icon == "clipboard-pencil" ? 5 : 0}
                        color={"blue.700"}
                        as={
                          item.Icon == "clipboard-pencil" ? (
                            <Foundation name={item.Icon} />
                          ) : (
                            <MaterialIcons name={item.Icon} />
                          )
                        }
                        size="5xl"
                      />
                    </Center>
                    {item.MenuName}
                  </Box>
                );
              }}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: windowWidth,
  },
  grid: {
    paddingTop: 10,
  },
});

export default GridList;
