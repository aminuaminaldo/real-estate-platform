import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";

// Component for displaying banner ads
const BannerAd = ({ location = "homepage" }) => {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/banners?location=${location}`
        );
        setBanners(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load banner ads");
        setLoading(false);
        console.error("Error fetching banners:", err);
      }
    };

    fetchBanners();
  }, [location]);

  // Rotate banners automatically
  useEffect(() => {
    if (banners.length <= 1) return;

    const rotationInterval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(rotationInterval);
  }, [banners]);

  if (loading) return <p>Loading ads...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (banners.length === 0) return null;

  const currentBanner = banners[currentBannerIndex];

  return (
    <div className="banner-container">
      <Card className="border-0">
        <a
          href={currentBanner.targetLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Card.Img
            src={currentBanner.imageUrl}
            alt={currentBanner.title}
            className="banner-image"
          />
        </a>
        {banners.length > 1 && (
          <div className="banner-indicators d-flex justify-content-center mt-2">
            {banners.map((_, index) => (
              <div
                key={index}
                className={`indicator mx-1 ${
                  index === currentBannerIndex ? "active" : ""
                }`}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor:
                    index === currentBannerIndex ? "#007bff" : "#ccc",
                  cursor: "pointer",
                }}
                onClick={() => setCurrentBannerIndex(index)}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default BannerAd;
