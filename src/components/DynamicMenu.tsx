import ReceivePart from "../views/ReceivePart";
import ReceiveReturn from "../views/ReceiveReturn";
import ReturnPart from "../views/ReturnPart";
import CheckPart from "../views/CheckPart";
import CountStock from "../views/CountStock";
import SplitPart from "../views/SplitPart";
import ReceiveSaleService from "../views/ReceiveSaleService";
import RequestSaleService from "../views/RequestSaleService";

export const DynamicMenu: any = {
  ReceivePartMobile: ReceivePart,
  ReceiveReturnMobile: ReceiveReturn,
  ReturnPartMobile: ReturnPart,
  CheckPartMobile: CheckPart,
  CountStockMobile: CountStock,
  SplitPartMobile: SplitPart,
  ReceiveSaleServiceMobile: ReceiveSaleService,
  RequestSaleServiceMobile: RequestSaleService,
};

// Note : set menu name to dynamic menu
