import { useState } from 'react';
import axios from '../utils/axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';

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
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    border-color: #0070f3;
    box-shadow: 0 0 5px rgba(0, 112, 243, 0.2);
    outline: none;
  }
`;

const Button = styled.button`
  padding: 0.8rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #005bb5;
  }

  &:active {
    background-color: #003a75;
  }
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
  color: #333;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { email, password });
      localStorage.setItem('token', response.data.token);
      router.push('/companies');
    } catch (error) {
      console.error('Login error', error);
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Login</Title>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <Button type="submit">Login</Button>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
