import Router from 'next/router';
import { Button } from '../atoms/Button';

type FallbackLayoutAttributes = {
  title: string;
  message: string;
  homeLabel: string;
  refreshLabel: string;
  onClose: () => void;
};

export const FallbackLayout = ({
  title,
  message,
  onClose,
  homeLabel,
  refreshLabel,
}: FallbackLayoutAttributes): JSX.Element => {
  const routeToHome = async () => {
    await Router.push('/');
    onClose();
  };
  return (
    <div className="flex h-screen w-full items-center justify-center ">
      <div className="space-y-14 text-center">
        <p className="font-aeonikBold text-28">Error</p>
        <div>
          <p className=" text-cf-light-2">{title}</p>
          <p className=" text-orange-400">{message}</p>
        </div>

        <Button onClick={() => Router.reload()} variant="secondary" className="mr-4">
          {refreshLabel}
        </Button>
        <Button variant="primary" className="ml-4" onClick={() => routeToHome()}>
          {homeLabel}
        </Button>
      </div>
    </div>
  );
};

export default FallbackLayout;
