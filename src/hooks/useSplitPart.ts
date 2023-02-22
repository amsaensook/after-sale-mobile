import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useSplitPart = () => {
  const getSplitPart = async () => {
    return await httpClient.get('/split_part');
  };
  return useQuery(
    "SplitPart",
    () => getSplitPart(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

export const useSplitPartItem = ({Rec_ID}: any) => {

  const getSplitPartItem = async (Rec_ID: any) => {
    
    return await httpClient.get(`/split_part_item?Rec_ID=${Rec_ID}`);
  };
  return useQuery<any, any, any>(
    ["SplitPartItem", Rec_ID],
    () => getSplitPartItem(Rec_ID),
    {
      enabled: true,
    }
  );
};

export const useExecSplitPartTransactions = () => {

  const queryClient = useQueryClient();

  const execSplitPartTransactions = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/exec_split_part_transaction", data);
  };

  return useMutation<any, any, any>(
    "ExecSplitPartTransactions",
    (params) => execSplitPartTransactions(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('SplitPartItem');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useUpdateSplitPart = () => {

  const queryClient = useQueryClient();

  const updateSplitPart = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/update_split_part", data);
  };

  return useMutation<any, any, any>(
    "UpdateSplitPart",
    (params) => updateSplitPart(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('SplitPart');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};