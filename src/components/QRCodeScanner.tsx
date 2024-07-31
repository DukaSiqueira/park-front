import dynamic from 'next/dynamic';
import { useState } from 'react';
import styled from 'styled-components';

const QrScanner = dynamic(() => import('react-qr-scanner'), { ssr: false });

const ScannerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Scanner = styled.div`
  width: 100%;
  max-width: 400px;
  margin: auto;
`;

interface QRCodeScannerProps {
  onScan: (data: string | null) => void;
}

const QRCodeScanner = ({ onScan }: QRCodeScannerProps) => {
  const [result, setResult] = useState<any | null>(null);
  const handleScan = (data: any) => {
    if (data) {
      onScan(data.text);
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  async function getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log('devices', devices);
    
    setResult(devices);
  }


  return (
    <ScannerContainer>
      <button onClick={getDevices}>Get Devices</button>
      <p>{JSON.stringify(result)}</p>
      {/* <Scanner>
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      </Scanner> */}
    </ScannerContainer>
  );
};

export default QRCodeScanner;
