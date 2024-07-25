import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import axios from '../utils/axios';
import Layout from '../components/Layout';
import withAuth from '../utils/withAuth';

const EventListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #f0f0f0;
  min-height: 100vh;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 0.8rem;
  margin-bottom: 2rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    border-color: #0070f3;
    box-shadow: 0 0 5px rgba(0, 112, 243, 0.2);
    outline: none;
  }
`;

const EventCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
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
`;

const Events = () => {
  const router = useRouter();
  const { compId } = router.query;
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (compId) {
      const fetchEvents = async () => {
        try {
          const response = await axios.get(`/events/${compId}`);
          setEvents(response.data);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };

      fetchEvents();
    }
  }, [compId]);

  const filteredEvents = events.filter((event: any) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEventClick = (eventId: number) => {
    router.push(`/lobbies?eventId=${eventId}`);
  };

  return (
    <Layout>
      <EventListContainer>
        <h1>Eventos</h1>
        <SearchInput
          type="text"
          placeholder="Buscar eventos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredEvents.map((event: any) => (
          <EventCard key={event.id} onClick={() => handleEventClick(event.id)}>
            <h2>{event.name}</h2>
          </EventCard>
        ))}
      </EventListContainer>
    </Layout>
  );
};

export default withAuth(Events);
