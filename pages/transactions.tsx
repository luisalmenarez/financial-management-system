import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
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
import { Plus, Pencil, Trash } from 'lucide-react';
import { Layout } from '@/components/ui/layout';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const Transactions = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setloadingTransactions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    concept: '',
    amount: '',
    date: '',
    type: 'INCOME',
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    transactionId: '',
  });

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
    setloadingTransactions(true);
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
    } finally {
      setloadingTransactions(false);
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
        toast.success('Transacción creada correctamente');
        setDialogOpen(false);
        setFormData({ concept: '', amount: '', date: '', type: 'INCOME' });
        fetchTransactions();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al crear transacción');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear transacción');
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
        toast.success('Transacción actualizada correctamente');
        setEditDialogOpen(false);
        setEditingTransaction(null);
        setFormData({ concept: '', amount: '', date: '', type: 'INCOME' });
        fetchTransactions();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al actualizar transacción');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar transacción');
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteDialog({ open: true, transactionId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `/api/transactions/${deleteDialog.transactionId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (response.ok) {
        toast.success('Transacción eliminada correctamente');
        fetchTransactions();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al eliminar transacción');
      }
    } catch (error) {
      toast.error('Error al eliminar la transacción seleccionada.');
    } finally {
      setDeleteDialog({ open: false, transactionId: '' });
    }
  };

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
      {/* Main Content */}
      <main>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>
          Ingresos y Egresos
        </h2>
        <Card>
          <CardHeader className='flex flex-col sm:flex-row sm:items-center justify-between'>
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
                            setFormData({
                              ...formData,
                              amount: e.target.value,
                            })
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
                            setFormData({
                              ...formData,
                              date: e.target.value,
                            })
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
                      <Button type='submit'>Guardar</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Usuario</TableHead>
                    {isAdmin && <TableHead>Acciones</TableHead>}
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
                        {new Date(transaction.date).toLocaleDateString(
                          'es-CO',
                          {
                            timeZone: 'UTC',
                          }
                        )}
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
                      {isAdmin && (
                        <TableCell className='flex gap-2'>
                          <Button
                            onClick={() => handleEdit(transaction)}
                            size='sm'
                            variant='edit'
                          >
                            <Pencil className='size-4' />
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(transaction.id)}
                            size='sm'
                            variant='delete'
                          >
                            <Trash className='size-4 text-red-500' />
                          </Button>

                          <ConfirmDialog
                            open={deleteDialog.open}
                            onOpenChange={(open) =>
                              setDeleteDialog({ open, transactionId: '' })
                            }
                            onConfirm={handleDeleteConfirm}
                            title='Eliminar transacción'
                            description='¿Está seguro que desea eliminar esta transacción? Esta acción no se puede deshacer.'
                            confirmText='Eliminar'
                            cancelText='Cancelar'
                            variant='destructive'
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <CardContent>
              {loadingTransactions && transactions.length === 0 ? (
                <>
                  <p className='mt-4'>Cargando Transacciones</p>
                  <Loading
                    className='h-full'
                    loading={loadingTransactions}
                    size={10}
                  />
                </>
              ) : (
                <div>
                  {transactions.length === 0 && (
                    <p className='text-center text-gray-500 py-4'>
                      <p className='text-center text-gray-500 py-4'>
                        No hay transacciones registradas
                      </p>
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </CardContent>
        </Card>
      </main>

      {/* Dialog de EDITAR */}
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
    </Layout>
  );
};

export default Transactions;
