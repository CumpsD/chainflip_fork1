import { Link } from './atoms/Link';

const NotFound = (): JSX.Element => (
  <div className="flex h-[calc(100vh_-_260px)] items-center justify-center text-center">
    <div className="flex flex-col items-center justify-around space-y-12 rounded-lg p-6">
      <h1 className="text-7xl font-bold text-cf-light-4">404!</h1>
      <p className=" text-lg font-light text-cf-orange-1">Results not found</p>
      <Link className="rounded-md bg-cf-green-1 px-4 py-3 font-aeonikBold" href="/">
        <span className="text-cf-gray-4">Back to Home</span>
      </Link>
    </div>
  </div>
);

export default NotFound;
