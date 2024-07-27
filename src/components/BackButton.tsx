import { useRouter } from 'next/router';
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
`;

const Button = styled.button`
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 0.8rem;
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

  display: flex;
  align-items: center;
  justify-content: center;
`;

const BackButton = () => {
  const router = useRouter();

  return (
    <ButtonContainer>
      <Button onClick={() => router.back()}>
        <FaArrowLeft />
      </Button>
    </ButtonContainer>
  );
};

export default BackButton;
