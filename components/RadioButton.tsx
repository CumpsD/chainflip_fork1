import classNames from 'classnames';

const RadioButton = ({ selected }: { selected: boolean }) => (
  <div className="flex h-4 w-4 flex-col items-center justify-center rounded-full border border-cf-gray-4 bg-cf-gray-3">
    <div
      className={classNames(
        'h-2 w-2 rounded-full border border-[#3DCBA0] bg-cf-green-2 shadow-[0px_0px_4px_0px_#46DA93] transition',
        !selected && 'opacity-0',
      )}
    />
  </div>
);

export default RadioButton;
