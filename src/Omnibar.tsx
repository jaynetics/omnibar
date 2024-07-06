import * as React from 'react';
import Input from './Input';
import Results from './Results';
import search from './search';
import { BLUR_DELAY, DEFAULT_HEIGHT } from './constants';
import AnchorAction from './modifiers/anchor/AnchorAction';
import { debounce } from './utils';

export default class Omnibar<T> extends React.PureComponent<
  Omnibar.Props<T>,
  Omnibar.State<T>
> {
  // TODO - fix generic container
  static defaultProps: Omnibar.Props<any> = {
    children: null,
    extensions: [],
    inputDelay: 100,
    maxResults: null,
    maxViewableResults: null,
    render: null, // alias of children
    resultStyle: {},
    rootStyle: { position: 'relative' },
    showEmpty: false,
  };

  state: Omnibar.State<T> = {
    displayResults: false,
    hoveredIndex: -1,
    runningQuery: null,
    results: [],
    selectedIndex: 0,
  };

  constructor(props: Omnibar.Props<T>) {
    super(props);
    this.query = debounce(this.query, this.props.inputDelay);
  }

  query = (value: string) => {
    if (this.props.extensions.length > 0 && this.state.runningQuery !== value) {
      this.props.onQueryStart && this.props.onQueryStart(value);

      this.setState({ runningQuery: value }, async () => {
        const results = await search<T>(value, this.props.extensions);
        if (this.state.runningQuery !== value) return undefined;

        this.setState({
          runningQuery: null,
          results:
            this.props.maxResults > 0
              ? results.slice(0, this.props.maxResults)
              : results,
          displayResults: results.length > 0,
          selectedIndex:
            results.length > 0
              ? Math.min(this.state.selectedIndex, results.length - 1)
              : 0,
        });
        this.props.onQueryEnd && this.props.onQueryEnd(value, results);
        this.props.onQuery && this.props.onQuery(results); // for backwards compatibility
      });
    }
  };

  reset() {
    this.setState({
      results: [],
      runningQuery: null,
      displayResults: false,
    });
  }

  prev = () => {
    this.setState((prevState: Omnibar.State<T>) => {
      let selectedIndex = prevState.selectedIndex - 1;
      if (selectedIndex < 0) selectedIndex = prevState.results.length - 1;
      return { selectedIndex };
    });
  };

  next = () => {
    this.setState((prevState: Omnibar.State<T>) => {
      let selectedIndex = prevState.selectedIndex + 1;
      if (selectedIndex >= prevState.results.length) selectedIndex = 0;
      return { selectedIndex };
    });
  };

  action = (isClick = false) => {
    const idx =
      isClick && this.state.hoveredIndex > -1
        ? this.state.hoveredIndex
        : this.state.selectedIndex;
    const item = this.state.results[idx];
    const action = this.props.onAction || AnchorAction;
    action.call(null, item);
  };

  handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    if (value || this.props.showEmpty) {
      this.query(value);
    } else {
      this.reset();
    }
  };

  handleKeyDown = (evt: React.KeyboardEvent) => {
    switch (evt.key) {
      case 'ArrowUp':
        this.prev();
        evt.preventDefault();
        break;
      case 'ArrowDown':
        this.next();
        evt.preventDefault();
        break;
      case 'Enter':
        this.action();
        break;
    }
  };

  handleMouseEnterItem = (hoveredIndex: number) => {
    this.setState({ hoveredIndex });
  };

  handleMouseLeave = () => {
    this.setState({ hoveredIndex: -1 });
  };

  handleBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
    if (this.props.onBlur) {
      this.props.onBlur(evt);
    }
    // TODO: this can leak if component unmounts
    setTimeout(() => this.setState({ displayResults: false }), BLUR_DELAY);
  };

  handleFocus = (evt: React.FocusEvent<HTMLInputElement>) => {
    if (this.state.results.length === 0 && this.props.showEmpty) {
      this.query('');
    }
    if (this.props.onFocus) {
      this.props.onFocus(evt);
    }
    this.setState({ displayResults: true });
  };

  handleClickItem = (e: any) => {
    e.preventDefault();
    if (this.state.hoveredIndex > -1) {
      this.action(true);
    }
  };

  render() {
    let {
      children,
      render,
      maxResults,
      maxViewableResults,
      extensions,
      inputDelay,
      rootStyle,
      resultStyle,
      onQuery,
      onQueryStart,
      onQueryEnd,
      onAction,
      onFocus,
      onBlur,
      showEmpty,
      ...inputHTMLAttributes
    } = this.props;

    let maxHeight = maxViewableResults
      ? maxViewableResults * DEFAULT_HEIGHT
      : null;

    if (!render) {
      render = children;
    }

    return (
      <div style={rootStyle}>
        <Input
          {...inputHTMLAttributes}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onKeyDown={this.handleKeyDown}
        />
        {this.state.displayResults && (
          <Results
            children={render}
            items={this.state.results}
            maxHeight={maxHeight}
            onClickItem={this.handleClickItem}
            onMouseEnterItem={this.handleMouseEnterItem}
            onMouseLeave={this.handleMouseLeave}
            selectedIndex={this.state.selectedIndex}
            style={resultStyle}
          />
        )}
      </div>
    );
  }
}
