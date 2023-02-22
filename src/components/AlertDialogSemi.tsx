import React, { useState, useRef, useEffect } from "react";
import {
  Center,
  Button,
  AlertDialog,
  Text,
  Input,
  HStack,
  FormControl,
  Icon,
  VStack,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import AppScanner from "../components/AppScanner";
import { getDataFromQR } from "../utils/qr";

const AlertDialogSemi: React.FC<any> = ({
  itemSemi,
  isOpenAlertDialogSemi,
  setIsOpenAlertDialogSemi,
  handleScannerSubmit,
}) => {
  const initItem = { QR_NO: "", Tag_ID: "", Item_ID: "", Series: "" };
  const initErrors = {};

  const onClose = () => setIsOpenAlertDialogSemi(false);
  const cancelRef = useRef(null);

  const [item, setItem] = useState<any>(initItem);
  const [errors, setErrors] = useState<any>(initErrors);
  const [camera, setCamera] = useState<boolean>(false);

  const refScanner = useRef<boolean>(false);
  const refInput = useRef<any>(null);

  const handleScanner = (value: any) => {
    setCamera(false);

    if (!value) {
      return;
    }

    clearState("Error");

    const qr = getDataFromQR(value);

    setItem({
      ...item,
      QR_NO: qr?.QR_NO || "",
      Tag_ID: qr?.Tag_ID || "",
      Item_ID: qr?.Item_ID || "",
      Series: qr?.Series || "",
    });

    refScanner.current = true;
  };

  const validateErrors = () => {
    refScanner.current = false;

    if (!item.Series) {
      setErrors({ ...errors, QR_NO: "Invalid QR series " });
      clearState("Item");
      return false;
    }

    if (
      (itemSemi.Series !== "BOX" && itemSemi.Series !== "WARE") ||
      (item.Series !== "BOX" && item.Series !== "WARE") ||
      item.Series === itemSemi.Series ||
      item.QR_NO !== itemSemi.QR_NO
    ) {
      setErrors({ ...errors, QR_NO: "Invalid QR semi between BOX and WARE" });
      clearState("Item");
      return false;
    }

    return true;
  };

  const clearState = (type: string) => {
    if (type === "All") {
      setItem(initItem);
      setErrors(initErrors);
    } else if (type === "Item") {
      setItem(initItem);
    } else {
      setErrors(initErrors);
    }
  };

  const handleScannerSubmitAlertDialogSemi = () => {
    handleScannerSubmit();
    onClose();
  };

  useEffect(() => {
    if (refScanner.current && validateErrors()) {
      refScanner.current = false;
      handleScannerSubmitAlertDialogSemi();
    }
  }, [item]);

  useEffect(() => {
    refInput?.current?.focus();
  });

  useEffect(() => {
    return () => {
      clearState("All");
    };
  }, []);

  return (
    <>
      {!camera ? (
        <Center>
          <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={isOpenAlertDialogSemi}
            onClose={onClose}
          >
            <AlertDialog.Content>
              <AlertDialog.CloseButton />
              <AlertDialog.Header>CONFIRM SCAN SEMI</AlertDialog.Header>
              <AlertDialog.Body>
                <VStack space={4}>
                  <Text>Scan QR code semi (BOX/WARE) for confirm issue.</Text>
                  <Text bold>
                    QR NO : <Text color={"blue.500"}>{itemSemi.QR_NO}</Text>
                  </Text>
                  <Text bold>
                    Series : <Text color={"amber.500"}>{itemSemi.Series}</Text>
                  </Text>
                </VStack>
                <HStack
                  flex={1}
                  alignItems="center"
                  justifyContent="center"
                  space={5}
                  mt={5}
                >
                  <FormControl isRequired isInvalid={"QR_NO" in errors}>
                    <Input
                      h={50}
                      size={20}
                      ref={refInput}
                      showSoftInputOnFocus={false}
                      variant="filled"
                      p={2}
                      placeholder={`SCAN QR SEMI (${
                        itemSemi.Series === "BOX" ? "WARE" : "BOX"
                      })`}
                      InputRightElement={
                        <Icon
                          size={35}
                          mr={2}
                          color={"primary.600"}
                          as={<MaterialIcons name="qr-code-scanner" />}
                          onPress={() => setCamera(true)}
                        />
                      }
                      autoFocus
                      value={/* item?.QR_NO || item?.Item_Code || */ ""}
                      onChangeText={(value) => handleScanner(value)}
                    />
                    {"QR_NO" in errors && (
                      <FormControl.ErrorMessage>
                        {errors.QR_NO}
                      </FormControl.ErrorMessage>
                    )}
                  </FormControl>
                </HStack>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button.Group space={2}>
                  <Button
                    variant="unstyled"
                    colorScheme="coolGray"
                    onPress={onClose}
                    ref={cancelRef}
                  >
                    CANCEL
                  </Button>
                </Button.Group>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog>
        </Center>
      ) : (
        <Center>
          <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={isOpenAlertDialogSemi}
          >
            <AlertDialog.Content>
              <AlertDialog.Header>CONFIRM SCAN SEMI</AlertDialog.Header>
              <AlertDialog.Body>
                <AppScanner handleScanner={handleScanner} />
              </AlertDialog.Body>
            </AlertDialog.Content>
          </AlertDialog>
        </Center>
      )}
    </>
  );
};

export default AlertDialogSemi;
