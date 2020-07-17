# eslint-plugin-todo-plz

Enforce consistent and maintainable TODO comments.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-todo-plz`:

```
$ npm install eslint-plugin-todo-plz --save-dev
```

## Usage

Add `todo-plz` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["todo-plz"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "todo-plz/ticket-ref": ["error", { "pattern": "ABC-[0-9]+" }]
  }
}
```

## Supported Rules

- [`ticket-ref`](docs/rules/ticket-ref.md)

## Inspiration

- Shoutout [`expiring-todo-comments`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/expiring-todo-comments.md) for showing me how to build my first ESLint rule.
