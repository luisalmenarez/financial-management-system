import { PropagateLoader } from 'react-spinners';
import { cn } from '@/lib/utils';

type LoadingProps = {
  loading: boolean;
  className?: string;
  size?: number;
  color?: string;
};

export const Loading = ({
  loading,
  className,
  size = 25,
  color = '#0f172a',
}: LoadingProps) => {
  return (
    <div className={cn('flex justify-center items-center h-screen', className)}>
      <PropagateLoader
        color={color}
        loading={loading}
        size={size}
        speedMultiplier={1}
      />
    </div>
  );
};
