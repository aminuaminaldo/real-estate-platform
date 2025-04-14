import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <div className="row">
          <div className="col-md-6">
            <h5>Real Estate Platform</h5>
            <p>Find your dream property with our premium listings</p>
          </div>
          <div className="col-md-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/properties" className="text-white">
                  Properties
                </a>
              </li>
              <li>
                <a href="/contact" className="text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Contact</h5>
            <address className="mb-0">
              <p>Email: info@realestate.com</p>
              <p>Phone: +1 234 567 8900</p>
            </address>
          </div>
        </div>
        <div className="text-center mt-3">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Real Estate Platform. All rights
            reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
