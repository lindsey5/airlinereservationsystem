import React from "react";
import "./FAQ.css";

const FAQ = () => {
  return (
    <div className="faq-page">
      <div className="faq-title-section">
        <h1 id="faq-name">FAQ's</h1>
      </div>
      <div className="faq-container">
        <section>
          <h2>Booking and Payments</h2>
          <ul>
            <li>
              <strong>How can I book a flight on your website?</strong>
              <p>
                Simply follow the steps on our website to search for your
                desired flights, select your preferred options, and proceed to
                payment.
              </p>
            </li>
            <li>
              <strong>What payment methods do you accept?</strong>
              <p>
                We accept [list of accepted payment methods, e.g., credit
                cards, debit cards, bank transfers, online wallets].
              </p>
            </li>
            <li>
              <strong>Can I cancel my flight?</strong>
              <p>
                Yes, you can cancel your flight. However, the specific terms and conditions
                may vary depending on the fare type and timing. You are allowed to cancel the flight at least 24 hours before its scheduled departure.
              </p>
            </li>
            <li>
                <strong>Can I rebook a flight?</strong>
                <p>
                    No, rebooking a flight is not possible. However, you can cancel it, although this depends on the fare type of the flight.
                </p>
            </li>
            <li>
                <strong>Can I modify the passenger/s of my flight?</strong>
                <p>
                Yes, you can modify the passenger(s) on your flight, but this is only allowed at least 2 hours before the scheduled departure.
                </p>
            </li>
            <li>
              <strong>What happens if my flight is delayed or canceled?</strong>
              <p>
                In case of delays or cancellations, we will provide you with
                updates and alternative arrangements. Compensation policies may
                apply, depending on the circumstances and applicable
                regulations.
              </p>
            </li>
            <li>
              <strong>How can I check my booking status?</strong>
              <p>
                You can check your booking status by logging in your account in the website
              </p>
            </li>
            <li>
              <strong>What are the payment methods</strong>
              <p>
              We offer multiple payment options, including credit/debit cards, GCash, and Maya, to make your transaction as convenient as possible.
              </p>
            </li>
            <li>
              <strong>There's a discount for senior citizen and PWD?</strong>
              <p>
                Yes, there's a 20% discount for senior citizen and PWD for domestic flights in the Philippines, in accordance with Republic Act No. 9994 and Republic Act No. 7277.
              </p>
            </li>
          </ul>
        </section>
        <section>
          <h2>Baggage and Special Services</h2>
          <ul>
            <li>
              <strong>What is the baggage allowance for my flight?</strong>
              <p>
                Baggage allowance varies depending on the fare type.
                Please refer to your booking confirmation or contact our
                customer service for specific details.
              </p>
            </li>
            <li>
              <strong>
                Can I bring special items, such as sports equipment or musical
                instruments, on my flight?
              </strong>
              <p>
                Yes, you can bring special items, but there may be additional
                fees and restrictions. Please contact our customer service for
                more information.
              </p>
            </li>
            <li>
              <strong>
                Can I request special assistance, such as wheelchair assistance
                or medical assistance?
              </strong>
              <p>
                Yes, you can request special assistance by during the booking process or at least 48
                hours before your flight.
              </p>
            </li>
          </ul>
        </section>
        <section>
          <h2>Data Privacy and Security</h2>
          <ul>
            <li>
              <strong>How do you protect my personal information?</strong>
              <p>
                We are committed to protecting your personal information. We
                implement various security measures, including encryption,
                secure servers, and access controls.
              </p>
            </li>
            <li>
              <strong>How do you use my personal information?</strong>
              <p>
                We use your personal information to process your bookings,
                provide customer support, and improve our services. We may also
                use your information for marketing purposes, but you can opt out
                of these communications at any time.
              </p>
            </li>
            <li>
              <strong>Do you share my personal information with third parties?</strong>
              <p>
                We may share your personal information with trusted third-party
                service providers, such as payment processors and airlines, to
                fulfill your booking and provide related services. We will only
                share the necessary information and require these third parties
                to comply with strict data privacy standards.
              </p>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default FAQ;