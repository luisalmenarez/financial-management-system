import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from './index';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
  };
}

/**
 * Middleware para verificar autenticación
 * Valida que el usuario esté autenticado antes de procesar la solicitud
 */
export function withAuth(
  handler: (
    req: AuthenticatedRequest,
    res: NextApiResponse
  ) => Promise<void | NextApiResponse>
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Better Auth necesita el objeto Request completo
      const session = await auth.api.getSession({
        headers: {
          cookie: req.headers.cookie || '',
        },
      });

      if (!session?.user) {
        return res.status(401).json({ error: 'No autorizado' });
      }

      req.user = session.user as any;
      return await handler(req, res);
    } catch (error) {
      console.error('Error de autenticación:', error);
      return res.status(401).json({ error: 'No autorizado' });
    }
  };
}

/**
 * Middleware para verificar rol de administrador
 * Valida que el usuario esté autenticado y tenga rol ADMIN
 */
export function withAdmin(
  handler: (
    req: AuthenticatedRequest,
    res: NextApiResponse
  ) => Promise<void | NextApiResponse>
) {
  return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Acceso denegado. Se requiere rol de administrador.',
      });
    }
    return await handler(req, res);
  });
}
