import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import BannerAd from "../components/BannerAd";
import WhatsAppStats from "../components/WhatsAppStats";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/properties/${id}`
        );
        setProperty(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load property details");
        setLoading(false);
        console.error("Error fetching property:", err);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const handleWhatsAppInquiry = () => {
    // In a real application, this would initiate a WhatsApp chat
    // For this task, we'll simulate by creating an inquiry via the API
    if (property) {
      axios
        .post("http://localhost:5000/api/whatsapp/webhook", {
          customerPhone: "+1234567890", // This would be the user's phone in a real app
          agentPhone: property.company?.contactPhone || "+0987654321",
          propertyId: property.id,
          message: `I'm interested in the property at ${property.address}`,
          customerName: "Test Customer",
        })
        .then((response) => {
          alert("WhatsApp inquiry sent successfully!");
        })
        .catch((error) => {
          console.error("Error sending WhatsApp inquiry:", error);
          alert("Failed to send WhatsApp inquiry. Please try again.");
        });
    }
  };

  if (loading)
    return (
      <Container className="my-5">
        <p>Loading property details...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="my-5">
        <p className="text-danger">{error}</p>
      </Container>
    );

  if (!property)
    return (
      <Container className="my-5">
        <p>Property not found</p>
      </Container>
    );

  return (
    <Container className="my-5">
      {/* Banner Ad */}
      <Row className="mb-4">
        <Col>
          <BannerAd location="property_detail" />
        </Col>
      </Row>

      {/* Property Tier Badge */}
      {property.tier === "Premium" && (
        <div className="mb-4">
          <span className="badge bg-warning text-dark p-2 fs-6">
            <i className="fas fa-star me-1"></i> Premium Property
          </span>
        </div>
      )}

      {/* Property Title and Price */}
      <Row className="mb-4">
        <Col>
          <h1>{property.title}</h1>
          <h3 className="text-primary">${property.price.toLocaleString()}</h3>
          <p className="text-muted">
            {property.address}, {property.city}, {property.state}{" "}
            {property.zipCode}
          </p>
        </Col>
      </Row>

      {/* Property Image and Details */}
      <Row className="mb-5">
        <Col md={8}>
          <img
            src={
              property.imageUrl ||
              "https://via.placeholder.com/800x500?text=Property+Image"
            }
            alt={property.title}
            className="img-fluid rounded mb-4"
            style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
          />

          <h4>Description</h4>
          <p>
            {property.description ||
              "No description available for this property."}
          </p>

          <Row className="mt-4 text-center">
            <Col md={3} xs={6} className="mb-3">
              <Card>
                <Card.Body>
                  <h5>{property.bedrooms}</h5>
                  <p className="text-muted mb-0">Bedrooms</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} xs={6} className="mb-3">
              <Card>
                <Card.Body>
                  <h5>{property.bathrooms}</h5>
                  <p className="text-muted mb-0">Bathrooms</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} xs={6} className="mb-3">
              <Card>
                <Card.Body>
                  <h5>{property.area} m²</h5>
                  <p className="text-muted mb-0">Area</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} xs={6} className="mb-3">
              <Card>
                <Card.Body>
                  <h5>{property.tier}</h5>
                  <p className="text-muted mb-0">Tier</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col md={4}>
          {/* Company Information */}
          {property.company && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Listed By</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  {property.company.logo ? (
                    <img
                      src={property.company.logo}
                      alt={property.company.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        marginRight: "15px",
                      }}
                    />
                  ) : null}
                  <h5 className="mb-0">{property.company.name}</h5>
                </div>

                <ListGroup variant="flush">
                  {property.company.contactEmail && (
                    <ListGroup.Item>
                      <i className="fas fa-envelope me-2"></i>
                      {property.company.contactEmail}
                    </ListGroup.Item>
                  )}
                  {property.company.contactPhone && (
                    <ListGroup.Item>
                      <i className="fas fa-phone me-2"></i>
                      {property.company.contactPhone}
                    </ListGroup.Item>
                  )}
                  {property.company.address && (
                    <ListGroup.Item>
                      <i className="fas fa-map-marker-alt me-2"></i>
                      {property.company.address}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          )}

          {/* WhatsApp Stats */}
          {property.company && property.company.contactPhone && (
            <WhatsAppStats agentPhone={property.company.contactPhone} />
          )}

          {/* Contact Button */}
          <Button
            variant="success"
            size="lg"
            className="w-100 mb-3"
            onClick={handleWhatsAppInquiry}
          >
            <i className="fab fa-whatsapp me-2"></i>
            Inquire via WhatsApp
          </Button>

          <Button variant="outline-primary" size="lg" className="w-100">
            <i className="fas fa-phone me-2"></i>
            Call Agent
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PropertyDetailPage;
