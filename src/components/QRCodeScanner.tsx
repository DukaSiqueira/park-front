import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
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

  @media (max-width: 768px) {
    max-width: 250px;
  }
`;

const SwitchButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  &:hover {
    background-color: #0056b3;
  }
`;

interface QRCodeScannerProps {
  onScan: (data: string | null) => void;
}

const QRCodeScanner = ({ onScan }: QRCodeScannerProps) => {
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function getDevices() {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter(device => device.kind === 'videoinput');
        setVideoDevices(videoInputDevices);

        if (videoInputDevices.length > 0) {
          const backCameraIndex = videoInputDevices.findIndex(device =>
            device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('traseira')
          );
          const initialIndex = backCameraIndex !== -1 ? backCameraIndex : 0;
          setCurrentDeviceIndex(initialIndex);
          await initializeCamera(videoInputDevices[initialIndex].deviceId);
        }
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    }

    getDevices();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeCamera = async (deviceId: string) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    const constraints = {
      video: {
        deviceId: {
          exact: deviceId
        }
      }
    };

    try {
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = newStream;
    } catch (error) {
      console.error('Error initializing camera.', error);
    }
  };

  const handleScan = (data: any) => {
    if (data) {
      onScan(data.text);
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  const handleSwitchCamera = () => {
    const nextDeviceIndex = (currentDeviceIndex + 1) % videoDevices.length;
    setCurrentDeviceIndex(nextDeviceIndex);
    initializeCamera(videoDevices[nextDeviceIndex].deviceId);
  };

  return (
    <ScannerContainer>
      {videoDevices.length > 1 && (
        <SwitchButton onClick={handleSwitchCamera}>
          Alternar Câmera
        </SwitchButton>
      )}
      <Scanner>
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
          constraints={{ video: { deviceId: videoDevices[currentDeviceIndex]?.deviceId || undefined } }}
        />
      </Scanner>
    </ScannerContainer>
  );
};

export default QRCodeScanner;
