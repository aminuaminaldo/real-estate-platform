import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Row, Col } from "react-bootstrap";

// Component for filtering properties by company
const CompanyFilter = ({ onFilterChange }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/companies");
        setCompanies(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load companies");
        setLoading(false);
        console.error("Error fetching companies:", err);
      }
    };

    fetchCompanies();
  }, []);

  // Handle company selection change
  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    onFilterChange(companyId);
  };

  // Handle filter reset
  const handleReset = () => {
    setSelectedCompany("");
    onFilterChange("");
  };

  if (loading) return <p>Loading companies...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="company-filter p-3 bg-light rounded mb-4">
      <h5>Filter by Real Estate Company</h5>
      <Row>
        <Col md={8}>
          <Form.Group>
            <Form.Select
              value={selectedCompany}
              onChange={handleCompanyChange}
              aria-label="Select company"
            >
              <option value="">All Companies</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Button
            variant="outline-secondary"
            onClick={handleReset}
            className="w-100"
          >
            Reset Filter
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default CompanyFilter;
