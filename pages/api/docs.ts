import { NextApiRequest, NextApiResponse } from 'next';
import { swaggerSpec } from '@/lib/swagger';

/**
 * Endpoint para servir la documentación OpenAPI/Swagger
 * Accesible en /api/docs
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(swaggerSpec);
}
