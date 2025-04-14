import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import BannerAd from "../components/BannerAd";
import PropertyCard from "../components/PropertyCard";

const HomePage = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        // Get premium and featured properties for homepage
        const response = await axios.get(
          "http://localhost:5000/api/properties"
        );
        // Filter to get only premium and featured properties, limited to 6
        const featured = response.data
          .filter(
            (property) =>
              property.tier === "Premium" || property.tier === "Featured"
          )
          .slice(0, 6);
        setFeaturedProperties(featured);
        setLoading(false);
      } catch (err) {
        setError("Failed to load featured properties");
        setLoading(false);
        console.error("Error fetching properties:", err);
      }
    };

    fetchFeaturedProperties();
  }, []);

  return (
    <Container>
      {/* Banner Ad Section */}
      <Row className="my-4">
        <Col>
          <BannerAd location="homepage" />
        </Col>
      </Row>

      {/* Hero Section */}
      <Row className="my-5 text-center">
        <Col>
          <h1>Find Your Dream Property</h1>
          <p className="lead">
            Discover premium real estate listings from top companies
          </p>
        </Col>
      </Row>

      {/* Featured Properties Section */}
      <Row className="mb-5">
        <Col xs={12}>
          <h2 className="mb-4">Featured Properties</h2>
        </Col>

        {loading ? (
          <Col>
            <p>Loading featured properties...</p>
          </Col>
        ) : error ? (
          <Col>
            <p className="text-danger">{error}</p>
          </Col>
        ) : (
          featuredProperties.map((property) => (
            <Col key={property.id} xs={12} md={6} lg={4} className="mb-4">
              <PropertyCard property={property} />
            </Col>
          ))
        )}
      </Row>

      {/* Call to Action */}
      <Row className="my-5 py-5 bg-light rounded">
        <Col className="text-center">
          <h3>Ready to find your perfect property?</h3>
          <p>Browse our complete collection of premium real estate listings</p>
          <a href="/properties" className="btn btn-primary btn-lg">
            View All Properties
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
