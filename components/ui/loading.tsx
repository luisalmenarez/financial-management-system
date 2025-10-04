import { PropagateLoader } from 'react-spinners';

type LoadingProps = {
  loading: boolean;
};

export const Loading = ({ loading }: LoadingProps) => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <PropagateLoader
        color={'#0f172a'}
        loading={loading}
        size={25}
        speedMultiplier={1}
      />
    </div>
  );
};
