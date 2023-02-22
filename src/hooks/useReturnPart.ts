import { useMutation } from "react-query";
import { httpClient } from "../services/axios";

export const useUpdateReturnPart = () => {

  const updateReturnPart = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('Items', JSON.stringify(params) || "");

    return await httpClient.post("/update_return_part", data);
  };

  return useMutation<any, any, any>(
    "UpdateReturnPart",
    (params) => updateReturnPart(params),
    {
      onSuccess: (response) => {

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

