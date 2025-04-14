import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import CompanyFilter from "../components/CompanyFilter";
import PropertyCard from "../components/PropertyCard";
import BannerAd from "../components/BannerAd";

const PropertyListingPage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    companyId: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    city: "",
  });

  // Fetch all properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/properties"
        );
        setProperties(response.data);
        setFilteredProperties(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load properties");
        setLoading(false);
        console.error("Error fetching properties:", err);
      }
    };

    fetchProperties();
  }, []);

  // Handle company filter change
  const handleCompanyFilterChange = (companyId) => {
    setFilters({ ...filters, companyId });
  };

  // Handle other filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...properties];

    // Filter by company
    if (filters.companyId) {
      filtered = filtered.filter(
        (property) => property.companyId === parseInt(filters.companyId)
      );
    }

    // Filter by price range
    if (filters.minPrice) {
      filtered = filtered.filter(
        (property) => property.price >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(
        (property) => property.price <= parseFloat(filters.maxPrice)
      );
    }

    // Filter by bedrooms
    if (filters.bedrooms) {
      filtered = filtered.filter(
        (property) => property.bedrooms >= parseInt(filters.bedrooms)
      );
    }

    // Filter by bathrooms
    if (filters.bathrooms) {
      filtered = filtered.filter(
        (property) => property.bathrooms >= parseInt(filters.bathrooms)
      );
    }

    // Filter by city
    if (filters.city) {
      filtered = filtered.filter((property) =>
        property.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    setFilteredProperties(filtered);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      companyId: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      city: "",
    });
    setFilteredProperties(properties);
  };

  // Apply filters when filters state changes
  useEffect(() => {
    applyFilters();
  }, [filters.companyId]); // Only auto-apply when company filter changes

  return (
    <Container>
      <h1 className="my-4">Property Listings</h1>

      {/* Banner Ad */}
      <Row className="mb-4">
        <Col>
          <BannerAd location="property_listing" />
        </Col>
      </Row>

      {/* Filters Section */}
      <Row className="mb-4">
        <Col xs={12}>
          <CompanyFilter onFilterChange={handleCompanyFilterChange} />
        </Col>

        <Col xs={12}>
          <div className="bg-light p-3 rounded">
            <h5>Additional Filters</h5>
            <Row>
              <Col md={6} lg={3} className="mb-2">
                <Form.Group>
                  <Form.Label>Min Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min Price"
                  />
                </Form.Group>
              </Col>
              <Col md={6} lg={3} className="mb-2">
                <Form.Group>
                  <Form.Label>Max Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max Price"
                  />
                </Form.Group>
              </Col>
              <Col md={6} lg={2} className="mb-2">
                <Form.Group>
                  <Form.Label>Bedrooms</Form.Label>
                  <Form.Control
                    type="number"
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={handleFilterChange}
                    placeholder="Min Bedrooms"
                  />
                </Form.Group>
              </Col>
              <Col md={6} lg={2} className="mb-2">
                <Form.Group>
                  <Form.Label>Bathrooms</Form.Label>
                  <Form.Control
                    type="number"
                    name="bathrooms"
                    value={filters.bathrooms}
                    onChange={handleFilterChange}
                    placeholder="Min Bathrooms"
                  />
                </Form.Group>
              </Col>
              <Col md={12} lg={2} className="mb-2">
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    placeholder="City"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Button
                  variant="primary"
                  onClick={applyFilters}
                  className="me-2"
                >
                  Apply Filters
                </Button>
                <Button variant="outline-secondary" onClick={resetFilters}>
                  Reset All
                </Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {/* Property Listings */}
      <Row>
        {loading ? (
          <Col>
            <p>Loading properties...</p>
          </Col>
        ) : error ? (
          <Col>
            <p className="text-danger">{error}</p>
          </Col>
        ) : filteredProperties.length === 0 ? (
          <Col>
            <p>No properties found matching your criteria.</p>
          </Col>
        ) : (
          filteredProperties.map((property) => (
            <Col key={property.id} xs={12} md={6} lg={4} className="mb-4">
              <PropertyCard property={property} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default PropertyListingPage;
