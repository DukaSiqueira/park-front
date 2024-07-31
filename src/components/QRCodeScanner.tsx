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
  padding: 20px;
  position: relative;

  @media (max-height: 768px) {
    max-height: 300px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Scanner = styled.div`
  width: 100%;
  max-width: 400px;
  margin: auto;

  @media (max-width: 768px) {
    max-width: 250px;
  }

  @media (max-width: 480px) {
    max-width: 200px;
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

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 14px;
    margin-top: 10px;
  }

  &:hover {
    background-color: #0056b3;
  }
`;

const MessagePopup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid #ccc;
  padding: 20px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Loader = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0070f3;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AccessTicketButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;

  &:hover {
    background-color: #218838;
  }
`;

interface QRCodeScannerProps {
  onScan: (data: string | null) => void;
}

const QRCodeScanner = ({ onScan }: QRCodeScannerProps) => {
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [ticketCode, setTicketCode] = useState<string | null>(null);
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
        setLoading(false);
      } catch (error) {
        console.error('Error accessing media devices.', error);
        setLoading(false);
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
      setMessage(`Ingresso já validado: ${data.text}`);
      setTicketCode(data.text);
      onScan(data.text);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
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

  const closePopup = () => {
    setMessage(null);
    setTicketCode(null);
    initializeCamera(videoDevices[currentDeviceIndex].deviceId);
  };

  const handleAccessTicket = () => {
    if (ticketCode) {
      window.location.href = `/register-vehicle?ticket_code=${ticketCode}`;
    }
  };

  return (
    <ScannerContainer>
      {loading && <Loader />}
      {!loading && (
        <>
          {message && (
            <>
              <Overlay onClick={closePopup} />
              <MessagePopup>
                <p>{message}</p>
                <button onClick={closePopup}>Fechar</button>
                <AccessTicketButton onClick={handleAccessTicket}>Acessar Ingresso</AccessTicketButton>
              </MessagePopup>
            </>
          )}
          {!message && (
            <>
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
            </>
          )}
        </>
      )}
    </ScannerContainer>
  );
};

export default QRCodeScanner;
