import { NextApiResponse } from 'next';
import { withAdmin, AuthenticatedRequest } from '@/lib/auth/middleware';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Obtener reporte financiero
 *     description: Retorna datos para el reporte de movimientos financieros (solo administradores)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del reporte
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalIncome:
 *                   type: number
 *                 totalExpense:
 *                   type: number
 *                 balance:
 *                   type: number
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       concept:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       date:
 *                         type: string
 *                       type:
 *                         type: string
 *                       user:
 *                         type: object
 *                 monthlyData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       income:
 *                         type: number
 *                       expense:
 *                         type: number
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Obtener todas las transacciones
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

      // Calcular totales
      const totalIncome = transactions
        .filter((t) => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpense = transactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

      const balance = totalIncome - totalExpense;

      // Agrupar por mes para el gráfico
      const monthlyData = transactions.reduce((acc: any, transaction) => {
        const monthKey = new Date(transaction.date).toLocaleDateString(
          'es-ES',
          {
            year: 'numeric',
            month: 'short',
          }
        );

        if (!acc[monthKey]) {
          acc[monthKey] = { month: monthKey, income: 0, expense: 0 };
        }

        if (transaction.type === 'INCOME') {
          acc[monthKey].income += transaction.amount;
        } else {
          acc[monthKey].expense += transaction.amount;
        }

        return acc;
      }, {});

      const monthlyDataArray = Object.values(monthlyData);

      return res.status(200).json({
        totalIncome,
        totalExpense,
        balance,
        transactions,
        monthlyData: monthlyDataArray,
      });
    } catch (error) {
      console.error('Error al generar reporte:', error);
      return res.status(500).json({ error: 'Error al generar reporte' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}

const wrappedHandler = withAdmin(handler);
export default wrappedHandler;
