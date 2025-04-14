import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Badge } from "react-bootstrap";

// Component for displaying WhatsApp inquiry statistics for agents
const WhatsAppStats = ({ agentPhone }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch WhatsApp stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/whatsapp/stats/${agentPhone}`
        );
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load WhatsApp statistics");
        setLoading(false);
        console.error("Error fetching WhatsApp stats:", err);
      }
    };

    if (agentPhone) {
      fetchStats();
    }
  }, [agentPhone]);

  if (!agentPhone) return null;
  if (loading) return <p>Loading WhatsApp statistics...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!stats) return null;

  // Function to determine response time badge color
  const getResponseBadgeColor = (minutes) => {
    if (minutes <= 15) return "success";
    if (minutes <= 60) return "warning";
    return "danger";
  };

  return (
    <Card className="whatsapp-stats mb-4">
      <Card.Body>
        <Card.Title className="d-flex align-items-center">
          <i
            className="fab fa-whatsapp text-success me-2"
            style={{ fontSize: "1.5rem" }}
          ></i>
          WhatsApp Response Statistics
        </Card.Title>
        <div className="mt-3">
          <div className="d-flex justify-content-between mb-2">
            <span>Total Inquiries:</span>
            <strong>{stats.totalInquiries}</strong>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Response Rate:</span>
            <strong>{stats.responseRate.toFixed(1)}%</strong>
          </div>
          <div className="d-flex justify-content-between">
            <span>Average Response Time:</span>
            <div>
              <Badge
                bg={getResponseBadgeColor(stats.avgResponseTime)}
                className="response-time"
              >
                {stats.avgResponseTime} minutes
              </Badge>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default WhatsAppStats;
