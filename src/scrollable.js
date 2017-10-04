// @flow
import React from 'react';
import { Animated } from 'react-native';
import withLifecycle from '@hocs/with-lifecycle';
import { compose, getContext, withProps, withHandlers } from 'recompose';

const scrollEventThrottle = 1;
export default function (ScrollableComponent: any) {
  const AnimatedList = Animated.createAnimatedComponent(ScrollableComponent)
  const Component = ({
    onScrollEndDrag,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
    scrollAnim,
    height,
    ...rest
  }: any) => (
    <AnimatedList
      contentContainerStyle={{ paddingTop: height }}
      {...{ scrollEventThrottle,
        onScrollEndDrag,
        onMomentumScrollBegin,
        onMomentumScrollEnd }}
      {...rest}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollAnim } } }],
        { useNativeDriver: true },
      )}
    />
  );

  return compose(

    getContext({
      collapsibleProps: React.PropTypes.object,
    }),
    withProps(({ collapsibleProps }) => {
      const { offsetAnim, scrollAnim, height, scrollable, collapseHeight } = collapsibleProps;
      return {
        offsetAnim,
        scrollAnim,
        height,
        scrollable,
        collapseHeight,
      };
    }),
    withHandlers({
      onMomentumScrollEnd: ({ scrollable, ...rest }) => () => {
        scrollable.momentumScrollEnd({ ...rest });
      },
      onMomentumScrollBegin: ({ scrollable, ...rest }) => () => {
        scrollable.momentumScrollBegin({ ...rest });
      },
      onScrollEndDrag: ({ scrollable, ...rest }) => () => {
        scrollable.scrollEndDrag({ ...rest });
      },
    }),

    withLifecycle({
      onDidMount: ({ scrollable, ...rest }) => scrollable.onDidMount({ ...rest }),
      onWillUnmount: ({ scrollable, ...rest }) => scrollable.onWillUnmount({ ...rest }),
    }),

  )(Component);
}

