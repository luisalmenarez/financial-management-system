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
import { DollarSign, Users, BarChart3, LogOut, Menu, X } from 'lucide-react';

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {/* Botón Hamburguesa - Solo Mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className='lg:hidden fixed top-2 left-4 z-50 bg-white p-2 rounded-md shadow-md'
      >
        {sidebarOpen ? (
          <X className='h-6 w-6 text-gray-900' />
        ) : (
          <Menu className='h-6 w-6 text-gray-900' />
        )}
      </button>
      {/* Overlay para cerrar sidebar en mobile */}
      {sidebarOpen && (
        <div
          className='lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30'
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar/Aside */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className='px-4 py-12 flex flex-col justify-between h-full'>
          <div>
            <h1 className='text-2xl text-center font-bold text-gray-900 mb-8'>
              Sistema de Gestión Financiera
            </h1>
          </div>

          <div className='flex flex-col items-center gap-4'>
            <div className='text-center'>
              <p className='text-sm font-medium text-gray-900'>{user?.name}</p>
              <p className='text-xs text-gray-500'>({user?.role})</p>
            </div>
            <Button
              variant='outline'
              onClick={handleSignOut}
              className='w-full'
            >
              <LogOut className='h-4 w-4 mr-2' />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className='lg:ml-64 min-h-screen'>
        <section className='p-6 lg:p-10 max-[800px]:p-4'>
          <div className='mb-8 mt-12 lg:mt-0'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
              Menú Principal
            </h2>
            <p className='text-gray-600'>Seleccione una opción para comenzar</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl'>
            {/* Sistema de Gestión de Ingresos y Gastos */}
            <Card
              className='hover:shadow-lg transition-shadow cursor-pointer'
              onClick={() => {
                router.push('/transactions');
                setSidebarOpen(false);
              }}
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
                onClick={() => {
                  router.push('/users');
                  setSidebarOpen(false);
                }}
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
                className='hover:shadow-lg transition-shadow cursor-pointer md:col-span-2 xl:col-span-1'
                onClick={() => {
                  router.push('/reports');
                  setSidebarOpen(false);
                }}
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
        </section>
      </main>
    </div>
  );
};

export default Home;
