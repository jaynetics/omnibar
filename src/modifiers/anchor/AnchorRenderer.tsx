import * as React from 'react';
import { COLORS, DEFAULT_HEIGHT } from '../../constants';

export const ITEM_STYLE: React.CSSProperties = {
  all: 'revert',
  borderBottomWidth: 1,
  borderColor: COLORS.DARKGRAY,
  borderLeftWidth: 1,
  borderRightWidth: 1,
  borderStyle: 'solid',
  borderTopWidth: 0,
  boxSizing: 'border-box',
  color: COLORS.BLACK,
  display: 'block',
  fontSize: 24,
  height: DEFAULT_HEIGHT,
  lineHeight: `${DEFAULT_HEIGHT}px`,
  paddingLeft: 15,
  paddingRight: 15,
  textDecoration: 'none',
};

export default function AnchorRenderer<T>(
  props: Omnibar.ResultRendererArgs<T>
) {
  const { item, isHighlighted, isSelected, style, ...rest } = props;
  const mergedStyle = buildItemStyle<T>(props);

  return (
    <a href={item.url} style={mergedStyle} {...rest}>
      {item.title}
    </a>
  );
}

export function buildItemStyle<T>(
  props: Omnibar.ResultRendererArgs<T>
): React.CSSProperties {
  const { isSelected, isHighlighted, style } = props;

  const mergedStyle = { ...ITEM_STYLE, ...style };

  if (isSelected) {
    mergedStyle.backgroundColor = COLORS.GRAY;
  }

  if (isHighlighted) {
    mergedStyle.backgroundColor = COLORS.DARKGRAY;
  }

  return mergedStyle;
}
