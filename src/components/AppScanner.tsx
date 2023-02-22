import React, { useState, useEffect } from "react";
import { Icon, Button, Text, View, Pressable } from "native-base";
import { StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { MaterialIcons } from "@expo/vector-icons";

const AppScanner: React.FC<any> = ({ handleScanner }) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    handleScanner(data);
    //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
      <Pressable onPress={() => handleScanner(null)}>
        {({ isHovered, isPressed }) => {
          return (
            <Icon
              mt={1}
              mb={5}
              as={<MaterialIcons name="cancel" />}
              size="6xl"
              color={
                isPressed
                  ? "danger.700"
                  : isHovered
                  ? "danger.700"
                  : "danger.500"
              }
              style={{
                marginTop: scanned ? "70%" : "120%",
                alignSelf: "center",
                transform: [
                  {
                    scale: isPressed ? 0.96 : 1,
                  },
                ],
              }}
            />
          );
        }}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});

export default AppScanner;
