import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch('/api/docs')
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((err) => console.error('Error cargando spec:', err));
  }, []);

  if (!spec) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <p>Cargando documentación...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 py-6'>
          <h1 className='text-3xl font-bold text-gray-900'>
            API Documentation
          </h1>
          <p className='text-gray-600 mt-2'>
            Sistema de Gestión Financiera - Prueba Técnica Fullstack
          </p>
        </div>
      </div>
      <div className='max-w-7xl mx-auto'>
        <SwaggerUI spec={spec} />
      </div>
    </div>
  );
}
