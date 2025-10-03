import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

/**
 * Página de documentación de la API
 * Renderiza la interfaz de Swagger UI con la especificación OpenAPI
 */
export default function ApiDocs() {
  return (
    <div>
      <SwaggerUI url='/api/docs' />
    </div>
  );
}
