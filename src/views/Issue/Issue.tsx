import React, { useState, useEffect, useRef } from "react";
import { useQueryClient } from "react-query";
import {
  TouchableWithoutFeedback,
  Keyboard,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Box,
  Input,
  Select,
  Icon,
  VStack,
  Button,
  useToast,
  FormControl,
  Text,
  Tag,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";

import { getDataFromQR } from "../../utils/qr";
import LoadingScreen from "../../components/LoadingScreen";
import AppScanner from "../../components/AppScanner";
import AppAlert from "../../components/AppAlert";
import { useSelector } from "react-redux";
import { setAuth, selectAuth } from "../../contexts/slices/authSlice";

import {
  useIssue,
  useIssueItem,
  useExecIssueTransactions,
  useUpdateIssue,
  useCreateIssue,
  useStockBalQrCode,
} from "../../hooks/useIssue";

import { styles } from "../styles";

const Issue: React.FC = () => {
  const { authResult } = useSelector(selectAuth);
  const locationTeam = authResult.data.GroupName;
  const permissionPass = authResult.data.permission.filter(
    (item: any) => item.MenuId === "IssueMobile"
  );

  const initOrder = { Withdraw_ID: "" };
  const initOrderQuo = { Quotation_No: "" };
  const initItem = { QR_NO: "", Tag_ID: "" };
  const initErrors = {};

  const toast = useToast();
  const queryClient = useQueryClient();

  const [camera, setCamera] = useState<boolean>(false);

  const [order, setOrder] = useState<any>(initOrder);
  const [orderQuo, setOrderQuo] = useState<any>(initOrderQuo);
  const [item, setItem] = useState<any>(initItem);
  const [errors, setErrors] = useState<any>(initErrors);

  const [disabledButton, setDisabledButton] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<any>([]);
  const refInput = useRef<any>(null);
  const refScanner = useRef<boolean>(false);
  const [dataLocation, setLocation] = useState<any>(null);
  const [dataQuotation, setQuotation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const {
    isLoading: orderIsLoading,
    isFetching,
    isError,
    data: orderData,
    refetch: orderRefetch,
    status,
    error,
  } = useIssue();

  const {
    isLoading: itemIsLoading,
    data: itemData,
    status: itemstatus,
    error: itemsError,
    mutate: getQuotationItem,
  } = useIssueItem();

  useEffect(() => {
    if (itemstatus === "success") {
      if (!itemData?.data || itemData?.data?.data?.length <= 0) {
        setDataSource([]);
      } else {
        setDataSource(itemData?.data.data);
      }
    } else if (itemsError === "error") {
      toast.show({
        render: () => (
          <AppAlert
            text={itemsError?.response?.data?.message || "error"}
            type="error"
          />
        ),
        placement: "top",
        duration: 3000,
      });
    }
  }, [itemstatus]);

  const {
    isLoading: transIsLoading,
    isError: transIsError,
    status: transStatus,
    error: transError,
    mutate: transMutate,
    data: transData,
  } = useExecIssueTransactions();

  const {
    isLoading: updateIsLoading,
    isError: updateIsError,
    status: updateStatus,
    error: updateError,
    mutate: updateMutate,
    data: updateData,
  } = useUpdateIssue();

  const {
    isLoading: createIsLoadingIssue,
    isError: createIsErrorIssue,
    error: createErrorIssue,
    status: createStatusIssue,
    mutate: createMutateIssue,
    data: createDataIssue,
  } = useCreateIssue();

  const {
    isLoading: StockBalQrCodeIsLoading,
    isError: StockBalQrCodeIsError,
    data: StockBalQrCode,
    status: StockBalQrCodeStatus,
    error: StockBalQrCodeError,
    mutate: getStockBalQrCode,
  } = useStockBalQrCode();

  useEffect(() => {
    if (!dataSource || dataSource.length <= 0) {
      console.log("ไม่มี DATA");
    } else {
      handleCheckScan();
    }
  }, [dataSource]);

  const handleChangeOrder = (value: string) => {
    setLocation(null);
    setQuotation(null);
    if (!value || value == undefined) {
      return;
    } else {
      clearState("Error");
      const data = value.split("|");
      setOrder({ ...order, Withdraw_ID: data[0] });
      setOrderQuo({ ...orderQuo, Quotation_No: value });
      getQuotationItem(data[0]);
      setLocation(data[2]);
      setQuotation(data[4]);
    }
  };


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
    });

    refScanner.current = true;
    
  };


  useEffect(() => {
    if (refScanner.current && validateErrors()) {
      setLoading(true);
      if (permissionPass[0].Approved2 == 1) {
        //ยิงข้ามได้ สิทธิ์สูงsd
        let _dataSource = [...dataSource];
        const search = (sss: any) => sss.QR_NO === item.QR_NO;

        const indexFind = _dataSource.findIndex(search);
        if (indexFind === -1) {
          //ไม่มี QR Code นี้ แต่สามารถเพิ่มได้

          getStockBalQrCode({ QR_NO: item.QR_NO, Location_ID: dataLocation });
        } else {
          getStockBalQrCode({ QR_NO: item.QR_NO, Location_ID: dataLocation });
        }
      } else {
        let _dataSource = [...dataSource];

        const search = (sss: any) => sss.QR_NO === item.QR_NO;

        const indexFind = _dataSource.findIndex(search);

        if (indexFind === -1) {
          //ไม่มี QR Code นี้
          toast.show({
            render: () => (
              <AppAlert
                text={`QR Code นี้ ไม่อยู่ใน Quotation นี้` || "error"}
                type="error"
              />
            ),
            placement: "top",
            duration: 3000,
          });
          setLoading(false);
        } else {
          const newData = [...dataSource];
          const item = newData[indexFind];

          const new_value = {
            Withdraw_No: item.Withdraw_No,
            QR_NO: item.QR_NO,
            ITEM_ID: item.ITEM_ID,
            ITEM_CODE: item.ITEM_CODE,
            ITEM_DESCRIPTION: item.ITEM_DESCRIPTION,
            Product_ID: item.Product_ID,
            Product_DESCRIPTION: item.Product_DESCRIPTION,
            Qty: item.Qty,
            Bal_QTY: item.Bal_QTY,
            ReserveQTY: item.ReserveQTY,
            LOT: item.LOT,
            Status: 1,
            Location_ID: item.Location_ID,
          };

          newData.splice(indexFind, 1, {
            ...item,
            ...new_value,
          });
          setDataSource(newData);
          toast.show({
            render: () => (
              <AppAlert text={`Scan เรียบร้อย` || "success"} type="success" />
            ),
            placement: "top",
            duration: 2000,
          });
          setLoading(false);
        }
      }
    }
  }, [item]);

  useEffect(() => {
    if (StockBalQrCodeStatus === "success") {
      if (!StockBalQrCode?.data || StockBalQrCode?.data?.data?.length <= 0) {
        toast.show({
          render: () => (
            <AppAlert
              text={`ไม่มีของใน stock หรืออยู่คนละ Team` || "error"}
              type="error"
            />
          ),
          placement: "top",
          duration: 2000,
        });
        setLoading(false);
      } else {
        let _dataSource = [...dataSource];

        const search = (sss: any) =>
          sss.QR_NO === StockBalQrCode?.data?.data[0].QR_NO;

        const indexFind = _dataSource.findIndex(search);

        if (indexFind === -1) {
          //ไม่มี QR Code นี้ แต่สามารถเพิ่มได้ เนื่องจากมีสิทธิ์
          const new_value1 = {
            Withdraw_No: StockBalQrCode?.data?.data[0].Withdraw_No,
            QR_NO: StockBalQrCode?.data?.data[0].QR_NO,
            ITEM_ID: StockBalQrCode?.data?.data[0].ITEM_ID,
            ITEM_CODE: StockBalQrCode?.data?.data[0].ITEM_CODE,
            ITEM_DESCRIPTION: StockBalQrCode?.data?.data[0].ITEM_DESCRIPTION,
            Product_ID: StockBalQrCode?.data?.data[0].Product_ID,
            Product_DESCRIPTION:
              StockBalQrCode?.data?.data[0].Product_DESCRIPTION,
            Qty: StockBalQrCode?.data?.data[0].Qty,
            Bal_QTY: StockBalQrCode?.data?.data[0].Bal_QTY,
            ReserveQTY: StockBalQrCode?.data?.data[0].ReserveQTY,
            LOT: StockBalQrCode?.data?.data[0].LOT,
            Status: 1,
            Location_ID: StockBalQrCode?.data?.data[0].Location_ID,
          };
          _dataSource.push(new_value1);
          setDataSource(_dataSource);
          toast.show({
            render: () => (
              <AppAlert text={`Scan เรียบร้อย` || "success"} type="success" />
            ),
            placement: "top",
            duration: 2000,
          });
          setLoading(false);
        } else {
          //ถ้าไม่มีสิทธิ์ scan ได้อย่างเดียว
          const newData = [...dataSource];
          const item = newData[indexFind];

          const new_value = {
            Withdraw_No: item.Withdraw_No,
            QR_NO: item.QR_NO,
            ITEM_ID: item.ITEM_ID,
            ITEM_CODE: item.ITEM_CODE,
            ITEM_DESCRIPTION: item.ITEM_DESCRIPTION,
            Product_ID: item.Product_ID,
            Product_DESCRIPTION: item.Product_DESCRIPTION,
            Qty: item.Qty,
            Bal_QTY: item.Bal_QTY,
            ReserveQTY: item.ReserveQTY,
            LOT: item.LOT,
            Status: 1,
            Location_ID: item.Location_ID,
          };

          newData.splice(indexFind, 1, {
            ...item,
            ...new_value,
          });
          setDataSource(newData);
          toast.show({
            render: () => (
              <AppAlert text={`Scan เรียบร้อย` || "success"} type="success" />
            ),
            placement: "top",
            duration: 2000,
          });
          setLoading(false);
        }
      }
    } else if (StockBalQrCodeStatus === "error") {
      toast.show({
        render: () => (
          <AppAlert
            text={StockBalQrCodeError?.response?.data?.message || "error"}
            type="error"
          />
        ),
        placement: "top",
        duration: 3000,
      });
      setLoading(false);
    }
  }, [StockBalQrCodeStatus]);

  const handleSubmit = () => {
    var newData = dataSource.filter(function (element: any) {
      return element.Status == 1;
    });
     
      setLoading(true);
      createMutateIssue({ Quotation_No: dataQuotation,Item: newData });
    
  };

  useEffect(() => {
    if (createStatusIssue === "success") {
      toast.show({
        render: () => (
          <AppAlert
            text={createDataIssue?.data?.message || "success"}
            type="success"
          />
        ),
        placement: "top",
        duration: 2000,
      });
      setDataSource([]);
      clearState("All");
      setLoading(false);
    } else if (createStatusIssue === "error") {
      toast.show({
        render: () => (
          <AppAlert
            text={createErrorIssue?.response?.data?.message || "error"}
            type="error"
          />
        ),
        placement: "top",
        duration: 3000,
      });
      setLoading(false);
    }
  }, [createStatusIssue]);

  useEffect(() => {
    return () => {
      clearState("All");
      queryClient.clear();
    };
  }, []);

  const handleCheckScan = () => {
    var countfiltered = dataSource.filter(function (element: any) {
      return element.Status == 1;
    }).length;

    if (countfiltered > 0) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  };

  const validateErrors = () => {
    refScanner.current = false;
    if (!order.Withdraw_ID) {
      setErrors({ ...errors, Withdraw_ID: "Quotation No is required" });
      clearState("Item");
      return false;
    }

    if (
      itemData.data.data.filter((value: any) => {
        return (
          parseInt(value.Item_ID) === parseInt(item.Item_ID) &&
          parseInt(value.Request) === parseInt(value.Total)
        );
      }).length > 0
    ) {
      setErrors({ ...errors, QR_NO: "This Item Request Completed" });
      clearState("Item");
      return false;
    }

    if (!item.QR_NO || !item.Tag_ID) {
      setErrors({ ...errors, QR_NO: "Invalid QR format" });
      clearState("Item");
      return false;
    }

    return true;
  };

  const clearState = (type: string) => {
    if (type === "All") {
      setOrder(initOrder);
      setOrderQuo(initOrderQuo);
      setItem(initItem);
      setErrors(initErrors);
      setDisabledButton(true);
    } else if (type === "Item") {
      setItem(initItem);
    } else if (type === "Order") {
      setOrder(initOrder);
    } else {
      setErrors(initErrors);
    }
  };

  useEffect(() => {

  }, [order]);

  useEffect(() => {
    if (transStatus === "success") {
      toast.show({
        render: () => (
          <AppAlert
            text={transData?.data?.message || "success"}
            type="success"
          />
        ),
        placement: "top",
        duration: 2000,
      });
    } else if (transStatus === "error") {
      toast.show({
        render: () => (
          <AppAlert
            text={transError?.response?.data?.message || "error"}
            type="error"
          />
        ),
        placement: "top",
        duration: 3000,
      });
    }

    return () => {
      refScanner.current = false;
      clearState("Item");
    };
  }, [transStatus]);

  useEffect(() => {
    if (updateStatus === "success") {
      toast.show({
        render: () => (
          <AppAlert
            text={updateData?.data?.message || "success"}
            type="success"
          />
        ),
        placement: "top",
        duration: 2000,
      });
      clearState("All");
    } else if (updateStatus === "error") {
      toast.show({
        render: () => (
          <AppAlert
            text={updateError?.response?.data?.message || "error"}
            type="error"
          />
        ),
        placement: "top",
        duration: 3000,
      });
    }

    return () => {
      refScanner.current = false;
    };
  }, [updateStatus]);

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
            <LoadingScreen show={createIsLoadingIssue || transIsLoading || loading} />
            <VStack space={10} p={5}>
              <FormControl isRequired isInvalid={"Withdraw_ID" in errors}>
                {locationTeam === "Administrator" ? (
                  <Select
                    h={50}
                    size={20}
                    width={"100%"}
                    accessibilityLabel="Choose Quotation"
                    placeholder="QUOTATION NO."
                    selectedValue={orderQuo?.Quotation_No || ""}
                    onValueChange={(value) => handleChangeOrder(value)}
                  >
                    {orderData?.data?.data?.map((value: any) => {
                      return (
                        <Select.Item
                          key={value.QuotationValue}
                          shadow={2}
                          label={value.Quotation_Customer}
                          value={value.QuotationValue}
                        />
                      );
                    })}
                  </Select>
                ) : (
                  <Select
                    h={50}
                    size={20}
                    width={"100%"}
                    accessibilityLabel="Choose Quotation"
                    placeholder="QUOTATION NO."
                    selectedValue={orderQuo?.Quotation_No || ""}
                    onValueChange={(value) => handleChangeOrder(value)}
                  >
                    {orderData?.data?.data
                      .filter((value: any) => value.Location === locationTeam)
                      .map((value: any) => {
                        return (
                          <Select.Item
                            key={value.Withdraw_ID}
                            shadow={2}
                            label={value.Quotation_Customer}
                            value={value.QuotationValue}
                          />
                        );
                      })}
                  </Select>
                )}
                {"Withdraw_ID" in errors && (
                  <FormControl.ErrorMessage>
                    {errors.Withdraw_ID}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
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
                  value={item?.QR_NO || ""}
                  onChangeText={(value) => handleScanner(value)}
                />
                {"QR_NO" in errors && (
                  <FormControl.ErrorMessage>
                    {errors.QR_NO}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{ height: "50%" }}
                refreshControl={
                  <RefreshControl
                    refreshing={itemIsLoading}
                    onRefresh={async () => {
                      await orderRefetch();
                      // await itemRefetch();
                    }}
                  />
                }
              >
                <TouchableOpacity activeOpacity={1}>
                  <DataTable>
                    <DataTable.Header>
                      <DataTable.Title style={styles.table_title_30}>
                        <Text bold>QR CODE</Text>
                      </DataTable.Title>
                      <DataTable.Title style={styles.table_title_54}>
                        <Text bold>PART</Text>
                      </DataTable.Title>
                      <DataTable.Title numeric style={styles.table_title_18}>
                        <Text bold>QTY</Text>
                      </DataTable.Title>
                      <DataTable.Title numeric style={styles.table_title_18}>
                        <Text bold>STATUS</Text>
                      </DataTable.Title>
                    </DataTable.Header>
                    {dataSource?.map(
                      (value: any, key: number, color: any, text1: any) => {
                        {
                          if (value.Status == "0") {
                            color = "red.400";
                            text1 = "Wait";
                          } else if (value.Status == "1") {
                            color = "green.400";
                            text1 = "Scan";
                          } else {
                            color = "warning";
                          }
                        }
                        return (
                          <DataTable.Row key={key}>
                            <DataTable.Title style={styles.table_title_30}>
                              {value.QR_NO}
                            </DataTable.Title>
                            <DataTable.Title style={styles.table_title_54}>
                              {value.ITEM_CODE}
                            </DataTable.Title>
                            <DataTable.Cell
                              numeric
                              style={styles.table_title_18}
                            >
                              {value.Qty}
                            </DataTable.Cell>
                            <DataTable.Cell
                              numeric
                              style={styles.table_title_18}
                            >
                              <Text bold color={color}>
                                {text1}
                              </Text>
                            </DataTable.Cell>
                          </DataTable.Row>
                        );
                      }
                    ) || (
                      <DataTable.Row>
                        <DataTable.Title>No Data</DataTable.Title>
                      </DataTable.Row>
                    )}
                  </DataTable>
                </TouchableOpacity>
              </ScrollView>
              <Button
                backgroundColor="green.600"
                leftIcon={
                  <Icon as={<MaterialIcons name="check" />} size="sm" />
                }
                isDisabled={disabledButton}
                onPress={handleSubmit}
              >
                SAVE
              </Button>
            </VStack>
          </Box>
        </TouchableWithoutFeedback>
      ) : (
        <AppScanner handleScanner={handleScanner} />
      )}
    </>
  );
};

export default Issue;
