import React from "react";
import { StyleSheet } from "react-native";
import { VStack, Heading, Spinner } from "native-base";

const LoadingScreen: React.FC<any> = ({ show }) => {
  return (
    <>
      {show && (
        <VStack space={5} style={styles.loading}>
          <Spinner size="lg" />
          <Heading color="primary.500" fontSize="md">Loading...</Heading>
        </VStack>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loading: {
    backgroundColor: "#fff",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
});
export default LoadingScreen;
