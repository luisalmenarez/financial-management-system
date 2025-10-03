import { cn } from '@/lib/utils';

describe('Utilidades - cn function', () => {
  it('Debe combinar clases de Tailwind correctamente', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
  });

  it('Debe manejar clases condicionales', () => {
    const result = cn('base-class', false && 'hidden-class', 'visible-class');
    expect(result).toContain('base-class');
    expect(result).toContain('visible-class');
    expect(result).not.toContain('hidden-class');
  });

  it('Resuelve conflictos de clases con tailwind-merge', () => {
    const result = cn('p-4', 'p-8');
    expect(result).toBe('p-8');
  });
});
