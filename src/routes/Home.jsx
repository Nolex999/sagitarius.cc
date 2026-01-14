// src/routes/Home.jsx
export default function Home() {
  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ fontSize: '3rem' }}>SAGITARIUS</h1>
      <p>Bienvenue sur le Dashboard (Home)</p>
      <button 
        onClick={() => window.location.href = '/login'}
        style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '20px' }}
      >
        Retour au Login
      </button>
    </div>
  );
}