import { Link } from 'react-router-dom';


const Home = () => {
    return (
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                Welcome to PrimeGenetics
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#4b5563', maxWidth: '600px', margin: '0 auto 2rem' }}>
                The premier digital marketplace connecting dairy farmers to superior bull genetics and verified veterinary AI services.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Link
                    to="/catalog"
                    style={{
                        padding: '1rem 2rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                    }}
                >
                    Browse Catalog
                </Link>
                <Link
                    to="/register"
                    style={{
                        padding: '1rem 2rem',
                        backgroundColor: 'white',
                        color: '#3b82f6',
                        border: '2px solid #3b82f6',
                        textDecoration: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                    }}
                >
                    Join as Farmer
                </Link>
            </div>

            <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', flex: '1', minWidth: '250px', maxWidth: '300px' }}>
                    <h3 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '1rem' }}>Premium Genetics</h3>
                    <p style={{ color: '#4b5563' }}>Access high-quality bull semen from top breeders with verified genetic merit.</p>
                </div>
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', flex: '1', minWidth: '250px', maxWidth: '300px' }}>
                    <h3 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '1rem' }}>Verified Vets</h3>
                    <p style={{ color: '#4b5563' }}>Find and book licensed veterinary AI technicians in your local area easily.</p>
                </div>
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', flex: '1', minWidth: '250px', maxWidth: '300px' }}>
                    <h3 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '1rem' }}>Secure Ordering</h3>
                    <p style={{ color: '#4b5563' }}>Complete your purchases securely with our seamless checkout process.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
