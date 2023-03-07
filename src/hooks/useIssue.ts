import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useIssue = () => {
  const getIssue = async () => {
    return await httpClient.get('/issue');
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

export const useIssueItem = () => {

  const getIssueItem = async (Withdraw_ID: any) => {
    
    return await httpClient.get(`/issue_item?Withdraw_ID=${Withdraw_ID}`);
  };
  return useMutation<any, any, any>(
    
    "IssueItem",
    (Withdraw_ID) => getIssueItem(Withdraw_ID),
    {
      onSuccess: (response) => {

        // queryClient.invalidateQueries('Issue');

      },
      onError: (error) => {

        console.log(error);

      },
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

    return await httpClient.post("/exec_issue_transaction", data);
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

    return await httpClient.post("/update_issue", data);
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


export const useCreateIssue = () => {

  const queryClient = useQueryClient();

  const createIssue = async (params: any): Promise<any> => {
    
    let data:any = new FormData();
      data.append('Quotation_No',params.Quotation_No || "");
      data.append('Item',JSON.stringify(params.Item) || "");
    console.log('params =',params);
    console.log('data =',data);
    return await httpClient.post("/create_issue", data);
  };

  

  return useMutation<any, any, any>(
    "CreateIssue",
    (params) => createIssue(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Issue');
      
      },
      onError: (error) => {

        console.log(error);

      },
    }
  );
};


export const useStockBalQrCode = () => {
  const queryClient = useQueryClient();
  const getStockBalQrCode = async (params: any): Promise<any> => {

    let data:any = new FormData();
      Object.keys(params).forEach((value) => {
        data.append(value, params[value] || "");
      });

      
      return await httpClient.post("/stock_bal", data);
  };


  return useMutation<any, any, any>(
    "getStockBalQrCode",
    (params) => getStockBalQrCode(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Issue');

      },
      onError: (error) => {

        console.log(error);

      },
    }
  ); 
};
