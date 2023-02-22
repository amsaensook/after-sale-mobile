import React, { useState, useRef, useEffect } from "react";
import { Center, Button, AlertDialog, Text, Input, HStack } from "native-base";

const AppAlertDialog: React.FC<any> = ({
  isOpenAlertDialog,
  setIsOpenAlertDialog,
  handleSubmit,
}) => {
  const onClose = () => setIsOpenAlertDialog(false);

  const cancelRef = useRef(null);

  const [random, setRandom] = useState<any>(null);
  const [disabled, setDisabled] = useState<boolean>(true);

  const handleInputAlertDialog = (value: string) => {
    if (random === value) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const handleSubmitAlertDialog = () => {
    handleSubmit();
    onClose();
  };

  useEffect(() => {
    setRandom((Math.random() + 1).toString(36).substring(6));
  }, [isOpenAlertDialog]);

  return (
    <>
      <Center>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpenAlertDialog}
          onClose={onClose}
        >
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>CONFIRM ORDER</AlertDialog.Header>
            <AlertDialog.Body>
              <Text>The box in this order not complete.</Text>
              <Text>Please input text for confirmation.</Text>
              <HStack
                flex={1}
                alignItems="center"
                justifyContent="center"
                space={5}
                mt={5}
              >
                <Text bold>{random}</Text>
                <Input
                  placeholder="INPUT CONFIRM"
                  w="50%"
                  onChangeText={(text) => handleInputAlertDialog(text)}
                />
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
                <Button
                  isDisabled={disabled}
                  colorScheme="warning"
                  onPress={handleSubmitAlertDialog}
                >
                  CONFIRM
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Center>
    </>
  );
};

export default AppAlertDialog;
