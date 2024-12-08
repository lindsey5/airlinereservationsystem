import React from 'react';
import "./Page.css";

const PrivacyPolicy = () => {
  return (
    <div className="page">
      {/* Title Section */}
      <div className="title-section">
        <h1 id="title">Privacy Policy</h1>
      </div>

      {/* Privacy Policy Content */}
      <div className="terms-container">

        <section>
          <h2>Your Privacy is Important to Us</h2>
          <p>
            CloudPeak Airlines is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and protect your personal information when you use our website, or services.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <p>We may collect the following types of personal information:</p>
          <ul>
            <li><strong>Personal Information:</strong> Name, date of birth, gender, nationality, passport number, contact information (phone number, email address, home address)</li>
            <li><strong>Payment Information:</strong> Credit card or other payment information</li>
            <li><strong>Travel Preferences:</strong> Frequent flyer program details, seating preferences, meal preferences, special assistance requests</li>
            <li><strong>Booking History:</strong> Flight itineraries, booking confirmations, and past travel information</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <p>We use your personal information for the following purposes:</p>
          <ul>
            <li><strong>Processing Bookings:</strong> To process your flight bookings, payments, and reservations.</li>
            <li><strong>Providing Services:</strong> To provide you with the services you request, such as flight information, check-in, baggage services, and special assistance.</li>
            <li><strong>Improving Customer Experience:</strong> To enhance your travel experience by personalizing our services and offering tailored recommendations.</li>
            <li><strong>Marketing and Promotions:</strong> To send you marketing communications, promotions, and updates about our products and services.</li>
            <li><strong>Compliance with Legal Obligations:</strong> To comply with legal and regulatory requirements, such as immigration, customs, and security regulations.</li>
          </ul>
        </section>

        <section>
          <h2>Sharing Your Information</h2>
          <p>We may share your personal information with the following entities:</p>
          <ul>
            <li><strong>Government Authorities:</strong> To comply with legal requirements and for security purposes.</li>
            <li><strong>Partner Airlines:</strong> To facilitate seamless travel experiences and fulfill booking requests.</li>
            <li><strong>Service Providers:</strong> To process payments, provide IT services, or conduct marketing campaigns.</li>
          </ul>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>We implement strong security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include:</p>
          <ul>
            <li><strong>Encryption:</strong> Sensitive data is encrypted to protect it during transmission and storage.</li>
            <li><strong>Secure Servers:</strong> We use secure servers to store your personal information.</li>
            <li><strong>Access Controls:</strong> Only authorized personnel have access to your information.</li>
            <li><strong>Regular Security Audits:</strong> We conduct regular security audits to identify and address vulnerabilities.</li>
          </ul>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request access to your personal information.</li>
            <li><strong>Rectification:</strong> Request correction of any inaccuracies in your personal information.</li>
            <li><strong>Erasure:</strong> Request deletion of your personal information.</li>
            <li><strong>Restriction:</strong> Request restriction of processing your personal information.</li>
            <li><strong>Data Portability:</strong> Request transfer of your personal information to another data controller.</li>
            <li><strong>Object:</strong> Object to processing your personal information for direct marketing purposes.</li>
            <li><strong>Withdraw Consent:</strong> Withdraw your consent to the processing of your personal information.</li>
          </ul>
        </section>

        <section>
          <h2>Data Retention</h2>
          <p>We retain your personal data only as long as necessary to fulfill the purposes outlined in this policy or as required by law.</p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>Our website uses cookies to enhance your browsing experience. Cookies help us analyze website traffic and customize content to your preferences. You can choose to disable cookies in your browser settings.</p>
        </section>

        <section>
          <h2>Updates to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised effective date.</p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>If you have any questions or concerns about our Privacy Policy or the handling of your personal information, please contact our customer service department.</p>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
