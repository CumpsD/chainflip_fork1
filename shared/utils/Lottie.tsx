import React, { useCallback, useEffect, useState } from 'react';
import LottieWeb, { type AnimationConfigWithData, type AnimationItem } from 'lottie-web';

type ChildFunction = (props: {
  setContainer: React.Dispatch<React.SetStateAction<Element | null>>;
}) => JSX.Element;

type LottieChildren = {
  children?: ChildFunction;
};

interface PropMap {
  button: LottieChildren &
    Omit<
      React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
      'children'
    >;
  div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
}

type LottieOptions = Omit<AnimationConfigWithData, 'container' | 'animationData' | 'name'>;

interface BaseProps<T extends keyof PropMap> extends LottieOptions {
  as: T;
  animationData: Record<string, unknown>;
  lottieName?: AnimationConfigWithData['name'];
  speed?: number;
  playOnce?: boolean;
}

type LottieProps = {
  [K in keyof PropMap]: PropMap[K] & BaseProps<K>;
}[keyof PropMap];

export default function Lottie({
  as,
  renderer,
  loop,
  autoplay,
  initialSegment,
  lottieName,
  assetsPath,
  rendererSettings,
  audioFactory,
  children,
  animationData,
  speed,
  playOnce,
  ...props
}: LottieProps) {
  const [container, setContainer] = useState<Element | null>(null);
  const [animation, setAnimation] = useState<AnimationItem | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    if (!animation && container) {
      const animationItem = LottieWeb.loadAnimation({
        renderer,
        loop,
        autoplay,
        initialSegment,
        name: lottieName,
        assetsPath,
        rendererSettings,
        audioFactory,
        container,
        animationData,
      });
      if (!autoplay) animationItem.goToAndStop(1, true);
      setAnimation(animationItem);
    }
  }, [container, animation]);

  useEffect(() => {
    if (animation) {
      animation.setSpeed(speed ?? 1);
    }
  }, [animation, speed]);

  const play = useCallback(() => {
    if (animation) {
      if (playOnce) {
        animation.goToAndPlay(0, true);
        return;
      }
      animation.setDirection(direction);
      animation.play();
      setDirection((direction * -1) as 1 | -1);
    }
  }, [animation, direction, playOnce]);

  if (as === 'div') {
    return <div ref={setContainer} {...(props as PropMap[typeof as])} />;
  }
  if (as === 'span') {
    return <span ref={setContainer} {...(props as PropMap[typeof as])} />;
  }
  if (as === 'button') {
    const childFunction = typeof children === 'function' ? children : null;

    const { onClick, ...rest } = props as PropMap[typeof as];
    return (
      // eslint-disable-next-line react/button-has-type
      <button
        ref={childFunction ? undefined : setContainer}
        onClick={
          autoplay
            ? onClick
            : (e) => {
                onClick?.(e);
                if (!e.defaultPrevented) play();
              }
        }
        {...rest}
      >
        {childFunction?.({ setContainer })}
      </button>
    );
  }

  throw new Error(`unsupported type: "${as}"`);
}
