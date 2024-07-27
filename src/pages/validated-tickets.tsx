import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Layout from '../components/Layout';
import withAuth from '../utils/withAuth';
import axios from '../utils/axios';
import BackButton from '../components/BackButton';

const ValidatedTicketsContainer = styled.div`
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

const TicketCard = styled.div`
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

  p {
    color: #777;
    font-size: 0.9rem;
  }
`;

const ValidatedTickets = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (eventId) {
      const fetchTickets = async () => {
        try {
          const response = await axios.get(`/validated-tickets/${eventId}`);
          setTickets(response.data);
        } catch (error) {
          console.error('Error fetching tickets:', error);
        }
      };

      fetchTickets();
    }
  }, [eventId]);

  const filteredTickets = tickets.filter((ticket: any) =>
    ticket.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTicketClick = (ticketCode: string) => {
    router.push(`/register-vehicle?ticket_code=${ticketCode}`);
  };

  return (
    <Layout>
      <ValidatedTicketsContainer>
        <BackButton />
        <h1>Ingressos Validados</h1>
        <SearchInput
          type="text"
          placeholder="Buscar pelo código do ingresso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredTickets.map((ticket: any) => (
          <TicketCard key={ticket.id} onClick={() => handleTicketClick(ticket.code)}>
            <h2>{ticket.code}</h2>
            <p>{ticket.ticketName}</p>
            <p>{ticket.batchName}</p>
            <p>{ticket.userName}</p>
          </TicketCard>
        ))}
      </ValidatedTicketsContainer>
    </Layout>
  );
};

export default withAuth(ValidatedTickets);
