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
  missingTicketWithDescription:
    "{{ term }} comment doesn't reference a ticket number. {{ description }}",
};

function getMessageId({ commentPattern, description }) {
  if (description) {
    return "missingTicketWithDescription";
  }

  if (commentPattern) {
    return "missingTicketWithCommentPattern";
  }

  return "missingTicket";
}

function getPatternFlags(pattern) {
  return pattern instanceof RegExp ? pattern.flags : "i";
}

const schema = [
  {
    type: "object",
    properties: {
      commentPattern: {
        anyOf: [{ type: "string" }, { type: "object" }],
      },
      description: {
        type: "string",
      },
      pattern: {
        anyOf: [{ type: "string" }, { type: "object" }],
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
  var options = Object.assign({ terms: ["TODO"] }, context.options[0]);
  var commentPattern = options.commentPattern;
  var description = options.description;
  var pattern = options.pattern;
  var terms = options.terms;
  const sourceCode =
    // eslint >v10
    context.sourceCode ||
    // eslint versions below 10
    context.getSourceCode();

  const comments = sourceCode.getAllComments();
  const termSearchPatterns = {};

  terms.forEach((term) => {
    if (commentPattern instanceof RegExp) {
      termSearchPatterns[term] = commentPattern;
      return;
    }

    const ticketPattern = pattern instanceof RegExp ? pattern.source : pattern;

    termSearchPatterns[term] = new RegExp(
      commentPattern || `${term}\\s?\\((${ticketPattern}[,\\s]*)+\\)`,
      getPatternFlags(pattern),
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
        messageId: getMessageId({ commentPattern, description }),
        data: { commentPattern, description, pattern, term },
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
      url: "https://github.com/sawyerh/eslint-plugin-todo-plz/blob/main/docs/rules/ticket-ref.md",
    },
    fixable: null, // or "code" or "whitespace"
    messages,
    schema,
    type: "suggestion",
  },
  create,
};
