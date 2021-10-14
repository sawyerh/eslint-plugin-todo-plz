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
    "todo-plz/ticket-ref": ["error", { "pattern": "PROJ-[0-9]+" }]
  }
}
```

## Examples

### With pattern

Examples of **incorrect** code for this rule:
```javascript
/* eslint "todo-plz/ticket-ref": ["error", { "pattern": "PROJ-[0-9]+" }] */
// TODO: Lorem ipsum
// TODO: Lorem ipsum. Ticket PROJ-123
// TODO: OTHERPROJ-123
// TODO: PROJ-123
```

Examples of **correct** code for this rule:
```javascript
/* eslint "todo-plz/ticket-ref": ["error", { "pattern": "PROJ-[0-9]+" }] */
// TODO: (PROJ-123) Lorem ipsum
```

### With commentPattern

Examples of **incorrect** code for this rule:
```javascript
/* eslint "todo-plz/ticket-ref": ['error', { "commentPattern": "TODO\\:\\s\\\\[PROJ\\-[0-9]+\]" }] */
// TODO: Lorem ipsum
// TODO: Lorem ipsum. Ticket PROJ-123
// TODO: OTHERPROJ-123
// TODO: PROJ-123

// TODO: (PROJ-123) Lorem ipsum
```

Examples of **correct** code for this rule:
```javascript
/* eslint "todo-plz/ticket-ref": ['error', { "commentPattern": "TODO\\:\\s\\\\[PROJ\\-[0-9]+\]" }] */
// TODO: [PROJ-123] Lorem ipsum
```

## Supported Rules

- [`ticket-ref`](docs/rules/ticket-ref.md)

## Inspiration

- Shoutout [`expiring-todo-comments`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/expiring-todo-comments.md) for showing me how to build my first ESLint rule.
