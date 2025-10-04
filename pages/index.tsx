import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth/client';
import { Layout } from '@/components/ui/layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { DollarSign, Users, BarChart3 } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await authClient.getSession();
      if (!data?.user) {
        router.push('/login');
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };
    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loading loading={loading} />
      </div>
    );
  }

  const isAdmin = user?.role === 'ADMIN';

  return (
    <Layout user={user} showNavMenu={true}>
      <div className='mb-6'>
        <h2 className='text-xl font-semibold text-gray-800 mb-2'>
          Menú Principal
        </h2>
        <p className='text-gray-600'>Seleccione una opción para comenzar</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Sistema de Gestión de Ingresos y Gastos */}
        <Card
          className='hover:shadow-lg transition-shadow cursor-pointer'
          onClick={() => router.push('/transactions')}
        >
          <CardHeader>
            <div className='flex items-center justify-between'>
              <DollarSign className='h-8 w-8 text-green-600' />
            </div>
            <CardTitle className='mt-4'>Ingresos y Egresos</CardTitle>
            <CardDescription>
              Gestione los movimientos financieros del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className='w-full'>Acceder</Button>
          </CardContent>
        </Card>

        {/* Gestión de Usuarios - Solo Admin */}
        {isAdmin && (
          <Card
            className='hover:shadow-lg transition-shadow cursor-pointer'
            onClick={() => router.push('/users')}
          >
            <CardHeader>
              <div className='flex items-center justify-between'>
                <Users className='h-8 w-8 text-blue-600' />
              </div>
              <CardTitle className='mt-4'>Gestión de Usuarios</CardTitle>
              <CardDescription>
                Administre los usuarios del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className='w-full'>Acceder</Button>
            </CardContent>
          </Card>
        )}

        {/* Reportes - Solo Admin */}
        {isAdmin && (
          <Card
            className='hover:shadow-lg transition-shadow cursor-pointer md:col-span-2'
            onClick={() => router.push('/reports')}
          >
            <CardHeader>
              <div className='flex items-center justify-between'>
                <BarChart3 className='h-8 w-8 text-purple-600' />
              </div>
              <CardTitle className='mt-4'>Reportes</CardTitle>
              <CardDescription>
                Visualice reportes y exporte datos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className='w-full'>Acceder</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Home;
