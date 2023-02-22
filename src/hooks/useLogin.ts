import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { httpClient } from "../services/axios";

import { REACT_APP_PLATFORM } from '@env';

import { setAuth } from "../contexts/slices/authSlice";

import { IAuthLoginParams } from "../types/views/Login";
import { IAuthLoginResult } from "../types/hooks/Login";

export const useAuthLogin = () => {
  const dispatch = useDispatch();

  const getAuthLogin = async (params: any): Promise<IAuthLoginResult> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    data.append('platform', `${REACT_APP_PLATFORM}`);

    return await httpClient.post("/login", data);
  };

  return useMutation<IAuthLoginResult, any, IAuthLoginParams>(
    "AuthLogin",
    (params) => getAuthLogin(params),
    {
      onSuccess: (response) => {

        dispatch(setAuth(response.data));

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useRefreshToken = () => {

  const dispatch = useDispatch();

  const getRefreshToken = async (): Promise<IAuthLoginResult> => {

    return await httpClient.get("/refresh_token");
  };

  return useMutation<IAuthLoginResult, any>(
    "RefreshToken",
    () => getRefreshToken(),
    {
      onSuccess: (response) => {

        dispatch(setAuth(response.data));

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};
