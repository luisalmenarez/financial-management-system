import { NextApiResponse } from 'next';
import { withAdmin, AuthenticatedRequest } from '@/lib/auth/middleware';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/reports/export:
 *   get:
 *     summary: Exportar reporte a CSV
 *     description: Descarga el reporte de transacciones en formato CSV (solo administradores)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo CSV
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
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

      // Crear CSV
      const csvHeader = 'Concepto,Monto,Fecha,Tipo,Usuario\n';
      const csvRows = transactions
        .map((t) => {
          const date = new Date(t.date).toLocaleDateString('es-ES');
          const type = t.type === 'INCOME' ? 'Ingreso' : 'Egreso';
          return `"${t.concept}",${t.amount},"${date}","${type}","${t.user.name}"`;
        })
        .join('\n');

      const csvSummary = `\n\nResumen\nTotal Ingresos,${totalIncome}\nTotal Egresos,${totalExpense}\nSaldo,${balance}`;

      const csv = csvHeader + csvRows + csvSummary;

      // Configurar headers para descarga
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=reporte-${Date.now()}.csv`
      );
      res.setHeader('Cache-Control', 'no-cache');

      return res.status(200).send('\uFEFF' + csv); // BOM para UTF-8
    } catch (error) {
      console.error('Error al exportar reporte:', error);
      return res.status(500).json({ error: 'Error al exportar reporte' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}

const wrappedHandler = withAdmin(handler);
export default wrappedHandler;
