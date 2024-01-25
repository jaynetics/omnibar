import * as React from 'react';
import ResultsItem from './ResultsItem';
import { COLORS } from './constants';

interface Props<T> {
  // results renderer function
  children?: Omnibar.ResultRenderer<T>;
  // list of result items
  items: Array<T>;
  // max container height
  maxHeight?: React.CSSProperties['maxHeight'];
  // onClick callback
  onClickItem?: React.MouseEventHandler;
  // onMouseEnter callback
  onMouseEnter?: React.MouseEventHandler;
  // onMouseEnter item callback
  onMouseEnterItem?: (idx: number) => void;
  // onMouseLeave callback
  onMouseLeave?: React.MouseEventHandler;
  // onMouseLeave item callback
  onMouseLeaveItem?: (idx: number) => void;
  // the currently selected index
  selectedIndex: number;
  // optional override container style
  style?: React.CSSProperties;
}

const LIST_STYLE: React.CSSProperties = {
  all: 'revert',
  position: 'absolute',
  width: '100%',
  zIndex: 2,
  listStyleType: 'none',
  margin: 0,
  padding: 0,
  backgroundColor: COLORS.WHITE,
};

export default function Results<T>(props: Props<T>) {
  const style = { ...LIST_STYLE, ...props.style };

  if (props.maxHeight) {
    style.maxHeight = props.maxHeight;
    style.borderBottomWidth = 1;
    style.borderBottomColor = COLORS.GRAY;
    style.borderBottomStyle = 'solid';
    style.overflow = 'auto';
  }

  function createHandler(handler: any, key: number) {
    return handler.bind(this, key);
  }

  return (
    <ul
      style={style}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {props.items.map((item, key) => (
        <ResultsItem
          key={key}
          children={props.children}
          item={item}
          isSelected={props.selectedIndex === key}
          onMouseEnter={
            props.onMouseEnterItem && createHandler(props.onMouseEnterItem, key)
          }
          onMouseLeave={
            props.onMouseLeaveItem && createHandler(props.onMouseLeaveItem, key)
          }
          onClickItem={props.onClickItem}
        />
      ))}
    </ul>
  );
}
