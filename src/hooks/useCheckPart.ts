import { useQuery } from "react-query";
import { httpClient } from "../services/axios";

export const useCheckPart = ({QR_NO}: any) => {

  const getCheckPart = async (QR_NO: any) => {
    
    return await httpClient.get(`/check_part?QR_NO=${QR_NO}`);
  };
  return useQuery<any, any, any>(
    ["CheckPart", QR_NO],
    () => getCheckPart(QR_NO),
    {
      enabled: true,
    }
  );
};


