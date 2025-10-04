import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useRouter } from 'next/router';
import { Download } from 'lucide-react';
import { Layout } from '@/components/ui/layout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Loading } from '@/components/ui/loading';

const Reports = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await authClient.getSession();
      if (!data?.user) {
        router.push('/login');
      } else if ((data.user as any).role !== 'ADMIN') {
        router.push('/');
      } else {
        setUser(data.user);
        fetchReportData();
      }
      setLoading(false);
    };
    checkSession();
  }, [router]);

  const fetchReportData = async () => {
    try {
      const response = await fetch('/api/reports', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (error) {
      console.error('Error al obtener datos del reporte:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/reports/export', {
        credentials: 'include',
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error al exportar reporte:', error);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loading loading={loading} />
      </div>
    );
  }

  return (
    <Layout user={user} showNavMenu={true}>
      {/* Main Content */}
      <main>
        <div className='mt-12 lg:mt-0'>
          {/* Header con título y botón exportar */}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
            <h2 className='text-2xl font-bold text-gray-900'>
              Reportes Financieros
            </h2>
            <Button onClick={handleExport}>
              <Download className='h-4 w-4 mr-2' />
              Exportar CSV
            </Button>
          </div>

          {/* Resumen - Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Total Ingresos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-3xl font-bold text-green-600'>
                  ${reportData?.totalIncome?.toFixed(2) || '0.00'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Total Egresos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-3xl font-bold text-red-600'>
                  ${reportData?.totalExpense?.toFixed(2) || '0.00'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Saldo Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-3xl font-bold ${
                    (reportData?.balance || 0) >= 0
                      ? 'text-blue-600'
                      : 'text-red-600'
                  }`}
                >
                  ${reportData?.balance?.toFixed(2) || '0.00'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico */}
          <Card>
            <CardHeader>
              <CardTitle>Movimientos por Mes</CardTitle>
              <CardDescription>
                Visualización de ingresos y egresos mensuales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='h-96'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={reportData?.monthlyData || []}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='month' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='income' fill='#10b981' name='Ingresos' />
                    <Bar dataKey='expense' fill='#ef4444' name='Egresos' />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
};

export default Reports;
