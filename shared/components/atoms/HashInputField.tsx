import classnames from 'classnames';
import CopyIcon from '../../icons/Copy';
import { copy } from '../../utils/helpers';

export interface HashInputFieldProps {
  id: string;
  onCopy: (string: string) => void;
  value: string;
  success?: boolean;
  failure?: boolean;
  disabled?: boolean;
  copyButton?: boolean;
  paddingLeft?: string;
}

/**
 * This is a custom input component for displaying hashes.
 * It is probably possible to make this editable with some work by
 * making the div contentEditable=true, but there is some work to be done
 * in terms of capturing the div in react and preventing unwanted characters.
 */
export function HashInputField({
  id,
  success = false,
  failure = false,
  disabled = false,
  value,
  paddingLeft = 'pl-2.5',
  copyButton = true,
  onCopy,
}: HashInputFieldProps): JSX.Element {
  const basicStyles = `
  rounded-xl
  text-cf-white
  bg-cf-gray-2
  border-cf-gray-4
  flex-1
  flex
  items-center
  appearance-none
  border
  border-gray-300
  w-full
  py-2
  ${paddingLeft}
  pr-2.5
  bg-cf-gray-3
  placeholder-cf-light-1
  shadow-sm
  text-base
  focus:text-cf-light-3
  focus:outline-none
  focus:border-transparent
  h-12
  overflow-hidden
  `;
  const successStyles = `border-alertsuccess`;
  const failureStyles = `border-cf-red-1`;
  const disabledStyles = `text-cf-gray-4 pointer-events-none`;

  const boldStartAndEnd = (input: string, numCharacters: number) => {
    if (!input) {
      return '';
    }
    if (input.length < numCharacters * 2) {
      return <span className="font-bold">{value}</span>;
    }

    return (
      <div className="mr-9 w-full overflow-hidden">
        <span className="font-bold">{value.slice(0, numCharacters)}</span>
        {input.slice(numCharacters, input.length - numCharacters)}
        <span className="font-bold">{input.slice(input.length - numCharacters, input.length)}</span>
      </div>
    );
  };

  const copyAndHighlight = () => {
    const el = document.getElementById(id) as HTMLElement;
    el.focus();
    // Highlight the text
    const range = document.createRange();
    range.selectNode(el);
    document.getSelection()?.removeAllRanges();
    document.getSelection()?.addRange(range);
    // Finally, copy the value
    copy(value);
    onCopy(value);
  };

  return (
    <div className="relative">
      <div
        className={classnames(
          basicStyles,
          success && successStyles,
          failure && failureStyles,
          disabled && disabledStyles,
        )}
        id={id}
        style={{
          zIndex: 1,
        }}
      >
        {boldStartAndEnd(value, 4)}
      </div>

      {copyButton && (
        <div className="absolute right-0 top-0 flex h-full w-auto items-center p-3">
          <div
            className={classnames('flex h-full w-full cursor-pointer items-center bg-cf-gray-3')}
            onClick={copyAndHighlight}
            onKeyPress={copyAndHighlight}
            role="button"
            tabIndex={0}
          >
            <CopyIcon className="stroke-current text-cf-white hover:stroke-current hover:text-cf-green-1" />
          </div>
        </div>
      )}
    </div>
  );
}
