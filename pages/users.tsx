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
import { Edit, Pencil, Trash } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { Layout } from '@/components/ui/layout';

const Users = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setloadingTransactions] = useState(false);
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
      } else if ('role' in data.user && data.user.role !== 'ADMIN') {
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
    setloadingTransactions(true);
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
    } finally {
      setloadingTransactions(false);
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

  const handleDelete = async (id = '') => {
    if (!confirm('¿Está seguro que desea eliminar este usuario?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        alert('Usuario eliminado exitosamente');
        fetchUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el usuario seleccionado.');
    }
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
        <Loading loading={loading} />
      </div>
    );
  }

  return (
    <Layout user={user} showNavMenu={true}>
      {/* Main Content */}
      <main>
        <div className='mt-12 lg:mt-0'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            Gestión de Usuarios
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
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
                        <TableCell className='flex gap-2'>
                          <Button
                            onClick={() => handleEdit(usr)}
                            variant='edit'
                            size='sm'
                          >
                            <Pencil className='size-4' />
                          </Button>
                          <Button
                            onClick={() => handleDelete(usr.id)}
                            variant='delete'
                            size='sm'
                          >
                            <Trash className='size-4 text-red-500' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <CardContent>
                  {loadingTransactions && users.length === 0 ? (
                    <>
                      <p className='mt-4'>Cargando Usuarios</p>
                      <Loading
                        className='h-full'
                        loading={loadingTransactions}
                        size={10}
                      />
                    </>
                  ) : (
                    <div>
                      {users.length === 0 && (
                        <p className='text-center text-gray-500 py-4'>
                          <p className='text-center text-gray-500 py-4'>
                            No hay usuarios registrados
                          </p>
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialog de Editar Usuario */}
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
    </Layout>
  );
};

export default Users;
