import React from "react";
import { Card, Badge, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

// Component for displaying property cards with tier highlighting
const PropertyCard = ({ property }) => {
  // Function to determine badge color based on tier
  const getBadgeVariant = (tier) => {
    switch (tier) {
      case "Premium":
        return "warning"; // Gold color for Premium
      case "Featured":
        return "secondary"; // Silver color for Featured
      default:
        return "light"; // Light color for Standard
    }
  };

  // Function to determine card class based on tier
  const getCardClass = (tier) => {
    switch (tier) {
      case "Premium":
        return "premium-property";
      case "Featured":
        return "featured-property";
      default:
        return "";
    }
  };

  return (
    <Card className={`mb-4 property-card ${getCardClass(property.tier)}`}>
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={
            property.imageUrl ||
            "https://via.placeholder.com/300x200?text=Property+Image"
          }
          alt={property.title}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <Badge
          bg={getBadgeVariant(property.tier)}
          className="position-absolute top-0 end-0 m-2"
        >
          {property.tier}
        </Badge>
      </div>
      <Card.Body>
        <Card.Title>{property.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {property.address}, {property.city}
        </Card.Subtitle>
        <Card.Text className="fs-4 fw-bold text-primary">
          ${property.price.toLocaleString()}
        </Card.Text>

        <Row className="text-center mb-3">
          <Col>
            <small className="text-muted d-block">Bedrooms</small>
            <span>{property.bedrooms}</span>
          </Col>
          <Col>
            <small className="text-muted d-block">Bathrooms</small>
            <span>{property.bathrooms}</span>
          </Col>
          <Col>
            <small className="text-muted d-block">Area</small>
            <span>{property.area} m²</span>
          </Col>
        </Row>

        {property.company && (
          <div className="d-flex align-items-center mb-3">
            {property.company.logo ? (
              <img
                src={property.company.logo}
                alt={property.company.name}
                style={{ width: "30px", height: "30px", marginRight: "10px" }}
              />
            ) : null}
            <small>{property.company.name}</small>
          </div>
        )}

        <Link
          to={`/properties/${property.id}`}
          className="btn btn-outline-primary w-100"
        >
          View Details
        </Link>
      </Card.Body>
    </Card>
  );
};

export default PropertyCard;
