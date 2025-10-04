import { useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  Home,
  LogOut,
  DollarSign,
  Users,
  BarChart3,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  user: any;
  title?: string;
  showNavMenu?: boolean;
}

export const Layout = ({
  children,
  user,
  title,
  showNavMenu = false,
}: LayoutProps) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/login');
  };

  const navItems = [
    {
      label: 'Inicio',
      icon: Home,
      path: '/',
      show: true,
    },
    {
      label: 'Ingresos y Egresos',
      icon: DollarSign,
      path: '/transactions',
      show: true,
    },
    {
      label: 'Gestión de Usuarios',
      icon: Users,
      path: '/users',
      show: user?.role === 'ADMIN',
    },
    {
      label: 'Reportes',
      icon: BarChart3,
      path: '/reports',
      show: user?.role === 'ADMIN',
    },
  ];

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

            {/* Menú de navegación - Solo si showNavMenu es true */}
            {showNavMenu && (
              <nav className='space-y-2'>
                {navItems
                  .filter((item) => item.show)
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = router.pathname === item.path;

                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          router.push(item.path);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className='h-5 w-5' />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
              </nav>
            )}

            {/* Si no hay menú de navegación, solo botón de inicio */}
            {!showNavMenu && (
              <nav className='space-y-2'>
                <button
                  onClick={() => {
                    router.push('/');
                    setSidebarOpen(false);
                  }}
                  className='w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
                >
                  <Home className='h-5 w-5' />
                  <span>Inicio</span>
                </button>
              </nav>
            )}
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
      <main className='lg:ml-64 min-h-screen p-6 lg:p-10'>
        <div className='mt-12 lg:mt-0 max-w-[1080px] mx-auto'>
          {title && (
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>{title}</h2>
          )}
          {children}
        </div>
      </main>
    </div>
  );
};
