import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import axios from '../utils/axios';
import Layout from '../components/Layout';
import withAuth from '../utils/withAuth';
import BackButton from '../components/BackButton';

const CompanyListContainer = styled.div`
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

const CompanyCard = styled.div`
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

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company: any) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCompany = (companyId: number) => {
    router.push(`/events?compId=${companyId}`);
  };

  return (
    <Layout>
      <CompanyListContainer>
        <BackButton />
        <h1>Empresas</h1>
        <SearchInput
          type="text"
          placeholder="Buscar empresas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredCompanies.map((company: any) => (
          <CompanyCard key={company.id} onClick={() => handleSelectCompany(company.id)}>
            <h2>{company.name}</h2>
            <p>{company.slug}</p>
          </CompanyCard>
        ))}
      </CompanyListContainer>
    </Layout>
  );
};

export default withAuth(CompanyList);
