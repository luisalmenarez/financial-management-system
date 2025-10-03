import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/router';
import { ArrowLeft, Edit } from 'lucide-react';

const Users = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'USER',
    phone: '',
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await authClient.getSession();
      if (!data?.user) {
        router.push('/login');
      } else if (data.user.role !== 'ADMIN') {
        router.push('/');
      } else {
        setUser(data.user);
        fetchUsers();
      }
      setLoading(false);
    };
    checkSession();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      role: user.role,
      phone: user.phone || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setDialogOpen(false);
        fetchUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar usuario');
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        Cargando...
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            <Button variant='outline' onClick={() => router.push('/')}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Volver
            </Button>
            <h1 className='text-2xl font-bold text-gray-900'>
              Gestión de Usuarios
            </h1>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((usr) => (
                  <TableRow key={usr.id}>
                    <TableCell>{usr.name}</TableCell>
                    <TableCell>{usr.email}</TableCell>
                    <TableCell>{usr.phone || '-'}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          usr.role === 'ADMIN'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {usr.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleEdit(usr)}
                      >
                        <Edit className='h-4 w-4 mr-1' />
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Editar Usuario</DialogTitle>
                <DialogDescription>
                  Modifique la información del usuario
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='name'>Nombre</Label>
                  <Input
                    id='name'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='phone'>Teléfono</Label>
                  <Input
                    id='phone'
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='role'>Rol</Label>
                  <select
                    id='role'
                    className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option value='USER'>Usuario</option>
                    <option value='ADMIN'>Administrador</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type='submit'>Guardar Cambios</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Users;
