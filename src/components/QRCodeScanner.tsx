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

const CameraSwitcher = styled.div`
  margin-bottom: 20px;
`;

interface QRCodeScannerProps {
  onScan: (data: string | null) => void;
}

const QRCodeScanner = ({ onScan }: QRCodeScannerProps) => {
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const handleScan = (data: any) => {
    if (data) {
      onScan(data.text);
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  const handleCameraSwitch = () => {
    setFacingMode((prevMode) => (prevMode === 'environment' ? 'user' : 'environment'));
  };

  return (
    <ScannerContainer>
      <CameraSwitcher>
        <button onClick={handleCameraSwitch}>
          {facingMode === 'environment' ? 'Usar Câmera Frontal' : 'Usar Câmera Traseira'}
        </button>
      </CameraSwitcher>
      <Scanner>
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
          facingMode={facingMode}
        />
      </Scanner>
    </ScannerContainer>
  );
};

export default QRCodeScanner;
