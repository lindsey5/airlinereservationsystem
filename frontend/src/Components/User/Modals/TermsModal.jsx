import './TermsModal.css';

const TermsModal = ({setShowTerms}) => {
    return(
        <div className='modal-container'>
            <div className='main-container'>
                <div className='header'>
                    <h2>Terms and Conditions</h2>
                    <button onClick={() => window.history.back()}>X</button>
                </div>
                <div className='terms-container'>
                <section>
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                    By accessing or using our website, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, please do not use our services.
                    </p>
                </section>

                <section>
                    <h2>2. Services Offered</h2>
                    <p>
                    We provide a platform for searching, booking, modifying, and canceling flights to various domestic and international destinations, including but not limited to the Philippines, Saudi Arabia, Japan, South Korea, China, Malaysia, Singapore, and Vietnam.
                    </p>
                </section>

                <section>
                    <h2>3. Booking Process</h2>
                    <h3>Access to Services</h3>
                    <p>
                    You can access our services through our website, which is accessible on various devices, including desktop computers, laptops, tablets, and mobile phones.
                    </p>
                    <h3>Payment</h3>
                    <p>
                    All payments must be made in full at the time of booking. We accept various payment methods, including credit cards, debit cards, and e-wallets.
                    </p>
                    <h3>Confirmation</h3>
                    <p>
                    Upon successful payment, you will receive a booking confirmation via email or SMS.
                    </p>
                    <h3>Modifications and Cancellations</h3>
                    <p>
                    Changes to the passenger(s) on your flight are allowed at least 2 hours before departure, with no additional fees. Cancellations are only permitted for Gold Tier fares. For more details, please refer to the specific terms and conditions of your booking or contact our customer service.
                    </p>
                </section>

                <section>
                    <h2>4. Fares and Fees</h2>
                    <h3>Fare Class and Baggage Allowance</h3>
                    <p>
                    We offer a range of fare types, including bronze, silver, and gold tier. Each fare type has its own baggage allowance. Services like priority check-in and boarding, seat selection, excess baggage, and in-flight meals and beverages are determined by the type of flight fare selected.
                    </p>
                    <h3>Additional Fees</h3>
                    <p>Additional charges may apply for taxes and other fees.</p>
                    <h3>Currency Conversion</h3>
                    <p>
                    Fares may be displayed in multiple currencies. However, all payments will be processed in the local currency of the country where the booking is made.
                    </p>
                    <h3>Delays and Cancellations</h3>
                    <p>
                    In Philippine airlines, it's common for them to state that they are not responsible for delays or cancellations caused by factors outside their control, such as weather conditions or air traffic control issues. However, for situations within their control, such as operational delays or cancellations, they typically offer compensation or rebooking options, in line with local regulations. For example, in the Philippines, the Civil Aeronautics Board (CAB) provides guidelines for passenger rights in cases of flight disruptions.
                    </p>
                    <h3>Lost or Damaged Baggage</h3>
                    <p>
                    Airlines typically limit their liability for lost or damaged baggage based on international conventions, such as the Montreal Convention or Warsaw Convention. This often means compensation is capped at a specific amount (e.g., approximately $1,700 for international flights under the Montreal Convention).
                    </p>
                    <h3>Passenger Responsibilities</h3>
                    <p>
                    Passengers are usually required to notify the airline within a specific timeframe to claim compensation for lost or damaged baggage.
                    </p>
                    <h3>Compensation Policies</h3>
                    <p>
                    Terms often specify how compensation for delays, cancellations, or denied boarding will be provided—such as meal vouchers, accommodations, refunds, or flight credits.
                    </p>
                </section>

                <section>
                    <h2>5. Passenger Responsibilities and Data Privacy</h2>
                    <h3>Passenger Responsibilities</h3>
                    <h4>Check-in Procedures</h4>
                    <p>
                    You may check in at the airport counter.
                    </p>
                    <h4>Identification</h4>
                    <p>
                    You must present a valid government-issued identification document, such as a passport or driver's license.
                    </p>
                    <h4>Security Screening</h4>
                    <p>
                    You must comply with all security screening procedures, including removing items from your carry-on baggage and going through metal detectors.
                    </p>
                    <h4>Health Requirements</h4>
                    <p>
                    You may be required to present proof of vaccination or a negative COVID-19 test, depending on the specific travel requirements of your destination.
                    </p>
                </section>

                <section>
                    <h3>Data Privacy</h3>
                    <p>
                    We collect and process your personal information in accordance with the Data Privacy Act (DPA) of 2012. We are committed to protecting your personal information and have implemented the following security measures:
                    </p>
                    <ul>
                    <li>Encryption: All sensitive data, such as payment information and personal details, are encrypted during transmission and storage.</li>
                    <li>Secure Servers: Data is stored in servers with advanced security protocols to prevent breaches.</li>
                    <li>Access Controls: Only authorized personnel can access sensitive customer information.</li>
                    <li>Periodic Audits: Regular security assessments are conducted to identify and resolve vulnerabilities.</li>
                    <li>DPA Compliance: Adherence to privacy principles of transparency, legitimate purpose, and proportionality, as outlined in the DPA.</li>
                    </ul>
                    <p>
                    We may share your personal information with the following entities:
                    </p>
                    <ul>
                    <li>Government Authorities: Required by Philippine law to share passenger information with agencies such as the Bureau of Immigration, Department of Health, or Philippine National Police for immigration, security, or health monitoring.</li>
                    <li>Partner Airlines and Services: Data may be shared with partner airlines (e.g., code-share agreements) or service providers such as hotels and car rental companies for bundled travel services.</li>
                    <li>Service Providers: Third-party vendors for payment processing, marketing campaigns, or IT system management are required to comply with the DPA and maintain strict confidentiality.</li>
                    </ul>
                    <h4>You have the following rights under the Data Privacy Act:</h4>
                    <ul>
                    <li>Right to Be Informed: Airlines must disclose how and why they collect personal data.</li>
                    <li>Right to Access: Passengers can request copies of their personal information.</li>
                    <li>Right to Rectification and Erasure: Customers can correct inaccurate data or request deletion if it's no longer needed.</li>
                    <li>Right to File Complaints: Passengers can lodge complaints with the National Privacy Commission (NPC) if they believe their data rights have been violated.</li>
                    </ul>
                    <p>
                    By using our services, you consent to the collection, use, and disclosure of your personal information as described in this Privacy Policy.
                    </p>
                </section>
                </div>
                <div>
                    <button onClick={() => setShowTerms(false)}>Accept Terms</button>
                </div>
            </div>
        </div>
    )
}

export default TermsModal