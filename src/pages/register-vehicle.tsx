import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Layout from '../components/Layout';
import withAuth from '../utils/withAuth';
import axios from '../utils/axios';
import BackButton from '../components/BackButton';
import LoadingModal from '../components/LoadingModal';

const VehicleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #f0f0f0;
  min-height: 100vh;
`;

const InputContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 500px;
`;

const InputField = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
  margin-bottom: 1rem;
`;

const SelectField = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
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

const DeleteButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;

  &:hover {
    background-color: #e60000;
    transform: translateY(-3px);
  }

  &:active {
    background-color: #b30000;
    transform: translateY(0);
  }
`;

const Message = styled.p<{ success?: boolean }>`
  color: ${({ success }) => (success ? 'green' : 'red')};
  font-size: 1.2rem;
  margin-top: 1rem;
`;

const Loader = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0070f3;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const VehicleList = styled.div`
  margin-top: 2rem;
  width: 100%;
  max-width: 500px;
`;

const VehicleCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  h2 {
    margin: 0.5rem 0;
    color: #333;
  }

  p {
    color: #777;
    font-size: 0.9rem;
  }
`;

const RegisterVehicle = () => {
  const [type, setType] = useState<string>('car');
  const [color, setColor] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [plate, setPlate] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const router = useRouter();
  const { ticket_code, compId } = router.query;

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`/vehicle/${ticket_code}`);
        setVehicles(response.data.vehicle ? [response.data.vehicle] : []);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    if (ticket_code) {
      fetchVehicles();
    }
  }, [ticket_code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      await axios.post('/vehicle', {
        ticket_code,
        type,
        color,
        model,
        plate,
      });

      setResult('Veículo cadastrado com sucesso!');
      setError(null);
      setType('car');
      setColor('');
      setModel('');
      setPlate('');

      const fetchVehicles = async () => {
        try {
          const response = await axios.get(`/vehicle/${ticket_code}`);
          setVehicles(response.data.vehicle ? [response.data.vehicle] : []);
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        }
      };

      await fetchVehicles();
      setProcessing(false);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Erro ao cadastrar veículo');
      setResult(null);
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    setProcessing(true);
    try {
      await axios.delete(`/vehicle/${ticket_code}`);
      setVehicles([]);
      setResult('Veículo excluído com sucesso!');
      setError(null);
      setProcessing(false);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Erro ao excluir veículo');
      setResult(null);
      setProcessing(false);
    }
  };

  const handleBackToCompanies = () => {
    router.push(`/companies`);
  };

  return (
    <Layout>
      {processing && <LoadingModal />}
      <VehicleContainer>
        <BackButton />
        <h1>{vehicles.length > 0 ? 'Detalhes do Veículo' : 'Cadastrar Veículo'}</h1>
        {vehicles.length === 0 && (
          <InputContainer>
            <form onSubmit={handleSubmit}>
              <SelectField
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled={processing}
              >
                <option value="car">Carro</option>
                <option value="motorcycle">Motocicleta</option>
              </SelectField>
              <InputField
                type="text"
                placeholder="Cor"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={processing}
              />
              <InputField
                type="text"
                placeholder="Modelo"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={processing}
              />
              <InputField
                type="text"
                placeholder="Placa"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                disabled={processing}
              />
              <SubmitButton type="submit" disabled={processing}>
                {processing ? 'Processando...' : 'Cadastrar Veículo'}
              </SubmitButton>
            </form>
            {processing && <Loader />}
            {result && <Message success>{result}</Message>}
            {error && <Message>{error}</Message>}
          </InputContainer>
        )}
        <VehicleList>
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id}>
              <h2>{vehicle.model}</h2>
              <p>Tipo: {vehicle.type}</p>
              <p>Cor: {vehicle.color}</p>
              <p>Placa: {vehicle.plate}</p>
              <DeleteButton onClick={handleDelete} disabled={processing}>
                Excluir Veículo
              </DeleteButton>
            </VehicleCard>
          ))}
        </VehicleList>
        <SubmitButton onClick={handleBackToCompanies}>
          Voltar para Empresas
        </SubmitButton>
      </VehicleContainer>
    </Layout>
  );
};

export default withAuth(RegisterVehicle);
