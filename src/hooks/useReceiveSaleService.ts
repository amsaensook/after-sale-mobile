import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useReceiveSaleService = () => {
  const getReceiveSaleService = async () => {
    return await httpClient.get('/receive_sale_service');
  };
  return useQuery(
    "ReceiveSaleService",
    () => getReceiveSaleService(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

export const useReceiveSaleServiceItem = ({Rec_ID}: any) => {

  const getReceiveSaleServiceItem = async (Rec_ID: any) => {
    
    return await httpClient.get(`/receive_sale_service_item?Rec_ID=${Rec_ID}`);
  };
  return useQuery<any, any, any>(
    ["ReceiveSaleServiceItem", Rec_ID],
    () => getReceiveSaleServiceItem(Rec_ID),
    {
      enabled: true,
    }
  );
};

export const useExecReceiveSaleServiceTransactions = () => {

  const queryClient = useQueryClient();

  const execReceiveSaleServiceTransactions = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/exec_receive_sale_service_transaction", data);
  };

  return useMutation<any, any, any>(
    "ExecReceiveSaleServiceTransactions",
    (params) => execReceiveSaleServiceTransactions(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('ReceiveSaleServiceItem');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useUpdateReceiveSaleService = () => {

  const queryClient = useQueryClient();

  const updateReceiveSaleService = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/update_receive_sale_service", data);
  };

  return useMutation<any, any, any>(
    "UpdateReceiveSaleService",
    (params) => updateReceiveSaleService(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('ReceiveSaleService');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};