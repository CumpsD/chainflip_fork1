import { SearchIcon } from '@/shared/icons/large';

export const SearchInput = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (input: string) => void;
  placeholder?: string;
}) => (
  <div className="relative w-full">
    <input
      className="peer w-full rounded-md border border-cf-gray-4 bg-cf-gray-2 px-4 py-2.5 font-aeonikMono text-14 text-white outline-none transition hover:bg-cf-gray-3 disabled:cursor-not-allowed disabled:hover:bg-cf-gray-2"
      type="text"
      value={value}
      placeholder=""
      onChange={(e) => onChange(e.target.value)}
    />
    <div className="pointer-events-none absolute left-4 top-[9px] flex items-center space-x-1.5 truncate whitespace-nowrap text-cf-light-1 transition peer-placeholder-shown:opacity-100 peer-focus-within:opacity-0 sm:top-[10px]">
      <div>
        <SearchIcon />
      </div>
      <span className="pointer-events-none w-full truncate text-12  sm:text-14">{placeholder}</span>
    </div>
  </div>
);
