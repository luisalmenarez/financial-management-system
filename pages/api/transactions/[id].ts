import { NextApiResponse } from 'next';
import { withAdmin, AuthenticatedRequest } from '@/lib/auth/middleware';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Actualizar transacción
 *     description: Actualiza una transacción existente (solo administradores)
 *     tags: [Transactions]
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
 *               concept:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date-time
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *     responses:
 *       200:
 *         description: Transacción actualizada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Transacción no encontrada
 *   delete:
 *     summary: Eliminar transacción
 *     description: Elimina una transacción (solo administradores)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transacción eliminada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Transacción no encontrada
 */
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  if (req.method === 'PUT') {
    try {
      const { concept, amount, date, type } = req.body;

      // Validación
      if (type && !['INCOME', 'EXPENSE'].includes(type)) {
        return res.status(400).json({
          error: 'El tipo debe ser INCOME o EXPENSE',
        });
      }

      if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
        return res.status(400).json({
          error: 'El monto debe ser un número positivo',
        });
      }

      const transaction = await prisma.transaction.update({
        where: { id },
        data: {
          ...(concept && { concept }),
          ...(amount && { amount }),
          ...(date && { date: new Date(date) }),
          ...(type && { type }),
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return res.status(200).json(transaction);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Transacción no encontrada' });
      }
      console.error('Error al actualizar transacción:', error);
      return res.status(500).json({ error: 'Error al actualizar transacción' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.transaction.delete({
        where: { id },
      });

      return res
        .status(200)
        .json({ message: 'Transacción eliminada exitosamente' });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Transacción no encontrada' });
      }
      console.error('Error al eliminar transacción:', error);
      return res.status(500).json({ error: 'Error al eliminar transacción' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}

const wrappedHandler = withAdmin(handler);
export default wrappedHandler;
