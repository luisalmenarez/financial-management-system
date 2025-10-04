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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/router';
import { ArrowLeft, Plus, Pencil, Trash } from 'lucide-react';

const Transactions = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    concept: '',
    amount: '',
    date: '',
    type: 'INCOME',
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false); // Pencil edit
  const [editingTransaction, setEditingTransaction] = useState<any>(null); // Pencil edit

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await authClient.getSession();
      if (!data?.user) {
        router.push('/login');
      } else {
        setUser(data.user);
        fetchTransactions();
      }
      setLoading(false);
    };
    checkSession();
  }, [router]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error al obtener transacciones:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (response.ok) {
        setDialogOpen(false);
        setFormData({ concept: '', amount: '', date: '', type: 'INCOME' });
        fetchTransactions();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al crear transacción');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear transacción');
    }
  };

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    setFormData({
      concept: transaction.concept,
      amount: transaction.amount.toString(),
      date: new Date(transaction.date).toISOString().split('T')[0],
      type: transaction.type,
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/transactions/${editingTransaction.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            ...formData,
            amount: parseFloat(formData.amount),
          }),
        }
      );

      if (response.ok) {
        setEditDialogOpen(false);
        setEditingTransaction(null);
        setFormData({ concept: '', amount: '', date: '', type: 'INCOME' });
        fetchTransactions();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al actualizar transacción');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar transacción');
    }
  };

  const handleDelete = async (id = '') => {
    if (!confirm('¿Está seguro que desea eliminar esta transacción?')) {
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        alert('Transacción eliminada exitosamente');
        fetchTransactions();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al eliminar transacción');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar la transacción seleccionada.');
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        Cargando...
      </div>
    );
  }

  const isAdmin = user?.role === 'ADMIN';

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
              Ingresos y Egresos
            </h1>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Lista de Transacciones</CardTitle>
            {isAdmin && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className='h-4 w-4 mr-2' />
                    Nueva Transacción
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>Nueva Transacción</DialogTitle>
                      <DialogDescription>
                        Agregue un nuevo ingreso o egreso al sistema
                      </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                      <div className='grid gap-2'>
                        <Label htmlFor='concept'>Concepto</Label>
                        <Input
                          id='concept'
                          value={formData.concept}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              concept: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className='grid gap-2'>
                        <Label htmlFor='amount'>Monto</Label>
                        <Input
                          id='amount'
                          type='number'
                          step='0.01'
                          value={formData.amount}
                          onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className='grid gap-2'>
                        <Label htmlFor='date'>Fecha</Label>
                        <Input
                          id='date'
                          type='date'
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className='grid gap-2'>
                        <Label htmlFor='type'>Tipo</Label>
                        <select
                          id='type'
                          className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                          value={formData.type}
                          onChange={(e) =>
                            setFormData({ ...formData, type: e.target.value })
                          }
                        >
                          <option value='INCOME'>Ingreso</option>
                          <option value='EXPENSE'>Egreso</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type='submit'>Guardar</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.concept}</TableCell>
                    <TableCell className='font-medium'>
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString('es-CO', {
                        timeZone: 'UTC',
                      })}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          transaction.type === 'INCOME'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.type === 'INCOME' ? 'Ingreso' : 'Egreso'}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.user.name}</TableCell>
                    <TableCell className='flex justify-start gap-6'>
                      {/* Validación de permisos para editar transacciones */}

                      {isAdmin && (
                        <div className='flex'>
                          <div className='flex hover:bg-slate-200 w-10 h-10 rounded-full justify-center items-center'>
                            {/* Button pencil edit  */}
                            <div className='flex hover:bg-slate-200 w-10 h-10 rounded-full justify-center items-center cursor-pointer'>
                              <Pencil
                                className='size-4'
                                onClick={() => handleEdit(transaction)}
                              />
                            </div>
                            {/* Button pencil edit  */}
                          </div>
                          {/* Button trash delete */}
                          <div className='flex hover:bg-red-300 w-10 h-10 rounded-full justify-center items-center cursor-pointer'>
                            <Trash
                              className='size-4 text-red-500'
                              onClick={() => handleDelete(transaction.id)}
                            >
                              <Button className='h-4 w-4' />
                              Eliminar
                            </Trash>
                          </div>
                        </div>
                      )}

                      {/* Button trash delete */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {transactions.length === 0 && (
              <p className='text-center text-gray-500 py-4'>
                No hay transacciones registradas
              </p>
            )}
          </CardContent>
        </Card>

        {/* Dialog de EDITAR - FUERA del map */}
        {isAdmin && (
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
              <form onSubmit={handleEditSubmit}>
                <DialogHeader>
                  <DialogTitle>Editar Transacción</DialogTitle>
                  <DialogDescription>
                    Modifique los datos de la transacción
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='edit-concept'>Concepto</Label>
                    <Input
                      id='edit-concept'
                      value={formData.concept}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          concept: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='edit-amount'>Monto</Label>
                    <Input
                      id='edit-amount'
                      type='number'
                      step='0.01'
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amount: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='edit-date'>Fecha</Label>
                    <Input
                      id='edit-date'
                      type='date'
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          date: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='edit-type'>Tipo</Label>
                    <select
                      id='edit-type'
                      className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value,
                        })
                      }
                    >
                      <option value='INCOME'>Ingreso</option>
                      <option value='EXPENSE'>Egreso</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type='submit'>Actualizar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
};

export default Transactions;
