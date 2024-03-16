import { useState } from 'react';
import classNames from 'classnames';

export const TablePanel = ({ tables }: { tables: { name: string; node: JSX.Element }[] }) => {
  const [active, setActive] = useState(tables[0].name);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full overflow-x-auto rounded-t-md border border-b-0 border-cf-gray-3-5 bg-cf-gray-2">
        {tables.map((table) => (
          <button
            type="button"
            key={table.name}
            className={classNames(
              `whitespace-nowrap border-r border-cf-gray-3-5 px-[20px] py-[12px] font-aeonikMedium text-14 text-cf-light-2 transition duration-100 ease-in first-of-type:rounded-tl-md hover:bg-cf-gray-3 hover:text-cf-light-3`,
              active === table.name
                ? 'bg-cf-gray-4 text-cf-light-3 hover:bg-cf-gray-4'
                : 'bg-cf-gray-2',
            )}
            onClick={() => active !== table.name && setActive(table.name)}
          >
            {table.name}
          </button>
        ))}
      </div>
      <div className="is-panel group flex w-full flex-col overflow-x-auto">
        {tables.find((table) => table.name === active)?.node}
      </div>
    </div>
  );
};
