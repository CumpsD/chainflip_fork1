import React from 'react';
import classNames from 'classnames';

function TokenWithChain({
  chainLogo,
  tokenLogo,
  small = false,
}: {
  chainLogo: ((props?: React.SVGProps<SVGSVGElement>) => JSX.Element) | JSX.Element;
  tokenLogo: ((props?: React.SVGProps<SVGSVGElement>) => JSX.Element) | JSX.Element;
  small?: boolean;
}): JSX.Element {
  return (
    <div className={classNames('relative', `${small ? 'h-[24px] w-[24px]' : 'h-[34px] w-[34px]'}`)}>
      {typeof tokenLogo === 'function'
        ? tokenLogo(small ? { width: 24, height: 24 } : undefined)
        : tokenLogo}
      <div
        style={{ filter: 'drop-shadow(-2px -2px 4px rgba(0, 0, 0, 0.15))' }}
        className={classNames(
          'absolute',
          `${small ? 'left-[15px] top-[15px]' : 'left-[22px] top-[22px]'}`,
        )}
      >
        {typeof chainLogo === 'function'
          ? chainLogo(small ? { width: 12, height: 12 } : undefined)
          : chainLogo}
      </div>
    </div>
  );
}

export default TokenWithChain;
