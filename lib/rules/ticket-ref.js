/**
 * @fileoverview Require a ticket reference in the TODO comment
 * @author Sawyer
 */
"use strict";

const messages = {
  missingTicket:
    "TODO comment is missing a ticket reference matching pattern: {{ pattern }}",
};

const schema = [
  {
    type: "object",
    properties: {
      pattern: {
        type: "string",
      },
      terms: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
  },
];

function create(context) {
  const { pattern, terms } = {
    terms: ["TODO"],
    ...context.options[0],
  };
  const sourceCode = context.getSourceCode();
  const comments = sourceCode.getAllComments();

  function validate(comment) {
    const value = comment.value;
    const hasTerm = terms.some((term) => value.includes(term));
    if (!hasTerm) {
      return;
    }

    terms.forEach((term) => {
      const searchPattern = new RegExp(`${term}\\s?\\(${pattern}\\)`, "i");
      if (searchPattern.test(value)) return;

      context.report({
        loc: comment.loc,
        messageId: "missingTicket",
        data: { pattern },
      });
    });
  }

  comments.forEach(validate);

  return {};
}

module.exports = {
  meta: {
    docs: {
      description: "Require a ticket reference in the TODO comment",
      category: "Fill me in",
      recommended: false,
    },
    fixable: null, // or "code" or "whitespace"
    messages,
    schema,
    type: "suggestion",
  },
  create,
};
