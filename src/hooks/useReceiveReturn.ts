import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useReceiveReturn = () => {
  const getReceiveReturn = async () => {
    return await httpClient.get('/receive_return');
  };
  return useQuery(
    "ReceiveReturn",
    () => getReceiveReturn(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

export const useReceiveReturnItem = ({Rec_ID}: any) => {

  const getReceiveReturnItem = async (Rec_ID: any) => {
    
    return await httpClient.get(`/receive_return_item?Rec_ID=${Rec_ID}`);
  };
  return useQuery<any, any, any>(
    ["ReceiveReturnItem", Rec_ID],
    () => getReceiveReturnItem(Rec_ID),
    {
      enabled: true,
    }
  );
};

export const useExecReceiveReturnTransactions = () => {

  const queryClient = useQueryClient();

  const execReceiveReturnTransactions = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/exec_receive_return_transaction", data);
  };

  return useMutation<any, any, any>(
    "ExecReceiveReturnTransactions",
    (params) => execReceiveReturnTransactions(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('ReceiveReturnItem');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useUpdateReceiveReturn = () => {

  const queryClient = useQueryClient();

  const updateReceiveReturn = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/update_receive_return", data);
  };

  return useMutation<any, any, any>(
    "UpdateReceiveReturn",
    (params) => updateReceiveReturn(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('ReceiveReturn');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};