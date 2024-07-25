import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import withAuth from '../utils/withAuth';
import axios from '../utils/axios';

const QrScanner = dynamic(() => import('react-qr-scanner'), { ssr: false });

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
  const router = useRouter();
  const { compId, eventId, lobbyId } = router.query;

  const handleScan = async (result: any) => {
    if (result && !processing) {
      setData(result.text);
      setProcessing(true);

      const requestData = {
        code: result.text,
        eventId,
        lobbyId,
        compId,
      };

      try {
        const response = await axios.post('/lobbies-records', requestData);
        setResult(response.data.success || 'Ingresso validado com sucesso!');
        setError(null);
        setTimeout(() => {
          router.push(`/car-list?compId=${compId}&eventId=${eventId}&lobbyId=${lobbyId}`);
        }, 2000);
      } catch (error: any) {
        setError(error.response?.data?.error || 'Erro ao validar ingresso');
        setResult(null);
        setProcessing(false);
      }
    }
  };

  const handleError = (error: any) => {
    console.error(error);
    setError('Erro ao escanear QR Code');
    setResult(null);
    setProcessing(false);
  };

  const handleBackToLobby = () => {
    router.push(`/lobbies?compId=${compId}&eventId=${eventId}`);
  };

  return (
    <Layout>
      <ScanQRContainer>
        <h1>Escanear QR Code</h1>
        {processing && <Message>Processando...</Message>}
        {!processing && (
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
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
