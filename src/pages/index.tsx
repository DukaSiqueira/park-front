import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Layout from '../components/Layout';

const HomeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f0f0f0 0%, #c0c0c0 100%);
  padding: 1rem;
`;

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/companies');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <Layout>
      <HomeContainer>
        <h1>Redirecionando...</h1>
      </HomeContainer>
    </Layout>
  );
};

export default Home;
