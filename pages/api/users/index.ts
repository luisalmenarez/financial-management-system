import { NextApiResponse } from 'next';
import { withAdmin, AuthenticatedRequest } from '@/lib/auth/middleware';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Retorna la lista de todos los usuarios registrados (solo administradores)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum: [USER, ADMIN]
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}

const wrappedHandler = withAdmin(handler);
export default wrappedHandler;
