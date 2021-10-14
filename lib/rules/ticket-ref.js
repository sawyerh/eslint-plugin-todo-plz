/**
 * @fileoverview Require a ticket reference in the TODO comment
 * @author Sawyer
 */
"use strict";

const messages = {
  missingTicket:
    "{{ term }} comment doesn't reference a ticket number. Ticket pattern: {{ pattern }}",
  missingTicketWithCommentPattern:
    "{{ term }} comment doesn't reference a ticket number. Comment pattern: {{ commentPattern }}",
};

const schema = [
  {
    type: "object",
    properties: {
      commentPattern: {
        type: "string",
      },
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
  const { commentPattern, pattern, terms } = {
    terms: ["TODO"],
    ...context.options[0],
  };
  const sourceCode = context.getSourceCode();
  const comments = sourceCode.getAllComments();
  const termSearchPatterns = {};

  terms.forEach((term) => {
    termSearchPatterns[term] = new RegExp(
      commentPattern || `${term}\\s?\\((${pattern}[,\\s]*)+\\)`,
      "i"
    );
  });

  /**
   * Check whether an individual comment includes a valid TODO
   * @param {object} comment
   */
  function validate(comment) {
    const value = comment.value;
    const includedTerms = terms.filter((term) => value.includes(term));
    if (!includedTerms.length) {
      return;
    }

    includedTerms.forEach((term) => {
      const searchPattern = termSearchPatterns[term];
      if (searchPattern.test(value)) return;

      context.report({
        loc: comment.loc,
        messageId: commentPattern ? "missingTicketWithCommentPattern" : "missingTicket",
        data: { commentPattern, pattern, term },
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
      url: 'https://github.com/sawyerh/eslint-plugin-todo-plz/blob/main/README.md',
    },
    fixable: null, // or "code" or "whitespace"
    messages,
    schema,
    type: "suggestion",
  },
  create,
};
