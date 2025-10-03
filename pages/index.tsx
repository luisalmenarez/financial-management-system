import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/router';
import { DollarSign, Users, BarChart3, LogOut } from 'lucide-react';

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

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p>Cargando...</p>
      </div>
    );
  }

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center'>
          <h1 className='text-2xl font-bold text-gray-900'>
            Sistema de Gestión Financiera
          </h1>
          <div className='flex items-center gap-4'>
            <span className='text-sm text-gray-600'>
              {user?.name} ({user?.role})
            </span>
            <Button variant='outline' onClick={handleSignOut}>
              <LogOut className='h-4 w-4 mr-2' />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
        <div className='mb-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-2'>
            Menú Principal
          </h2>
          <p className='text-gray-600'>Seleccione una opción para comenzar</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
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
              className='hover:shadow-lg transition-shadow cursor-pointer'
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
      </main>
    </div>
  );
};

export default Home;
