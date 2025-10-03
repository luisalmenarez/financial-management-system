import { NextApiResponse } from 'next';
import { withAdmin, AuthenticatedRequest } from '@/lib/auth/middleware';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     description: Actualiza el nombre y/o rol de un usuario (solo administradores)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Usuario no encontrado
 */
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  if (req.method === 'PUT') {
    try {
      const { name, role, phone } = req.body;

      // Validación de rol
      if (role && !['USER', 'ADMIN'].includes(role)) {
        return res.status(400).json({
          error: 'El rol debe ser USER o ADMIN',
        });
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(role && { role }),
          ...(phone !== undefined && { phone }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      });

      return res.status(200).json(user);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      console.error('Error al actualizar usuario:', error);
      return res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}

const wrappedHandler = withAdmin(handler);
export default wrappedHandler;
