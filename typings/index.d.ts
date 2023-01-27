declare namespace Omnibar {
  // Result set
  type ListResult<T> = Array<T>;
  type ResolvedResults<T> = Promise<ListResult<T>>;
  type Results<T> = ListResult<T> | ResolvedResults<T>;

  // Extensions
  type FunctionalExtension<T> = (query: string) => Results<T>;
  type Extension<T> = FunctionalExtension<T>;

  type MouseEvent = (evt: any) => void;

  // Renderers
  type ResultRenderer<T> = (
    { item, isSelected, isHighlighted }: ResultRendererArgs<T>
  ) => JSX.Element;

  interface ResultRendererArgs<T> extends React.HTMLAttributes<HTMLElement> {
    item: AnchorItem & T;
    isSelected: boolean;
    isHighlighted: boolean;
  }

  interface AnchorItem {
    title?: string;
    url?: string;
  }

  interface Props<T> {
    // optionally make the Omnibar autoFocus
    autoFocus?: boolean;
    // results renderer function
    children?: ResultRenderer<T>;
    // optional default value
    value?: string;
    // list of extensions
    extensions?: Array<Omnibar.Extension<T>>;
    // optional input delay override
    inputDelay?: number;
    // max items
    maxResults?: number;
    // max items to display in view
    maxViewableResults?: number;
    // optional action override
    onAction?: (item: T) => void;
    // triggered when a query is made
    onQuery?: (items: Array<T>) => void;
    // optional input placeholder text
    onFocus?: (evt: React.FocusEvent<HTMLInputElement>) => void;
    // optional input placeholder text
    onBlur?: (evt: React.FocusEvent<HTMLInputElement>) => void;
    // optional input placeholder text
    placeholder?: string;
    // alias of children
    render?: ResultRenderer<T>;
    // optional result list style override
    resultStyle?: React.CSSProperties;
    // optional style on the root element
    rootStyle?: React.CSSProperties;
    // optional input bar style override
    style?: React.CSSProperties;
    // optional call extension with empty input
    showEmpty?: boolean;
  }

  interface State<T> {
    // list of matching results
    results: Array<T>;
    // current selected index (applies action upon key event)
    selectedIndex: number;
    // current mouse hovered index (applies action click event)
    hoveredIndex: number;
    // display results?
    displayResults: boolean;
  }
}

declare module 'omnibar2' {
  export default class Omnibar<T> extends React.Component<
    Omnibar.Props<T>,
    Omnibar.State<T>
  > {}
  export function command<T>(
    extension: Omnibar.Extension<T>,
    command: string
  ): Omnibar.Extension<T>;
  export function compose<T extends typeof Omnibar>(
    ...fns: Array<Function>
  ): (...args: Array<any>) => T;
  export function withVoice<T extends typeof Omnibar>(
    Component: T
  ): React.ComponentClass<Omnibar.Props<T>>;
  export function withExtensions<T extends typeof Omnibar>(
    extensions: Array<Omnibar.Extension<T>>
  ): (Component: T) => React.ComponentClass<Omnibar.Props<T>>;
  export function buildItemStyle<T>(
    props: Omnibar.ResultRendererArgs<T>
  ): React.CSSProperties;
}
