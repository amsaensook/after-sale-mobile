import React, { useEffect, useCallback } from "react";
import { Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, HStack, Pressable, Text } from "native-base";
import { Alert } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetInfo } from "@react-native-community/netinfo";

import { setAuth, selectAuth } from "../../contexts/slices/authSlice";

import AppScanner from "../../components/AppScanner";
import { getCurrentTimeStamp } from "../../utils/date";
import { getTimeFromToken } from "../../utils/token";
import { expireTime } from "../../configs/token";

import { DynamicMenu } from "../../components/DynamicMenu";
import Logo from "../../components/Logo";

const Login = React.lazy(() => import("../Login"));
const Menu = React.lazy(() => import("../Menu"));
const Error404 = React.lazy(() => import("../Error404"));

const Main: React.FC = () => {
  const Stack: any = createStackNavigator();
  const dispatch = useDispatch();
  const { authResult } = useSelector(selectAuth);

  const NetInfo = useNetInfo();

  const validateToken = useCallback(async () => {
    try {
      //? get token, status from AsyncStorage
      const auth: any = JSON.parse(
        (await AsyncStorage.getItem("auth")) || "{}"
      );

      if (auth.status) {
        const accessTime = getTimeFromToken(auth.data.token);
        const currentTime = getCurrentTimeStamp();

        //? if token is expired
        if (currentTime - accessTime > expireTime) {
          Alert.alert("Alert", "Your token is expired, please login again", [
            {
              text: "OK",
              onPress: () => {
                dispatch(setAuth({}));
              },
            },
          ]);
        }

        //? if token is valid
        dispatch(setAuth(auth));
      } else {
        dispatch(setAuth({}));
      }
    } catch (error) {
      console.log(error);
    }
  }, [authResult]);

  const handleLogout = useCallback(() => {
    Alert.alert("CONFIRM LOGOUT", authResult?.data.UserName, [
      {
        text: "CANCEL",
        style: "cancel",
      },
      {
        text: "CONFIRM",
        style: "default",
        onPress: () => {
          dispatch(setAuth({}));
        },
      },
    ]);
  }, [authResult]);

  useEffect(() => {
    validateToken();
  }, []);

  return (
    <>
      <Stack.Navigator>
        {authResult?.status ? (
          <>
            <Stack.Screen
              name="Menu"
              component={Menu}
              options={() => ({
                headerStyle: {
                  backgroundColor: /* "#2471A3" */ "#14439c",
                },
                headerTitle: () => <Logo />,
                headerRight: () => (
                  <HStack space={2} pr="2">
                    <Pressable onPress={() => handleLogout()}>
                      {({ isHovered, isPressed }) => {
                        return (
                          <Avatar
                            bg="blue.700"
                            size="sm"
                            mt={1}
                            w={Platform.OS === "ios" ? 10 : 100}
                            color={
                              isPressed
                                ? "blue.900"
                                : isHovered
                                ? "blue.900"
                                : "blue.700"
                            }
                            style={{
                              transform: [
                                {
                                  scale: isPressed ? 0.96 : 1,
                                },
                              ],
                            }}
                          >
                            {Platform.OS === "ios" ? (
                              authResult.data.UserName.charAt(0).toUpperCase()
                            ) : (
                              <Text mb={1} bold isTruncated color="warmGray.50">
                                {authResult.data.UserName}
                              </Text>
                            )}
                            <Avatar.Badge
                              bg={NetInfo.isConnected ? "green.500" : "red.500"}
                            />
                          </Avatar>
                        );
                      }}
                    </Pressable>
                  </HStack>
                ),
              })}
            />

            {authResult?.data?.permission?.map((value: any, index: number) => {
              return (
                <Stack.Screen
                  key={index}
                  name={value.MenuId}
                  options={() => ({
                    title: `${value.MenuName.toUpperCase()}`,
                    headerStyle: {
                      backgroundColor: /* "#2471A3" */ "#14439c",
                    },
                    headerTitleStyle: {
                      color: "#FFFEFE",
                      fontWeight : "bold"
                    },
                    headerTintColor: "#FFFEFE",
                  })}
                  component={
                    DynamicMenu[value.MenuId]
                      ? DynamicMenu[value.MenuId]
                      : Error404
                  }
                />
              );
            })}

            <Stack.Screen name="AppScanner" component={AppScanner} />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={() => ({
              headerShown: false,
            })}
          />
        )}
      </Stack.Navigator>
    </>
  );
};

export default Main;
