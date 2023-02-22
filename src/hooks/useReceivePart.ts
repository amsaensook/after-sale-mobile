import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useReceivePart = () => {
  const getReceivePart = async () => {
    return await httpClient.get('/receive_part');
  };
  return useQuery(
    "ReceivePart",
    () => getReceivePart(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

export const useReceivePartItem = ({Rec_ID}: any) => {

  const getReceivePartItem = async (Rec_ID: any) => {
    
    return await httpClient.get(`/receive_part_item?Rec_ID=${Rec_ID}`);
  };
  return useQuery<any, any, any>(
    ["ReceivePartItem", Rec_ID],
    () => getReceivePartItem(Rec_ID),
    {
      enabled: true,
    }
  );
};

export const useExecReceivePartTransactions = () => {

  const queryClient = useQueryClient();

  const execReceivePartTransactions = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/exec_receive_part_transaction", data);
  };

  return useMutation<any, any, any>(
    "ExecReceivePartTransactions",
    (params) => execReceivePartTransactions(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('ReceivePartItem');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useUpdateReceivePart = () => {

  const queryClient = useQueryClient();

  const updateReceivePart = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/update_receive_part", data);
  };

  return useMutation<any, any, any>(
    "UpdateReceivePart",
    (params) => updateReceivePart(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('ReceivePart');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};