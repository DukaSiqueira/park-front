declare module 'react-qr-scanner' {
    import { ComponentType, CSSProperties } from 'react';
  
    interface QrScannerProps {
      delay: number;
      onError: (error: any) => void;
      onScan: (result: any) => void;
      style?: CSSProperties;
      constraints?: MediaStreamConstraints;
    }
  
    const QrScanner: ComponentType<QrScannerProps>;
    export default QrScanner;
  }
  