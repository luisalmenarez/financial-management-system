import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Github } from 'lucide-react';

const Login = () => {
  const handleGitHubLogin = async () => {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/',
    });
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl'>
            Sistema de Gestión Financiera
          </CardTitle>
          <CardDescription>
            Inicie sesión para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className='w-full' onClick={handleGitHubLogin}>
            <Github className='h-5 w-5 mr-2' />
            Continuar con GitHub
          </Button>
          <p className='text-xs text-center text-gray-500 mt-4'>
            Al iniciar sesión, se le asignará automáticamente el rol de
            Administrador
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
