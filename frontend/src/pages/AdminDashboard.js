import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tabs, Tab, Form, Button, Table, Alert } from 'react-bootstrap';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('banners');
  const [banners, setBanners] = useState([]);
  const [properties, setProperties] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [whatsappInquiries, setWhatsappInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Banner form state
  const [bannerForm, setBannerForm] = useState({
    title: '',
    imageUrl: 'https://via.placeholder.com/800x200?text=Banner+Ad',
    targetLink: '',
    displayLocation: 'all',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    priority: 0,
    isActive: true
  });

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        switch (activeTab) {
          case 'banners':
            const bannersResponse = await axios.get('http://localhost:5000/api/banners');
            setBanners(bannersResponse.data);
            break;
          case 'properties':
            const propertiesResponse = await axios.get('http://localhost:5000/api/properties');
            setProperties(propertiesResponse.data);
            break;
          case 'companies':
            const companiesResponse = await axios.get('http://localhost:5000/api/companies');
            setCompanies(companiesResponse.data);
            break;
          case 'whatsapp':
            const whatsappResponse = await axios.get('http://localhost:5000/api/whatsapp/inquiries');
            setWhatsappInquiries(whatsappResponse.data);
            break;
          default:
            break;
        }

        setLoading(false);
      } catch (err) {
        setError(`Failed to load ${activeTab} data`);
        setLoading(false);
        console.error(`Error fetching ${activeTab} data:`, err);
      }
    };

    fetchData();
  }, [activeTab]);

  // Handle banner form input changes
  const handleBannerInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBannerForm({
      ...bannerForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle banner form submission
  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/banners', bannerForm);
      
      // Refresh banners list
      const response = await axios.get('http://localhost:5000/api/banners');
      setBanners(response.data);
      
      // Reset form
      setBannerForm({
        title: '',
        imageUrl: 'https://via.placeholder.com/800x200?text=Banner+Ad',
        targetLink: '',
        displayLocation: 'all',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        priority: 0,
        isActive: true
      });
      
      setSuccessMessage('Banner created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to create banner');
      console.error('Error creating banner:', err);
    }
  };

  // Handle banner deletion
  const handleDeleteBanner = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await axios.delete(`http://localhost:5000/api/banners/${id}`);
        
        // Refresh banners list
        const response = await axios.get('http://localhost:5000/api/banners');
        setBanners(response.data);
        
        setSuccessMessage('Banner deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError('Failed to delete banner');
        console.error('Error deleting banner:', err);
      }
    }
  };

  // Handle property tier update
  const handlePropertyTierUpdate = async (id, tier) => {
    try {
      await axios.put(`http://localhost:5000/api/properties/${id}`, { tier });
      
      // Refresh properties list
      const response = await axios.get('http://localhost:5000/api/properties');
      setProperties(response.data);
      
      setSuccessMessage('Property tier updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update property tier');
      console.error('Error updating property tier:', err);
    }
  };

  // Check for duplicate properties
  const checkDuplicateProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/whatsapp/duplicate-check');
      alert(`Found ${response.data.length} potential duplicate properties. Check console for details.`);
      console.log('Potential duplicates:', response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to check for duplicates');
      setLoading(false);
      console.error('Error checking duplicates:', err);
    }
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="banners" title="Banner Management">
          <Row>
            <Col md={5}>
              <h3>Add New Banner</h3>
              <Form onSubmit={handleBannerSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={bannerForm.title}
                    onChange={handleBannerInputChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="imageUrl"
                    value={bannerForm.imageUrl}
                    onChange={handleBannerInputChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Target Link</Form.Label>
                  <Form.Control
                    type="text"
                    name="targetLink"
                    value={bannerForm.targetLink}
                    onChange={handleBannerInputChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Display Location</Form.Label>
                  <Form.Select
                    name="displayLocation"
                    value={bannerForm.displayLocation}
                    onChange={handleBannerInputChange}
                  >
                    <option value="all">All Pages</option>
                    <option value="homepage">Homepage</option>
                    <option value="property_listing">Property Listing</option>
                    <option value="property_detail">Property Detail</option>
                  </Form.Select>
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={bannerForm.startDate}
                        onChange={handleBannerInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={bannerForm.endDate}
                        onChange={handleBannerInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Priority (0-10)</Form.Label>
                  <Form.Control
                    type="number"
                    name="priority"
                    min="0"
                    max="10"
                    value={bannerForm.priority}
                    onChange={handleBannerInputChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Active"
                    name="isActive"
                    checked={bannerForm.isActive}
                    onChange={handleBannerInputChange}
                  />
                </Form.Group>
                
                <Button variant="primary" type="submit">
                  Add Banner
                </Button>
              </Form>
            </Col>
            
            <Col md={7}>
              <h3>Existing Banners</h3>
              {loading ? (
                <p>Loading banners...</p>
              ) : banners.length === 0 ? (
                <p>No banners found.</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Location</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banners.map(banner => (
                      <tr key={banner.id}>
                        <td>{banner.title}</td>
                        <td>{banner.displayLocation}</td>
                        <td>{banner.priority}</td>
                        <td>
                          <span className={`badge bg-${banner.isActive ? 'success' : 'danger'}`}>
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteBanner(banner.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Col>
          </Row>
        </Tab>
        
        <Tab eventKey="properties" title="Property Management">
          <Row className="mb-4">
            <Col>
              <Button variant="primary" onClick={checkDuplicateProperties}>
                Check for Duplicate Properties
              </Button>
            </Col>
          </Row>
          
          <h3>Property Tier Management</h3>
          {loading ? (
            <p>Loading properties...</p>
          ) : properties.length === 0 ? (
            <p>No properties found.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Address</th>
                  <th>Price</th>
                  <th>Company</th>
                  <th>Current Tier</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(property => (
                  <tr key={property.id}>
                    <td>{property.title}</td>
                    <td>{property.address}, {property.city}</td>
                    <td>${property.price.toLocaleString()}</td>
                    <td>{property.company?.name || 'N/A'}</td>
                    <td>
                      <span className={`badge bg-${
                        property.tier === 'Premium' ? 'warning text-dark' :
                        property.tier === 'Featured' ? 'secondary' : 'light text-dark'
                      }`}>
                        {property.tier}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant={property.tier === 'Premium' ? 'warning' : 'outline-warning'}
                          size="sm"
                          onClick={() => handlePropertyTierUpdate(property.id, 'Premium')}
                          disabled={property.tier === 'Premium'}
                        >
                          Premium
                        </Button>
                        <Button
                          variant={property.tier === 'Featured' ? 'secondary' : 'outline-secondary'}
                          size="sm"
                          onClick={() => handlePropertyTierUpdate(property.id, 'Featured')}
                          disabled={property.tier === 'Featured'}
                        >
                          Featured
                        </Button>
                        <Button
                          variant={property.tier === 'Standard' ? 'light' : 'outline-light'}
                          size="sm"
                          onClick={() => handlePropertyTierUpdate(property.id, 'Standard')}
                          disabled={property.tier === 'Standard'}
                        >
                          Standard
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>
        
        <Tab eventKey="whatsapp" title="WhatsApp Inquiries">
          <h3>WhatsApp Inquiry Management</h3>
          {loading ? (
            <p>Loading WhatsApp inquiries...</p>
          ) : whatsappInquiries.length === 0 ? (
            <p>No WhatsApp inquiries found.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Property</th>
                  <th>Message</th>
                  <th>Inquiry Time</th>
                  <th>Response Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {whatsappInquiries.map(inquiry => (
                  <tr key={inquiry.id}>
                    <td>
                      {inquiry.customerName}<br />
                      <small>{inquiry.customerPhone}</small>
                    </td>
                    <td>{inquiry.property?.title || 'N/A'}</td>
                    <td>{inquiry.message}</td>
                    <td>{new Date(inquiry.inquiryTime).toLocaleString()}</td>
                    <td>
                      {inquiry.responseTime ? (
                        <>
                          {new Date(inquiry.responseTime).toLocaleString()}<br />
                          <small className="text-muted">
                            ({inquiry.responseTimeInMinutes} minutes)
                          </small>
                        </>
                      ) : 'Not responded'}
                    </td>
                    <td>
                      <span className={`badg
(Content truncated due to size limit. Use line ranges to read in chunks)