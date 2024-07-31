import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Layout from '../components/Layout';
import axios from '../utils/axios';
import withAuth from '../utils/withAuth';
import BackButton from '../components/BackButton';
import QRCodeScanner from '../components/QRCodeScanner';
import LoadingModal from '../components/LoadingModal';

const ScanQRContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const ScanQR = () => {
  const [processing, setProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { compId, eventId, lobbyId } = router.query;

  const handleScan = async (data: string | null) => {
    if (data) {
      setProcessing(true);

      const requestData = {
        code: data,
        eventId,
        lobbyId,
        compId,
      };

      try {
        const response = await axios.post('/lobbies-records', requestData);
        setResult(response.data.success || 'Ingresso validado com sucesso!');
        setError(null);
        setTimeout(() => {
          router.push(`/register-vehicle?ticket_code=${data}`);
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
      {processing && <LoadingModal />}
      <ScanQRContainer>
        <BackButton />
        <h1>Escanear QR Code</h1>
        <QRCodeScanner onScan={handleScan} />
        {result && <p>{result}</p>}
        {error && (
          <>
            <button onClick={handleBackToLobby}>Voltar para Portaria</button>
          </>
        )}
      </ScanQRContainer>
    </Layout>
  );
};

export default withAuth(ScanQR);
