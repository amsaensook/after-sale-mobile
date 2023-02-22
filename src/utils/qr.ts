export const getDataFromQR = (qr: string): any => {

    try {

        const qrObject = JSON.parse(qr);

        return qrObject[0];
    
    } catch (error:any) {

        const err = {
            status: false,
            code: 'jsonError',
            message: 'Could not parse json',
            rawError: error
        }

        return err;

    }
    
  
};