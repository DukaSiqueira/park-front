import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Layout from '../components/Layout';
import withAuth from '../utils/withAuth';
import axios from '../utils/axios';
import BackButton from '../components/BackButton';

const ScanTicketContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const InputContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const InputField = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
  max-width: 300px;
  margin-bottom: 1rem;
`;

const SubmitButton = styled.button`
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 2rem;
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

const Message = styled.p<{ success?: boolean }>`
  color: ${({ success }) => (success ? 'green' : 'red')};
  font-size: 1.2rem;
  margin-top: 1rem;
`;

const ScanTicket = () => {
  const [code, setCode] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { compId, eventId, lobbyId } = router.query;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code && !processing) {
      setProcessing(true);

      const requestData = {
        code,
        eventId,
        lobbyId,
        compId,
      };

      try {
        const response = await axios.post('/lobbies-records', requestData);
        setResult(response.data.success || 'Ingresso validado com sucesso!');
        setError(null);
        setTimeout(() => {
          router.push(`/register-vehicle?ticket_code=${code}`);
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
      <ScanTicketContainer>
        <BackButton />
        <h1>Informar Código do Ingresso</h1>
        <InputContainer>
          <form onSubmit={handleSubmit}>
            <InputField
              type="text"
              placeholder="Código do Ingresso"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <SubmitButton type="submit" disabled={processing}>
              {processing ? 'Processando...' : 'Validar Ingresso'}
            </SubmitButton>
          </form>
          {result && <Message success>{result}</Message>}
          {error && (
            <>
              <Message>{error}</Message>
              <SubmitButton onClick={handleBackToLobby}>Voltar para Portaria</SubmitButton>
            </>
          )}
        </InputContainer>
      </ScanTicketContainer>
    </Layout>
  );
};

export default withAuth(ScanTicket);
