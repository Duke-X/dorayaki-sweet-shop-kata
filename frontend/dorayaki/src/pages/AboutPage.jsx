const AboutPage = () => {
  return (
    <div style={{ paddingTop: '100px', minHeight: '80vh' }} className="container">
      <h2 className="section-title">Our Journey</h2>
      <div style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.2rem', color: '#444', textAlign: 'left' }}>
        <p style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
          Dorayaki started with a vision to redefine Indian sweets. Blending the royal heritage of the Mughal kitchens with modern finesse, we create confections that are not just food, but art.
        </p>
        <p style={{ marginBottom: '2rem', lineHeight: '1.8' }}>
          Every piece is handcrafted using the finest saffron from Kashmir, rose petals from Kannauj, and premium chocolate.
        </p>
        
        <div style={{ textAlign: 'justify', margin: '3rem 0 1.5rem' }}>
            <span style={{ fontSize: '1.5rem', color: 'var(--color-teal)', fontWeight: 'bold', borderBottom: '2px solid var(--color-gold)', paddingBottom: '0.5rem' }}>
                Why 'Dorayaki'?
            </span>
        </div>
        
        <p style={{ lineHeight: '1.8' }}>
          You might wonder why an Indian Mithai shop carries a Japanese name. It is a tribute to our global story. Our founder established successful franchises in Japan, serving authentic Indian Mithai to the Japanese people. We bring that same standard of excellence and international love back to our roots here.
        </p>
      </div>
    </div>
  );
};
export default AboutPage;
