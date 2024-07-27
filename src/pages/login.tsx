import { useState } from 'react';
import axios from '../utils/axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import LoadingModal from '../components/LoadingModal';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const InputField = styled.input`
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem;
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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setLoading(false);
      router.push('/');
    } catch (error) {
      console.error('Login error', error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      {loading && <LoadingModal />}
      <LoginContainer>
        <LoginForm onSubmit={handleSubmit}>
          <InputField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <InputField
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <SubmitButton type="submit">Login</SubmitButton>
        </LoginForm>
      </LoginContainer>
    </Layout>
  );
};

export default Login;
