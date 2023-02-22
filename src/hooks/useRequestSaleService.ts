import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useRequestSaleService = () => {
  const getRequestSaleService = async () => {
    return await httpClient.get('/request_sale_service');
  };
  return useQuery(
    "RequestSaleService",
    () => getRequestSaleService(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

export const useRequestSaleServiceItem = ({Withdraw_ID}: any) => {

  const getRequestSaleServiceItem = async (Withdraw_ID: any) => {
    
    return await httpClient.get(`/request_sale_service_item?Withdraw_ID=${Withdraw_ID}`);
  };
  return useQuery<any, any, any>(
    ["RequestSaleServiceItem", Withdraw_ID],
    () => getRequestSaleServiceItem(Withdraw_ID),
    {
      enabled: true,
    }
  );
};

export const useExecRequestSaleServiceTransactions = () => {

  const queryClient = useQueryClient();

  const execRequestSaleServiceTransactions = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/exec_request_sale_service_transaction", data);
  };

  return useMutation<any, any, any>(
    "ExecRequestSaleServiceTransactions",
    (params) => execRequestSaleServiceTransactions(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('RequestSaleServiceItem');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useUpdateRequestSaleService = () => {

  const queryClient = useQueryClient();

  const updateRequestSaleService = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/update_request_sale_service", data);
  };

  return useMutation<any, any, any>(
    "UpdateRequestSaleService",
    (params) => updateRequestSaleService(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('RequestSaleService');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};