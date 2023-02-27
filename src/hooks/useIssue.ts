import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useIssue = () => {
  const getIssue = async () => {
    return await httpClient.get('/request_sale_service');
  };
  return useQuery(
    "Issue",
    () => getIssue(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

export const useIssueItem = ({Withdraw_ID}: any) => {

  const getIssueItem = async (Withdraw_ID: any) => {
    
    return await httpClient.get(`/request_sale_service_item?Withdraw_ID=${Withdraw_ID}`);
  };
  return useQuery<any, any, any>(
    ["IssueItem", Withdraw_ID],
    () => getIssueItem(Withdraw_ID),
    {
      enabled: true,
    }
  );
};

export const useExecIssueTransactions = () => {

  const queryClient = useQueryClient();

  const execIssueTransactions = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/exec_request_sale_service_transaction", data);
  };

  return useMutation<any, any, any>(
    "ExecIssueTransactions",
    (params) => execIssueTransactions(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('IssueItem');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useUpdateIssue = () => {

  const queryClient = useQueryClient();

  const updateIssue = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/update_request_sale_service", data);
  };

  return useMutation<any, any, any>(
    "UpdateIssue",
    (params) => updateIssue(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Issue');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};