import React from "react";
import { StyleSheet, Dimensions, SafeAreaView } from "react-native";
import { FlatList, Box, Pressable } from "native-base";

const windowWidth = Dimensions.get("window").width;

const GridList: React.FC<any> = ({ navigation, col, items }) => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        contentContainerStyle={styles.grid}
        numColumns={col}
        data={items}
        keyExtractor={(item: any) => item.Menu_Index}
        renderItem={({ item }: any) => {
          return (
            <Pressable onPress={() => navigation.navigate(item.MenuId)}>
              {({ isHovered, isPressed }) => {
                return (
                  <Box
                    pt={10}
                    pb={10}
                    m={2}
                    w={(windowWidth / col) * 0.9}
                    bg={
                      isPressed
                        ? "primary.700"
                        : isHovered
                        ? "primary.700"
                        : "primary.500"
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
                      color: "warmGray.50",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}
                  >
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
