import { useState } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';

const QrScanner = dynamic(() => import('react-qr-scanner'));

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
`;

const ScanQR = () => {
  const [data, setData] = useState<string | null>(null);

  const handleScan = (result: any) => {
    if (result) {
      setData(result.text);
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  return (
    <Layout>
      <ScanQRContainer>
        <h1>Escanear QR Code</h1>
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
        {data && (
          <ResultContainer>
            <h2>Dados do QR Code:</h2>
            <p>{data}</p>
          </ResultContainer>
        )}
      </ScanQRContainer>
    </Layout>
  );
};

export default ScanQR;
