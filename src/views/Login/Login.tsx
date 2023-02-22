import React, { useState, useEffect,useCallback } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  FormControl,
  VStack,
  Input,
  Icon,
  Button,
  Text,
  Center,
  Box,
  useToast,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

import { useAuthLogin } from "../../hooks/useLogin";
import { IAuthLoginParams } from "../../types/views/Login";

import AppAlert from "../../components/AppAlert";
import LoadingScreen from "../../components/LoadingScreen";
import Logo from "../../assets/toto.svg";

const Login: React.FC = () => {
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IAuthLoginParams>();

  const { isLoading, isError, error, status, mutate } = useAuthLogin();
  const [show, setShow] = useState<boolean>(false);

  const onSubmit: SubmitHandler<IAuthLoginParams> = useCallback((data) => {
    mutate(data);
  },[]);

  useEffect(() => {
    if (status === "success") {
    } else if (status === "error") {
      toast.show({
        render: () => {
          return (
            <AppAlert text={error?.response?.data?.message} type="error" />
          );
        },
        placement: "top",
        duration: 2000,
      });
    }

    return () => {};
  }, [status]);

  return (
    <Box flex={1} safeArea>
      <LoadingScreen show={isLoading} />
      <Center mt="10%">
        <Logo width={250} height={120} />
      </Center>
      <Box p={5}>
        <VStack
          space={5}
          p={10}
          backgroundColor="coolGray.200"
          borderRadius="xl"
        >
          <Center>
            <Text fontWeight="extrabold" color="coolGray.700">
              AFTER SALE
            </Text>
          </Center>
          <FormControl isRequired isInvalid={"username" in errors}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  InputLeftElement={
                    <Icon as={<MaterialIcons name="person" />} size="md" />
                  }
                  variant="underlined"
                  p={2}
                  placeholder="Username"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="username"
              rules={{ required: "Username is required" }}
              defaultValue="pakorn.wo"
            />
            <FormControl.ErrorMessage>
              {errors.username?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={"password" in errors}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  InputLeftElement={
                    <Icon as={<MaterialIcons name="lock" />} size="md" />
                  }
                  variant="underlined"
                  p={2}
                  type={show ? "text" : "password"}
                  placeholder="Password"
                  InputRightElement={
                    <Icon
                      size="md"
                      color={show ? "blue.500" : "coolGray.500"}
                      as={
                        <MaterialIcons
                          name={show ? "visibility" : "visibility-off"}
                        />
                      }
                      onPress={() => setShow(!show)}
                    />
                  }
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="password"
              rules={{ required: "Password is required" }}
              defaultValue="1234"
            />

            <FormControl.ErrorMessage>
              {errors.password?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <Button
            leftIcon={<Icon as={<MaterialIcons name="login" />} size="sm" />}
            onPress={handleSubmit(onSubmit)}
            bgColor={'#14439c'}
          >
            SIGN IN
          </Button>
        </VStack>
      </Box>
      <Center flex={1}>
        <Text>V 1.0</Text>
      </Center>
    </Box>
  );
};

export default Login;
