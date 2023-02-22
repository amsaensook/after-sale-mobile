import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "react-query";
import {
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  RefreshControl,
} from "react-native";
import {
  Box,
  Input,
  Icon,
  VStack,
  useToast,
  FormControl,
  Text,
  Divider,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

import { useCheckPart } from "../../hooks/useCheckPart";

import { getDataFromQR } from "../../utils/qr";
import LoadingScreen from "../../components/LoadingScreen";
import AppScanner from "../../components/AppScanner";
import AppAlert from "../../components/AppAlert";

const CheckPart: React.FC = () => {
  const initItem = { QR_NO: "" };
  const initItemDetail = {};
  const initErrors = {};

  const toast = useToast();
  const queryClient = useQueryClient();

  const [camera, setCamera] = useState<boolean>(false);

  const [item, setItem] = useState<any>(initItem);
  const [itemDetail, setItemDetail] = useState<any>(initItemDetail);
  const [errors, setErrors] = useState<any>(initErrors);

  const refInput = useRef<any>(null);
  const refScanner = useRef<boolean>(false);

  const {
    isLoading: itemIsLoading,
    status: itemStatus,
    error: itemError,
    data: itemData,
    refetch: itemRefetch,
  } = useCheckPart({
    QR_NO: item?.QR_NO || "",
  });

  const handleScanner = useCallback(
    (value: any) => {
      setCamera(false);

      if (!value) {
        return;
      }

      clearState("Error");

      const qr = getDataFromQR(value);

      setItem({ ...item, QR_NO: qr?.QR_NO || "" });

      refScanner.current = true;
    },
    [item]
  );

  const validateErrors = useCallback(() => {
    refScanner.current = false;

    if (!item.QR_NO) {
      setErrors({ ...errors, QR_NO: "Invalid QR format" });
      clearState("Item");
      return false;
    }

    if (!itemData.data.status) {
      setErrors({ ...errors, QR_NO: `${itemData.data.message}` });
      clearState("Item");
      return false;
    }

    return true;
  }, [item, itemData, errors]);

  const clearState = useCallback((type: string) => {
    if (type === "All") {
      setItem(initItem);
      setItemDetail(initItemDetail);
      setErrors(initErrors);
    } else if (type === "Item") {
      setItem(initItem);
      setItemDetail(initItemDetail);
    } else {
      setErrors(initErrors);
    }
  }, []);

  useEffect(() => {
    itemRefetch();
  }, [item]);

  useEffect(() => {
    if (!itemData) {
      return;
    }

    if (refScanner.current && validateErrors()) {
      setItemDetail(itemData.data.data);
    }
  }, [itemData]);

  useEffect(() => {
    if (itemStatus === "error") {
      toast.show({
        render: () => (
          <AppAlert
            text={itemError?.response?.data?.message || "error"}
            type="error"
          />
        ),
        placement: "top",
        duration: 3000,
      });
      clearState("Item");
      refScanner.current = false;
    }
  }, [itemStatus]);

  useEffect(() => {
    refInput?.current?.focus();
  });

  useEffect(() => {
    return () => {
      clearState("All");
      queryClient.clear();
    };
  }, []);

  return (
    <>
      {!camera ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <Box flex={1}>
            <LoadingScreen show={itemIsLoading} />
            <VStack space={10} p={5}>
              <FormControl isRequired isInvalid={"QR_NO" in errors}>
                <Input
                  h={50}
                  size={20}
                  ref={refInput}
                  showSoftInputOnFocus={false}
                  variant="underlined"
                  p={2}
                  placeholder="SCAN QR"
                  InputRightElement={
                    <Icon
                      size={35}
                      color={"primary.600"}
                      as={<MaterialIcons name="qr-code-scanner" />}
                      onPress={() => setCamera(true)}
                    />
                  }
                  autoFocus
                  value={""}
                  onChangeText={(value) => handleScanner(value)}
                />
                {"QR_NO" in errors && (
                  <FormControl.ErrorMessage>
                    {errors.QR_NO}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
              <ScrollView
                style={{ height: "80%" }}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                  <RefreshControl
                    refreshing={itemIsLoading}
                    onRefresh={() => itemRefetch()}
                  />
                }
              >
                <Text fontSize="md">
                  <Text style={styles.textHeader}>QR :{`   `}</Text>
                  <Text style={styles.textContent}>
                    {itemDetail?.QR_NO || ""}
                  </Text>
                </Text>
                <Divider style={styles.divider} />
                <Text fontSize="md">
                  <Text style={styles.textHeader}>ORDER NO :{`   `}</Text>
                  <Text style={styles.textContent}>
                    {itemDetail?.Rec_NO || ""}
                  </Text>
                </Text>
                <Divider style={styles.divider} />
                <Text fontSize="md">
                  <Text style={styles.textHeader}>ORDER DATE :{`   `}</Text>
                  <Text style={styles.textContent}>
                    {itemDetail?.Rec_Datetime || ""}
                  </Text>
                </Text>
                <Divider style={styles.divider} />
                <Text fontSize="md">
                  <Text style={styles.textHeader}>PRODUCT :{`   `}</Text>
                  <Text style={styles.textContent}>
                    {itemDetail?.ITEM_CODE || ""}
                  </Text>
                </Text>
                <Divider style={styles.divider} />
                <Text fontSize="md">
                  <Text style={styles.textHeader}>PRODUCT TYPE :{`   `}</Text>
                  <Text style={styles.textContent}>
                    {itemDetail?.Product_Des || ""}
                  </Text>
                </Text>
                <Divider style={styles.divider} />
                <Text fontSize="md">
                  <Text style={styles.textHeader}>LOT :{`   `}</Text>
                  <Text style={styles.textContent}>
                    {itemDetail?.LOT || ""}
                  </Text>
                </Text>
                <Divider style={styles.divider} />
                <Text fontSize="md">
                  <Text style={styles.textHeader}>CREATE BY :{`   `}</Text>
                  <Text style={styles.textContent}>
                    {itemDetail?.Create_By || ""}
                  </Text>
                </Text>
                <Divider style={styles.divider} />
                <Text fontSize="md">
                  <Text style={styles.textHeader}>CREATE DATE :{`   `}</Text>
                  <Text style={styles.textContent}>
                    {itemDetail?.Create_Date || ""}
                  </Text>
                </Text>
                <Divider style={styles.divider} />
                <Text fontSize="md">
                  <Text style={styles.textHeader}>STATUS :{`   `}</Text>
                  <Text style={styles.textContent}>
                    {itemDetail?.ItemStatus_Des || ""}
                  </Text>
                </Text>
                <Divider style={styles.divider} />
                <Text fontSize="md">
                  <Text style={styles.textHeader}>CUSTOMER :{`   `}</Text>
                  <Text style={styles.textContent}>
                    {itemDetail?.Customer_Name || ""}
                  </Text>
                </Text>
                <Divider style={styles.divider} />
                <Text fontSize="md">
                  <Text style={styles.textHeader}>QUOTATION No :{`   `}</Text>
                  <Text style={styles.textContent}>
                    {itemDetail?.Quotation_No || ""}
                  </Text>
                </Text>
                <Divider style={styles.divider} />
                <Text fontSize="md">
                  <Text style={styles.textHeader}>TEAM :{`   `}</Text>
                  <Text style={styles.textContent}>
                    {itemDetail?.Team || ""}
                  </Text>
                </Text>
                <Divider style={styles.divider} />
              </ScrollView>
            </VStack>
          </Box>
        </TouchableWithoutFeedback>
      ) : (
        <AppScanner handleScanner={handleScanner} />
      )}
    </>
  );
};

const styles: any = {
  divider: {
    marginTop: 10,
    marginBottom: 10,
  },
  textHeader: {
    fontWeight: "bold",
  },
  textContent: {
    color: "gray",
  },
};

export default CheckPart;
