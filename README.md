# Omnibar2

[![license](https://img.shields.io/github/license/jaynetics/omnibar2.svg?maxAge=2592000)](LICENSE) [![npm version](https://img.shields.io/npm/v/omnibar2.svg?style=flat)](https://www.npmjs.com/package/omnibar2) [![Build Status](https://github.com/jaynetics/js_regex/workflows/tests/badge.svg)](https://github.com/jaynetics/js_regex/actions) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/jaynetics/omnibar2/pulls)

> Extensible search component for React.

*Please note:* this is a fork and drop-in replacement of the unmaintained [vutran/omnibar](https://github.com/vutran/omnibar). It might be merged back into that at some point if the owners desire to continue the project themselves.

![](screenshot.png?raw=true)

## Demo

The demo can be found in [this repository](https://github.com/vutran/omnibar-www).

## Install

```bash
$ npm i -S omnibar2
```

## Usage

Import the module and your extensions

```jsx
import Omnibar from 'omnibar2';
import Foo from './Foo';
import Bar from './Bar';
```

Render it in your component

```jsx
export default function MyComponent() {
  return <Omnibar placeholder="Enter keyword" extensions={[Foo, Bar]} />;
}
```

## Extending your Omnibar

### Simple Extension

The example below returns a simple list of items. `<Omnibar />` will
render an anchor item with the default result item schema.

```typescript
{
  title: string;
  url: string;
}
```

```jsx
export default function FooExtension() {
  return [
    { title: 'Dropbox', url: 'https://dropbox.com' },
    { title: 'GitHub', url: 'https://github.com' },
    { title: 'Facebook', url: 'https://facebook.com' },
  ];
}
```

### Promise-based Results

Extensions can also return a `Promise` that resolves a list of items.

For example, given an API endpoint `https://myapi.com/` that takes
a request parameter `q`, it will return a JSON response like so:

```json
{
  "items": [
    { "name": "foo", "website": "foo.com" },
    { "name": "bar", "website": "bar.com" }
  ]
}
```

Your extension can return a `Promise` that resolves into a list of items.
The example below makes a request to our fake API endpoint
and maps it's data schema with the default anchor schema.

```jsx
export default function SearchExtension(query) {
    return fetch(`https://myapi.com/?q=${query}`)
        .then(resp => resp.json().items.map(item => ({
            title: item.name,
            url: item.website,
        });
```

### Custom Renderers

If you would like to display additional data in your result listings such as a thumbnail, you can
pass a rendering function to the `render` prop in your `<Omnibar />` instance.

The example below changes our result item schema to be in the shape of:

```typescript
{
  owner: {
    avatar_url: string;
  }
  html_url: string;
  full_name: string;
}
```

```jsx
class MyComponent extends React.Component {
  render() {
    return (
      <Omnibar placeholder="Search GitHub" extensions={[GitHub]}>
        {({ item }) => <div>{item.full_name}</div>}
      </Omnibar>
    );
  }
}
```

Or you can use the `render` prop to specify your custom component:

```typescript
function ResultItem({ item }) {
  return (
    <div>
      <img src={item.owner.avatar_url} width={30} height={30} />
      <a href={item.html_url}>{item.full_name}</a>
    </div>
  );
}

class MyComponent extends React.Component {
  render() {
    return (
      <Omnibar
        placeholder="Search GitHub"
        extensions={[GitHub]}
        render={ResultItem}
      />
    );
  }
}
```

## Extension Decorators

### `command()`

The `command()` helper will wrap your extension through a command prefix and will filter only those matching the command.

**Example**:

```js
import { command } from 'omnibar2';

function MyExtension() {
  return [
    // ...items
  ];
}

export default command(MyExtension, 'foo');
```

In the above example, `MyExtension` will be queried only if the user starts their query with the keyword `foo`.

```
foo test -> queries extensions
footest -> doesn't query extension
test -> doesn't query extension
```

## Higher Order Components

### Extend Your Omnibar

The `withExtensions` is a HOC factory method to enhance your Omnibar with your own extensions.

**Example**

```js
import Omnibar, { withExtensions } from 'omnibar2';

const GitSearchBar = withExtensions([GitHub])(Omnibar);
const NpmSearchBar = withExtensions([Npm])(Omnibar);
const GlobalSearchBar = withExtensions([GitHub, Npm])(Omnibar);

// renders a GitHub-only search bar
// <GitSearchBar />

// renders a Npm-only search bar
// <NpmSearchBar />

// renders the global search bar (includes GitHub, and Npm)
// <GlobalSearchBar />
```

This will produce the results below:

```js
// <Omnibar extensions={[GitHub]} {...props} />

// <Omnibar extensions={[Npm]} {...props} />

// <Omnibar extensions={[GitHub, Npm]} {...props} />
```

### Voice Commands

The `withVoice` is another HOC factory method to enhance your Omnibar with voice recognition using the [WebSpeech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API).

**_Note that this is experimental._**

**Example**

```js
import Omnibar, { withVoice } from 'omnibar2';

const VoiceBar = withVoice(Omnibar);

// voice-enhanced Omnibar
// <VoiceBar />

// regular Omnibar:
// <Omnibar />
```

### Composing Your Omnibar

Included in the `omnibar` package is a `compose()` function that allows you to apply all these nifty features.

#### Before

```js
const GitVoiceSearch = withVoice(withExtensions([GitHub]))(Omnibar);
```

#### After

```js
const GitVoiceSearch = compose(
  withVoice,
  withExtensions([GitHub])
)(Omnibar);

// render
// <GitVoiceSearch />
```

## Props

| Prop                 | Type                  | Required? | Description                                                                                        |
| :------------------- | :-------------------- | :-------- | :------------------------------------------------------------------------------------------------- |
| `autoFocus`          | `boolean`             |           | Optionally make the Omnibar autoFocus.                                                             |
| `children`           | `Function`            |           | Optional rendering function for each result item. Arguments: `{ item, isSelected, isHighlighted }` |
| `inputDelay`         | `number`              |           | Set an input delay used for querying extensions (Default: 100ms)                                   |
| `maxResults`         | `number`              |           | The maximum amount of results to display overall.                                                  |
| `maxViewableResults` | `number`              |           | The maximum amount of results to display in the viewable container (before scrolling).             |
| `onAction`           | `Function`            |           | Apply an action callback when an item is executed. Arguments: `item`                               |
| `onQuery`            | `Function`            |           | Triggered when a query is made                                                                     |
| `placeholder`        | `string`              |           | Input placeholder                                                                                  |
| `render`             | `Function`            |           | Alias of `children`                                                                                |
| `resultStyle`        | `object`              |           | Style object override for the result container                                                     |
| `style`              | `React.CSSProperties` |           | Style object override for the `<input />` element                                                  |
| `value`              | `string`              |           | Optional value to send to the Omnibar.                                                             |

## Contributing

1. Clone this repository and the [website repository](https://github.com/vutran/omnibar-www).
2. Run `npm i` or `yarn` on the `omnibar` directory.
3. Run `npm link` on the `omnibar` directory.
4. Run `npm i` or `yarn` on the `omnibar-www` directory.
5. Run `npm link omnibar` on the `omnibar-www` directory.
6. Run `npm run dev` on the `omnibar-www` directory.
7. Open [https://localhost:8080](https://localhost:8080) in your browser.

## Support

Like what you see? [Become a Patron](https://www.patreon.com/vutran) and support me via a monthly donation.

## License

MIT © [Vu Tran](https://github.com/vutran/)
