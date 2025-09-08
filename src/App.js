import React, { useState, useEffect } from 'react';

//const CLOUDRUN_API_URL = 'https://34.54.185.15.nip.io/cloud-proxy';
const CLOUDRUN_API_URL = 'https://cloudrun-demo-838175488064.us-east4.run.app/';

const App = () => {
  const [endpoints, setEndpoints] = useState([]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEndpoints = async () => {
      try {
        const res = await fetch(CLOUDRUN_API_URL);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setEndpoints(data.endpoints);
      } catch (e) {
        setError("Failed to fetch endpoints. Please check the API URL and CORS settings.");
        console.error("Error fetching endpoints:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchEndpoints();
  }, []);

  const handleClick = async (endpoint) => {
    setLoading(true);
    setResponse('');
    setError(null);
    const traceTag = window.dtrum && window.dtrum.traceId;
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      if (traceTag) {
        headers['x-dt-trace-tag'] = traceTag;
      }
      const res = await fetch(`${CLOUDRUN_API_URL}${endpoint}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const text = await res.text();
      setResponse(text);
    } catch (e) {
      setError(`Failed to send request to ${endpoint}.`);
      console.error("Error sending request:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.appContainer}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <img src="https://placehold.co/100x100/3B82F6/FFFFFF?text=Logo" alt="Logo" style={styles.logo} />
        </div>
        <h1 style={styles.title}>Simulador de Peticiones</h1>
        <p style={styles.subtitle}>Selecciona un endpoint para interactuar con la API</p>
        
        <div style={styles.buttonsContainer}>
          {endpoints.length > 0 ? (
            endpoints.map((endpoint) => (
              <button
                key={endpoint}
                onClick={() => handleClick(endpoint)}
                style={styles.button}
              >
                {endpoint}
              </button>
            ))
          ) : (
            <p style={styles.errorText}>No se encontraron endpoints disponibles.</p>
          )}
        </div>

        {error && (
          <div style={styles.errorBox}>
            <strong>Error:</strong>
            <span style={{ marginLeft: '8px' }}>{error}</span>
          </div>
        )}

        <div style={styles.responseBox}>
          <h2 style={styles.responseTitle}>Respuesta del Servidor</h2>
          {response ? (
            <pre style={styles.preformattedText}>{response}</pre>
          ) : (
            <p style={styles.placeholderText}>
              Haz clic en un botón para obtener una respuesta...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  appContainer: {
    backgroundColor: '#f3f4f6',
    minHeight: '100vh',
    fontFamily: 'sans-serif',
    color: '#1f2937',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    width: '100%',
    maxWidth: '960px',
    transition: 'transform 0.3s ease',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '32px',
  },
  logo: {
    borderRadius: '50%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: '16px',
    color: '#2563eb',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '18px',
    marginBottom: '32px',
    color: '#4b5563',
  },
  buttonsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '32px',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '9999px',
    fontWeight: '700',
    fontSize: '18px',
    background: 'linear-gradient(to right, #3b82f6, #4f46e5)',
    color: '#ffffff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: 'none',
    cursor: 'pointer',
  },
  responseBox: {
    marginTop: '32px',
    padding: '24px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  },
  responseTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#2563eb',
  },
  preformattedText: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    fontSize: '14px',
    overflowX: 'auto',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  placeholderText: {
    color: '#6b7280',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    color: '#b91c1c',
    padding: '12px 16px',
    borderRadius: '8px',
    position: 'relative',
    margin: '16px 0',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
    borderRadius: '50%',
    height: '64px',
    width: '64px',
    borderTop: '4px solid #3b82f6',
    borderBottom: '4px solid #3b82f6',
  },
};

export default App;
