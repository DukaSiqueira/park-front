import styled from 'styled-components';
import Layout from '../components/Layout';

const CarListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
  padding: 1rem;
`;

const CarList = () => {
  return (
    <Layout>
      <CarListContainer>
        <h1>Lista de Carros</h1>
      </CarListContainer>
    </Layout>
  );
};

export default CarList;
