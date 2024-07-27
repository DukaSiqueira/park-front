import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import axios from '../utils/axios';
import Layout from '../components/Layout';
import withAuth from '../utils/withAuth';
import BackButton from '../components/BackButton';

const LobbyListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #f0f0f0;
  min-height: 100vh;
`;

const LobbyCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin: 1rem;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-3px);
  }

  h2 {
    margin: 0.5rem 0;
    color: #333;
  }

  p {
    color: #777;
    font-size: 0.9rem;
    margin: 0.2rem 0;
  }

  .info {
    margin-top: 1rem;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .info-item span {
    font-weight: bold;
    font-size: 1.1rem;
    color: #0070f3;
  }
`;

const LobbyList = () => {
  const router = useRouter();
  const { compId, eventId } = router.query;
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    if (eventId) {
      const fetchLobbies = async () => {
        try {
          const response = await axios.get(`/lobbies/${eventId}`);
          setLobbies(response.data);
        } catch (error) {
          console.error('Error fetching lobbies:', error);
          router.push('/login');
        }
      };

      fetchLobbies();
    }
  }, [eventId]);

  const handleSelectLobby = (lobbyId: number) => {
    router.push(`/options?compId=${compId}&eventId=${eventId}&lobbyId=${lobbyId}`);
  };

  return (
    <Layout>
      <LobbyListContainer>
        <BackButton />
        <h1>Portarias</h1>
        {lobbies.map((lobby: any) => (
          <LobbyCard key={lobby.id} onClick={() => handleSelectLobby(lobby.id)}>
            <h2>{lobby.name}</h2>
            <p>Tipo: {lobby.type}</p>
            <div className="info">
              <div className="info-item">
                <span>{lobby.total_records}</span>
                <p>Ingressos</p>
              </div>
              <div className="info-item">
                <span>{lobby.validated_record}</span>
                <p>Validados</p>
              </div>
              <div className="info-item">
                <span>{lobby.pending_record}</span>
                <p>Pendentes</p>
              </div>
            </div>
          </LobbyCard>
        ))}
      </LobbyListContainer>
    </Layout>
  );
};

export default withAuth(LobbyList);
