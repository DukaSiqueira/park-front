import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
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
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const scannerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setVideoDevices(videoDevices);
        setHasMultipleCameras(videoDevices.length > 1);
      } catch (error) {
        console.error('Error enumerating devices:', error);
      }
    };

    getDevices();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode } })
        .then(stream => {
          const video = videoRef.current;
          if (video) {
            if (video.srcObject) {
              const tracks = (video.srcObject as MediaStream).getTracks();
              tracks.forEach(track => track.stop());
            }
            video.srcObject = stream;
          }
        })
        .catch(handleError);
    }
  }, [facingMode]);

  const handleScan = (data: any) => {
    if (data) {
      onScan(data.text);
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  const handleCameraSwitch = () => {
    setFacingMode(prevMode => (prevMode === 'environment' ? 'user' : 'environment'));
  };

  return (
    <ScannerContainer>
      {hasMultipleCameras && (
        <CameraSwitcher>
          <button onClick={handleCameraSwitch}>
            {facingMode === 'environment' ? 'Usar Câmera Frontal' : 'Usar Câmera Traseira'}
          </button>
        </CameraSwitcher>
      )}
      <Scanner>
        <QrScanner
          ref={scannerRef}
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
        <video ref={videoRef} style={{ display: 'none' }} />
      </Scanner>
    </ScannerContainer>
  );
};

export default QRCodeScanner;
