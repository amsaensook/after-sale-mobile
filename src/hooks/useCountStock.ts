import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useCountStock = () => {
  const getCountStock = async () => {
    return await httpClient.get('/count_stock');
  };
  return useQuery(
    "CountStock",
    () => getCountStock(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

export const useCountStockItem = ({CountStock_ID}: any) => {

  const getCountStockItem = async (CountStock_ID: any) => {
    
    return await httpClient.get(`/count_stock_item?CountStock_ID=${CountStock_ID}`);
  };
  return useQuery<any, any, any>(
    ["CountStockItem", CountStock_ID],
    () => getCountStockItem(CountStock_ID),
    {
      enabled: true,
    }
  );
};

export const useExecCountStockItem = () => {

  const queryClient = useQueryClient();

  const execCountStockItem = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/exec_count_stock_item", data);
  };

  return useMutation<any, any, any>(
    "ExecCountStockItem",
    (params) => execCountStockItem(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('CountStockItem');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useUpdateCountStock = () => {

  const queryClient = useQueryClient();

  const updateCountStock = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/update_count_stock", data);
  };

  return useMutation<any, any, any>(
    "UpdateCountStock",
    (params) => updateCountStock(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('CountStock');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};