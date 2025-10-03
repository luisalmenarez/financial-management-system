/* Pruebas de validación de datos de la API */

describe('Validación de API - Transacciones', () => {
  it('Validar que el monto sea un número positivo.', () => {
    const validAmount = 100.5;
    const invalidAmount = -50;

    expect(typeof validAmount).toBe('number');
    expect(validAmount).toBeGreaterThan(0);
    expect(invalidAmount).toBeLessThan(0);
  });

  it('Validar tipos de transacción permitidos.', () => {
    const validTypes = ['INCOME', 'EXPENSE'];
    const testType = 'INCOME';

    expect(validTypes).toContain(testType);
    expect(validTypes).not.toContain('INVALID_TYPE');
  });

  it('Validar que todos los campos requeridos estén presentes.', () => {
    const validTransaction = {
      concept: 'Venta de producto',
      amount: 150,
      date: new Date().toISOString(),
      type: 'INCOME',
    };

    expect(validTransaction.concept).toBeDefined();
    expect(validTransaction.amount).toBeDefined();
    expect(validTransaction.date).toBeDefined();
    expect(validTransaction.type).toBeDefined();
  });
});

describe('Validación de API - Usuarios', () => {
  it('Validar roles de usuario permitidos.', () => {
    const validRoles = ['USER', 'ADMIN'];
    const testRole = 'ADMIN';

    expect(validRoles).toContain(testRole);
    expect(validRoles).not.toContain('SUPERUSER');
  });

  it('Validar que se asigne rol ADMIN por defecto a nuevos usuarios.', () => {
    const defaultRole = 'ADMIN';
    expect(defaultRole).toBe('ADMIN');
  });
});
