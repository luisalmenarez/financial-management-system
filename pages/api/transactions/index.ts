import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Obtener todas las transacciones
 *     description: Retorna la lista de todas las transacciones (ingresos y egresos) del sistema
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de transacciones
 *       401:
 *         description: No autorizado
 *   post:
 *     summary: Crear nueva transacción
 *     description: Crea un nuevo ingreso o egreso (solo administradores)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - concept
 *               - amount
 *               - date
 *               - type
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
 *       201:
 *         description: Transacción creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const transactions = await prisma.transaction.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
      });

      return res.status(200).json(transactions);
    } catch (error) {
      console.error('Error al obtener transacciones:', error);
      return res.status(500).json({ error: 'Error al obtener transacciones' });
    }
  }

  if (req.method === 'POST') {
    // Solo admins pueden crear transacciones
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        error:
          'Acceso denegado. Solo administradores pueden crear transacciones.',
      });
    }

    try {
      const { concept, amount, date, type } = req.body;

      // Validación de datos
      if (!concept || !amount || !date || !type) {
        return res.status(400).json({
          error: 'Todos los campos son requeridos: concept, amount, date, type',
        });
      }

      if (!['INCOME', 'EXPENSE'].includes(type)) {
        return res.status(400).json({
          error: 'El tipo debe ser INCOME o EXPENSE',
        });
      }

      const parsedAmount =
        typeof amount === 'string' ? parseFloat(amount) : amount;

      if (
        typeof parsedAmount !== 'number' ||
        parsedAmount <= 0 ||
        isNaN(parsedAmount)
      ) {
        return res.status(400).json({
          error: 'El monto debe ser un número positivo',
        });
      }

      const transaction = await prisma.transaction.create({
        data: {
          concept,
          amount: parsedAmount,
          date: new Date(date),
          type,
          userId: req.user!.id,
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

      return res.status(201).json(transaction);
    } catch (error) {
      console.error('Error al crear transacción:', error);
      return res.status(500).json({ error: 'Error al crear transacción' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}

export default withAuth(handler);
