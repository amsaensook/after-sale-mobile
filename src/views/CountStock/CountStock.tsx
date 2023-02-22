import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { TouchableWithoutFeedback, Keyboard, RefreshControl, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Box, Input, Select, Icon, VStack, Button, useToast, FormControl, Text } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { DataTable } from 'react-native-paper';

import { getDataFromQR } from '../../utils/qr';
import LoadingScreen from '../../components/LoadingScreen';
import AppScanner from '../../components/AppScanner';
import AppAlert from '../../components/AppAlert';

import { useCountStock, useCountStockItem, useExecCountStockItem, useUpdateCountStock } from '../../hooks/useCountStock';

import { styles } from '../styles';

const CountStock: React.FC = () => {
  const initOrder = { CountStock_ID: '' };
  const initItem = { QR_NO: '', Item_ID: '' };
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

  const { isLoading: orderIsLoading, isFetching, isError, data: orderData, refetch: orderRefetch, status, error } = useCountStock();

  const {
    isLoading: itemIsLoading,
    data: itemData,
    refetch: itemRefetch,
  } = useCountStockItem({
    CountStock_ID: order?.CountStock_ID || '',
  });

  const {
    isLoading: createIsLoading,
    isError: createIsError,
    status: createStatus,
    error: createError,
    mutate: createMutate,
    data: createData,
  } = useExecCountStockItem();

  const {
    isLoading: updateIsLoading,
    isError: updateIsError,
    status: updateStatus,
    error: updateError,
    mutate: updateMutate,
    data: updateData,
  } = useUpdateCountStock();

  const handleChangeOrder = useCallback(
    (value: string) => {
      if (!value) {
        return;
      }

      clearState('Error');

      setOrder({ ...order, CountStock_ID: value });
    },
    [order]
  );

  const handleScanner = useCallback(
    (value: any) => {
      setCamera(false);

      if (!value) {
        return;
      }

      clearState('Error');

      const qr = getDataFromQR(value);

      setItem({ ...item, QR_NO: qr?.QR_NO || '', Item_ID: qr?.Item_ID || '' });

      refScanner.current = true;
    },
    [item]
  );

  const handleSubmit = useCallback(() => {
    Alert.alert('Alert', 'Confirm Count Stock ?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          updateMutate(order);
        },
      },
    ]);
  }, [order]);

  const calculateTotal = useCallback(() => {
    const sumActual =
      itemData?.data?.data?.reduce((previousValue: any, currentValue: any) => {
        return previousValue + parseInt(currentValue.Actual);
      }, 0) || 0;

    const sumBalance =
      itemData?.data?.data?.reduce((previousValue: any, currentValue: any) => {
        return previousValue + parseInt(currentValue.Balance);
      }, 0) || 0;

    if (parseInt(sumActual) <= parseInt(sumBalance) && parseInt(sumActual) !== 0) {
      setDisabledButton(false);
    }
  }, [itemData]);

  const validateErrors = useCallback(() => {
    refScanner.current = false;

    if (!order.CountStock_ID) {
      setErrors({ ...errors, CountStock_ID: 'Count Stock Order is required' });
      clearState('Item');
      return false;
    }

    if (!item.QR_NO || !item.Item_ID) {
      setErrors({ ...errors, QR_NO: 'Invalid QR format' });
      clearState('Item');
      return false;
    }

    return true;
  }, [order, item]);

  const clearState = useCallback((type: string) => {
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
  }, []);

  useEffect(() => {
    itemRefetch();
  }, [order]);

  useEffect(() => {
    if (refScanner.current && validateErrors()) {
      createMutate({ ...order, ...item });
    }
  }, [item]);

  useEffect(() => {
    calculateTotal();
  }, [itemData]);

  useEffect(() => {
    if (createStatus === 'success') {
      toast.show({
        render: () => <AppAlert text={createData?.data?.message || 'success'} type="success" />,
        placement: 'top',
        duration: 2000,
      });
    } else if (createStatus === 'error') {
      toast.show({
        render: () => <AppAlert text={createError?.response?.data?.message || 'error'} type="error" />,
        placement: 'top',
        duration: 3000,
      });
    }

    return () => {
      refScanner.current = false;
      clearState('Item');
    };
  }, [createStatus]);

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
            <LoadingScreen show={updateIsLoading || createIsLoading} />
            <VStack space={10} p={5}>
              <FormControl isRequired isInvalid={'CountStock_ID' in errors}>
                <Select
                  h={50}
                  size={20}
                  width={'100%'}
                  accessibilityLabel="Choose Service"
                  placeholder="COUNT STOCK ORDER NO."
                  selectedValue={order?.CountStock_ID || ''}
                  onValueChange={(value) => handleChangeOrder(value)}
                >
                  {orderData?.data?.data?.map((value: any) => {
                    return <Select.Item key={value.CountStock_ID} shadow={2} label={value.CountStock_DocNo} value={value.CountStock_ID} />;
                  })}
                </Select>
                {'CountStock_ID' in errors && <FormControl.ErrorMessage>{errors.CountStock_ID}</FormControl.ErrorMessage>}
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
                      <DataTable.Title style={styles.table_title_10}>
                        <Text bold>NO.</Text>
                      </DataTable.Title>
                      <DataTable.Title style={styles.table_title_54}>
                        <Text bold>PART</Text>
                      </DataTable.Title>
                      <DataTable.Title numeric style={styles.table_title_18}>
                        <Text bold>ACT</Text>
                      </DataTable.Title>
                      <DataTable.Title numeric style={styles.table_title_18}>
                        <Text bold>BAL</Text>
                      </DataTable.Title>
                    </DataTable.Header>
                    {itemData?.data?.data?.map((value: any, key: number) => {
                      return (
                        <DataTable.Row key={key}>
                          <DataTable.Title style={styles.table_title_10}>{value.No}</DataTable.Title>
                          <DataTable.Cell style={styles.table_title_54}>{value.Item}</DataTable.Cell>
                          <DataTable.Cell numeric style={styles.table_title_18}>
                            <Text bold color={'primary.600'}>
                              {value.Actual}
                            </Text>
                          </DataTable.Cell>
                          <DataTable.Cell numeric style={styles.table_title_18}>
                            {value.Balance}
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

export default CountStock;
