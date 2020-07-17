# Require a ticket reference in the TODO comment (ticket-ref)

Adding a `TODO` comment that will be addressed in the future should have a corresponding ticket (AKA issue) in the project backlog so the team doesn't lose track of the pending work.

## Fail

Examples of **incorrect** code for this rule:

```js
// TODO: Unmock this API request
```

## Pass

Examples of **correct** code for this rule:

```js
// TODO (ABC-123): Unmock this API request
```

## Options

### pattern

This option controls what the ticket pattern is to match against. Expects a regex string.

For example, let's say you're using Jira and your ticket IDs are prefixed with `ABC` followed by a number (e.g `ABC-123`), you would configure this rule like:

```json
{
  "rules": {
    "todo-plz/ticket-ref": ["error", { "pattern": "ABC-[0-9]+" }]
  }
}
```
