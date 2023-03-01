import React, { useState, useEffect, useRef } from 'react';
import { useQueryClient } from 'react-query';
import { TouchableWithoutFeedback, Keyboard, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { Box, Input, Select, Icon, VStack, Button, useToast, FormControl, Text, Tag } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { DataTable } from 'react-native-paper';

import { getDataFromQR } from '../../utils/qr';
import LoadingScreen from '../../components/LoadingScreen';
import AppScanner from '../../components/AppScanner';
import AppAlert from '../../components/AppAlert';
import { useSelector } from "react-redux";
import { setAuth, selectAuth } from "../../contexts/slices/authSlice";

import {
  useIssue,
  useIssueItem,
  useExecIssueTransactions,
  useUpdateIssue,
} from '../../hooks/useIssue';

import { styles } from '../styles';

const Issue: React.FC = () => {

  const { authResult } = useSelector(selectAuth);
  const locationTeam = authResult.data.GroupName;
  console.log('locationTeam2',locationTeam);


  const initOrder = { Withdraw_ID: '' };
  const initItem = { QR_NO: '', Tag_ID: '' };
  const initErrors = {};


  const toast = useToast();
  const queryClient = useQueryClient();

  const [camera, setCamera] = useState<boolean>(false);

  const [order, setOrder] = useState<any>(initOrder);
  const [item, setItem] = useState<any>(initItem);
  const [errors, setErrors] = useState<any>(initErrors);

  const [disabledButton, setDisabledButton] = useState<boolean>(true);

  const refInput = useRef<any>(null);
  const refScanner = useRef<boolean>(false);

  const { isLoading: orderIsLoading, isFetching, isError, data: orderData, refetch: orderRefetch, status, error } = useIssue();

  const {
    isLoading: itemIsLoading,
    data: itemData,
    refetch: itemRefetch,
  } = useIssueItem({
    Withdraw_ID: order?.Withdraw_ID || '',
  });

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

  const handleChangeOrder = (value: string) => {
    console.log('fuck =',value);
    if (!value || value == undefined) {
      return;
    }else{
      clearState('Error');
      const data = value.split("|");
      setOrder({ ...order, Withdraw_ID: data[0] });
      

      // getQuotationItem(data[0]);
    }

    

  };

  const handleScanner = (value: any) => {
    setCamera(false);

    if (!value) {
      return;
    }

    clearState('Error');

    const qr = getDataFromQR(value);

    setItem({
      ...item,
      QR_NO: qr?.QR_NO || "",
      Tag_ID: qr?.Tag_ID || "",
      Item_ID: qr?.Item_ID || "",
    });

    refScanner.current = true;
  };

  const handleSubmit = () => {
    updateMutate(order);
  };

  const calculateTotal = () => {
    const sumRequest =
      itemData?.data?.data?.reduce((previousValue: any, currentValue: any) => {
        return previousValue + parseInt(currentValue.Request);
      }, 0) || 0;

    const sumTotal =
      itemData?.data?.data?.reduce((previousValue: any, currentValue: any) => {
        return previousValue + parseInt(currentValue.Total);
      }, 0) || 0;

    if (parseInt(sumRequest) === parseInt(sumTotal) && parseInt(sumRequest) !== 0) {
      setDisabledButton(false);
    }
  };

  const validateErrors = () => {
    refScanner.current = false;

    if (!order.Withdraw_ID) {
      setErrors({ ...errors, Withdraw_ID: 'Receive Order is required' });
      clearState('Item');
      return false;
    }

    if (
      itemData.data.data.filter((value: any) => {
        return parseInt(value.Item_ID) === parseInt(item.Item_ID) && parseInt(value.Request) === parseInt(value.Total);
      }).length > 0
    ) {
      setErrors({ ...errors, QR_NO: 'This Item Request Completed' });
      clearState('Item');
      return false;
    }

    if (!item.QR_NO || !item.Tag_ID) {
      setErrors({ ...errors, QR_NO: 'Invalid QR format' });
      clearState('Item');
      return false;
    }

    return true;
  };

  const clearState = (type: string) => {
    console.log('type =',type);
    if (type === 'All') {
      setOrder(initOrder);
      setItem(initItem);
      setErrors(initErrors);
      setDisabledButton(true);
    } else if (type === 'Item') {
      setItem(initItem);
    } else if (type === 'Order') {
      setOrder(initOrder);
    } else {
      setErrors(initErrors);
    }
  };

  useEffect(() => {
    itemRefetch();
  }, [order]);

  useEffect(() => {
    if (refScanner.current && validateErrors()) {
      transMutate({ ...order, ...item });
    }
  }, [item]);

  useEffect(() => {
    calculateTotal();
  }, [itemData]);

  useEffect(() => {
    if (transStatus === 'success') {
      toast.show({
        render: () => <AppAlert text={transData?.data?.message || 'success'} type="success" />,
        placement: 'top',
        duration: 2000,
      });
    } else if (transStatus === 'error') {
      toast.show({
        render: () => <AppAlert text={transError?.response?.data?.message || 'error'} type="error" />,
        placement: 'top',
        duration: 3000,
      });
    }

    return () => {
      refScanner.current = false;
      clearState('Item');
    };
  }, [transStatus]);

  useEffect(() => {
    if (updateStatus === 'success') {
      toast.show({
        render: () => <AppAlert text={updateData?.data?.message || 'success'} type="success" />,
        placement: 'top',
        duration: 2000,
      });
      clearState('All');
    } else if (updateStatus === 'error') {
      toast.show({
        render: () => <AppAlert text={updateError?.response?.data?.message || 'error'} type="error" />,
        placement: 'top',
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
      clearState('All');
      queryClient.clear();
    };
  }, []);

  return (
    <>
      {!camera ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <Box flex={1}>
            <LoadingScreen show={updateIsLoading || transIsLoading} />
            <VStack space={10} p={5}>
              <FormControl isRequired isInvalid={'Withdraw_ID' in errors}>
              {
                locationTeam === 'Administrator' ?
                <Select
                  h={50}
                  size={20}
                  width={'100%'}
                  accessibilityLabel="Choose Quotation"
                  placeholder="QUOTATION NO."
                  selectedValue={order?.Withdraw_ID || ''}
                  onValueChange={(value) => handleChangeOrder(value)}
                >
                  {orderData?.data?.data?.map((value: any) => {
                    return <Select.Item key={value.Withdraw_ID} 
                                        shadow={2} label={value.Quotation_No + '-' + value.Customer_Name} 
                                        value={value.Withdraw_ID + "|" + value.Location_ID + "|" + value.Location+ "|" + value.Quotation_No} />;
                  })}
                </Select>
                : <Select
                      h={50}
                      size={20}
                      width={'100%'}
                      accessibilityLabel="Choose Quotation"
                      placeholder="QUOTATION NO."
                      selectedValue={order?.Withdraw_ID || ''}
                      onValueChange={(value) => handleChangeOrder(value)}
                    >
                       {orderData?.data?.data.filter(
                        (value: any) => 
                        value.Location === locationTeam
                        )
                        .map((value: any) => {
                        return <Select.Item key={value.Withdraw_ID} 
                                            shadow={2} label={value.Quotation_No + '-' + value.Customer_Name} 
                                            value={value.Withdraw_ID + "|" + value.Withdraw_No+ "|" + value.Location_ID + "|" + value.Location+ "|" + value.Quotation_No} />;
                      })}
                    </Select>
                  }
                {'Withdraw_ID' in errors && <FormControl.ErrorMessage>{errors.Withdraw_ID}</FormControl.ErrorMessage>}
              </FormControl>
              <FormControl isRequired isInvalid={'QR_NO' in errors}>
                <Input
                  h={50}
                  size={20}
                  ref={refInput}
                  showSoftInputOnFocus={false}
                  variant="underlined"
                  p={2}
                  placeholder="SCAN QR"
                  InputRightElement={
                    <Icon size={35} color={'primary.600'} as={<MaterialIcons name="qr-code-scanner" />} onPress={() => setCamera(true)} />
                  }
                  autoFocus
                  value={item?.QR_NO || ''}
                  onChangeText={(value) => handleScanner(value)}
                />
                {'QR_NO' in errors && <FormControl.ErrorMessage>{errors.QR_NO}</FormControl.ErrorMessage>}
              </FormControl>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{ height: '50%' }}
                refreshControl={
                  <RefreshControl
                    refreshing={itemIsLoading}
                    onRefresh={async () => {
                      await orderRefetch();
                      await itemRefetch();
                    }}
                  />
                }
              >
                <TouchableOpacity activeOpacity={1}>
                  <DataTable>
                    <DataTable.Header>
                      <DataTable.Title style={styles.table_title_20}>
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
                    {itemData?.data?.data?.map((value: any, key: number) => {
                      return (
                        <DataTable.Row key={key}>
                          <DataTable.Title style={styles.table_title_20}>{value.No}</DataTable.Title>
                          <DataTable.Cell style={styles.table_title_54}>{value.Part}</DataTable.Cell>
                          <DataTable.Cell numeric style={styles.table_title_18}>{value.Request}
                            {/* <Text bold color={'red.400'}>
                              {value.Request}
                            </Text> */}
                           
                            

                          </DataTable.Cell>
                          <DataTable.Cell numeric style={styles.table_title_18}>
                          <Tag color={'red.400'} >
                              {value.Request}
                          </Tag>
                          </DataTable.Cell>
                        </DataTable.Row>
                      );
                    }) || (
                      <DataTable.Row>
                        <DataTable.Title>No Data</DataTable.Title>
                      </DataTable.Row>
                    )}
                  </DataTable>
                </TouchableOpacity>
              </ScrollView>
              <Button
                backgroundColor="green.600"
                leftIcon={<Icon as={<MaterialIcons name="check" />} size="sm" />}
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