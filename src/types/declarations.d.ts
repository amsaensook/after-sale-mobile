declare module '@env' {
    export const REACT_APP_NAME: string;
    export const REACT_APP_API_URL: string;
    export const REACT_APP_PLATFORM: string;
    export const REACT_APP_PUBLIC_URL: string;
}

declare module "*.svg" {
    import React from 'react';
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
  }