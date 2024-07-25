import { useRouter } from 'next/router';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { FaQrcode, FaCar } from 'react-icons/fa';
import withAuth from '../utils/withAuth';

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f0f0f0 0%, #c0c0c0 100%);
  padding: 1rem;
`;

const OptionButton = styled.button`
  display: flex;
  align-items: center;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  margin: 1rem;
  font-size: 1.2rem;
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

  svg {
    margin-right: 10px;
  }

  @media (max-width: 600px) {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;

    svg {
      margin-right: 5px;
    }
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;

  @media (max-width: 600px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const Options = () => {
  const router = useRouter();
  const { compId, eventId, lobbyId } = router.query;

  const handleScanQR = () => {
    router.push(`/scan-qr?compId=${compId}&eventId=${eventId}&lobbyId=${lobbyId}`);
  };

  const handleCarList = () => {
    router.push(`/car-list?compId=${compId}&eventId=${eventId}&lobbyId=${lobbyId}`);
  };

  return (
    <Layout>
      <OptionsContainer>
        <Title>Escolha uma Opção</Title>
        <OptionButton onClick={handleScanQR}>
          <FaQrcode size={24} /> Escanear QR Code
        </OptionButton>
        <OptionButton onClick={handleCarList}>
          <FaCar size={24} /> Acessar Lista de Carros
        </OptionButton>
      </OptionsContainer>
    </Layout>
  );
};

export default withAuth(Options);
