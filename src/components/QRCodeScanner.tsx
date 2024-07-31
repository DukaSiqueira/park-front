import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';

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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

interface QRCodeScannerProps {
  onScan: (data: string | null) => void;
}

const QRCodeScanner = ({ onScan }: QRCodeScannerProps) => {
  const [cameraFacing, setCameraFacing] = useState('environment');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleVideo = async (cameraFacing: string) => {
      const constraints = {
        video: {
          facingMode: {
            exact: cameraFacing
          }
        }
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error accessing camera: ', error);
      }
    };

    handleVideo(cameraFacing);

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraFacing]);

  const handleScan = (data: any) => {
    if (data) {
      onScan(data.text);
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  const handleSwitchCamera = () => {
    setCameraFacing(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <ScannerContainer>
      <Scanner>
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
        <video ref={videoRef} style={{ display: 'none' }} />
      </Scanner>
      <ButtonContainer>
        <Button onClick={handleSwitchCamera}>
          Alternar Câmera
        </Button>
      </ButtonContainer>
    </ScannerContainer>
  );
};

export default QRCodeScanner;
