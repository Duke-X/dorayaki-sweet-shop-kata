const ContactPage = () => {
    return (
      <div style={{ paddingTop: '100px', minHeight: '80vh' }} className="container">
        <h2 className="section-title">Contact Us</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap' }}>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', flex: 1, minWidth: '300px' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--color-teal)' }}>Visit Our Boutique</h3>
                <p>Sector-32 A, Jamalpur, Ludhiana</p>
                <p>Punjab, India 141010</p>
                <br/>
                <p><strong>Hours:</strong> 10:00 AM - 10:00 PM</p>
            </div>
            
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', flex: 1, minWidth: '300px'  }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--color-teal)' }}>Get in Touch</h3>
                <p>Email: helpdesk@dorayaki.com</p>
                <p>Phone: +91 98765 43210</p>
                <br />
                <button className="btn btn-secondary">Send us a message</button>
            </div>
        </div>
      </div>
    );
  };
  export default ContactPage;
