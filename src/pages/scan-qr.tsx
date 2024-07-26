import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Layout from '../components/Layout';
import withAuth from '../utils/withAuth';
import axios from '../utils/axios';
import { Html5Qrcode } from 'html5-qrcode';

const ScanQRContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const ResultContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Message = styled.p<{ success?: boolean }>`
  color: ${({ success }) => (success ? 'green' : 'red')};
  font-size: 1.2rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  margin-top: 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #005bb5;
    transform: translateY(-3px);
  }

  &:active {
    background-color: #003a75;
    transform: translateY(0);
  }
`;

const ScanQR = () => {
  const [data, setData] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMediaDevicesAvailable, setIsMediaDevicesAvailable] = useState<boolean>(true);
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(true);
  const router = useRouter();
  const { compId, eventId, lobbyId } = router.query;
  const qrCodeRegionId = "html5qr-code-full-region";
  const html5QrCode = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && !navigator.mediaDevices) {
      setIsMediaDevicesAvailable(false);
    }
  }, []);

  useEffect(() => {
    const checkPermissions = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          setIsPermissionGranted(true);
          startQrScanner();
        } catch (err) {
          console.error("Permissão de câmera negada", err);
          setError("Permissão de câmera negada");
          setIsPermissionGranted(false);
        }
      } else {
        setIsMediaDevicesAvailable(false);
      }
    };

    const startQrScanner = () => {
      if (typeof window !== 'undefined' && isPermissionGranted) {
        html5QrCode.current = new Html5Qrcode(qrCodeRegionId);
        const config = { fps: 10, qrbox: 250 };

        const qrCodeSuccessCallback = (decodedText: string) => {
          handleScan(decodedText);
        };

        const qrCodeErrorCallback = (errorMessage: string) => {
          console.warn(`QR Code no longer in front of camera. ${errorMessage}`);
        };

        html5QrCode.current.start(
          { facingMode: "environment" },
          config,
          qrCodeSuccessCallback,
          qrCodeErrorCallback
        ).catch((err) => {
          console.error(`Unable to start scanning, error: ${err}`);
          setError('Erro ao iniciar o scanner');
        });

        return () => {
          if (html5QrCode.current) {
            html5QrCode.current.stop().catch((err) => console.error(`Unable to stop scanning, error: ${err}`));
          }
        };
      }
    };

    checkPermissions();
  }, [isPermissionGranted]);

  const handleScan = async (decodedText: string) => {
    if (!processing) {
      setData(decodedText);
      setProcessing(true);

      const requestData = {
        code: decodedText,
        eventId,
        lobbyId,
        compId,
      };

      try {
        const response = await axios.post('/lobbies-records', requestData);
        setResult(response.data.success || 'Ingresso validado com sucesso!');
        setError(null);
        setTimeout(() => {
          router.push(`/validated-tickets?compId=${compId}&eventId=${eventId}&lobbyId=${lobbyId}`);
        }, 2000);
      } catch (error: any) {
        setError(error.response?.data?.error || 'Erro ao validar ingresso');
        setResult(null);
        setProcessing(false);
      }
    }
  };

  const handleBackToLobby = () => {
    router.push(`/lobbies?compId=${compId}&eventId=${eventId}`);
  };

  return (
    <Layout>
      <ScanQRContainer>
        <h1>Escanear QR Code</h1>
        {processing && <Message>Processando...</Message>}
        {!processing && isMediaDevicesAvailable && isPermissionGranted && (
          <div id={qrCodeRegionId} style={{ width: '100%' }} />
        )}
        {!isMediaDevicesAvailable && (
          <Message success={false}>Este navegador não suporta media devices.</Message>
        )}
        {!isPermissionGranted && (
          <Message success={false}>Permissão de câmera negada. Por favor, permita o acesso à câmera.</Message>
        )}
        {data && (
          <ResultContainer>
            <h2>Dados do QR Code:</h2>
            <p>{data}</p>
            {result && <Message success>{result}</Message>}
            {error && (
              <>
                <Message>{error}</Message>
                <Button onClick={handleBackToLobby}>Voltar para Portaria</Button>
              </>
            )}
          </ResultContainer>
        )}
      </ScanQRContainer>
    </Layout>
  );
};

export default withAuth(ScanQR);
