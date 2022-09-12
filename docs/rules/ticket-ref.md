# Require a ticket reference in the TODO comment (ticket-ref)

Adding a `TODO` comment that will be addressed in the future should have a corresponding ticket (AKA issue) in the project backlog, so the team doesn't lose track of the pending work.

## Options

### `pattern`

**This option is required**, and controls what the ticket pattern is to match against. Expects a regex string.

For example, let's say you're using Jira and your ticket IDs are prefixed with `PROJ` followed by a number (e.g `PROJ-123`), you would configure this rule like:

```json
{
  "rules": {
    "todo-plz/ticket-ref": ["error", { "pattern": "PROJ-[0-9]+" }]
  }
}
```

Examples of **incorrect** code for this rule when using the above options:

```js
// TODO: Connect to the API
// TODO (ABC-123): Connect to the API
// TODO (ABC): Connect to the API
```

Examples of **correct** code for this rule when using the above options:

```js
// TODO (PROJ-123): Connect to the API
```

### `terms`

_Optional._ Change what terms to require the ticket reference on. Defaults to: `["TODO"]`

```json
{
  "rules": {
    "todo-plz/ticket-ref": [
      "error",
      { "pattern": "PROJ-[0-9]+", "terms": ["FIXME", "TODO"] }
    ]
  }
}
```

Examples of **incorrect** code for this rule when using the above options:

```js
// TODO: Connect to the API
// FIXME: Connect to the API
```

Examples of **correct** code for this rule when using the above options:

```js
// TODO (PROJ-123): Connect to the API
// FIXME (PROJ-123): Connect to the API
// HELLO: This isn't a term targeted by the lint rule
```

---

## Advanced options

### `commentPattern`

_Optional._ Override the overall comment pattern that matches both term and ticket. When used, `term` and `pattern` options are ignored. Expects a regex string.

For example, let's say you expect a different comment pattern such as `TODO: [PROJ-123]`, you would configure this rule like:

```json
{
  "rules": {
    "todo-plz/ticket-ref": [
      "error",
      { "commentPattern": "TODO:\\s\\[(PROJ-[0-9]+[,\\s]*)+\\]" }
    ]
  }
}
```

Examples of **incorrect** code for this rule when using the above options:

```js
// TODO (PROJ-456): Connect to the API
// TODO [PROJ-456]: Connect to the API
```

Examples of **correct** code for this rule when using the above options:

```js
// TODO: [PROJ-456] Connect to the API
```

### `description`

_Optional_. Override the error message portion that provides guidance on the expected ticket pattern. Defaults to: `Ticket pattern: <pattern>`

```json
{
  "rules": {
    "todo-plz/ticket-ref": [
      "error",
      {
        "pattern": "PROJ-[0-9]+",
        "description": "For example: `TODO (PROJ-123):`"
      }
    ]
  }
}
```
