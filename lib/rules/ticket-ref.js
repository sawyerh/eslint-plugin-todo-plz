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

function findStandaloneTermIndexes(value, term) {
  if (!term) {
    return [];
  }

  const indexes = [];
  let termIndex = value.indexOf(term);

  while (termIndex !== -1) {
    const precedingCharacter = value[termIndex - 1];
    const followingCharacter = value[termIndex + term.length];
    const hasWordCharacterBefore = /[A-Za-z0-9_]/.test(precedingCharacter || "");
    const hasWordCharacterAfter = /[A-Za-z0-9_]/.test(followingCharacter || "");

    if (!hasWordCharacterBefore && !hasWordCharacterAfter) {
      indexes.push(termIndex);
    }

    termIndex = value.indexOf(term, termIndex + term.length);
  }

  return indexes;
}

const schema = [
  {
    type: "object",
    additionalProperties: false,
    anyOf: [{ required: ["pattern"] }, { required: ["commentPattern"] }],
    properties: {
      commentPattern: {
        type: "string",
      },
      description: {
        type: "string",
      },
      pattern: {
        type: "string",
      },
      terms: {
        type: "array",
        minItems: 1,
        uniqueItems: true,
        items: {
          type: "string",
        },
      },
    },
  },
];

function create(context) {
  const { commentPattern, description, pattern, terms } = {
    terms: ["TODO"],
    ...context.options[0],
  };
  const sourceCode =
    // eslint >v10
    context.sourceCode ||
    // eslint versions below 10
    context.getSourceCode();

  const comments = sourceCode.getAllComments();
  const termSearchPatterns = {};

  terms.forEach((term) => {
    termSearchPatterns[term] = new RegExp(
      `^(?:${commentPattern || `${term}\\s?\\((${pattern}[,\\s]*)+\\)`})`,
      "i",
    );
  });

  /**
   * Check whether an individual comment includes a valid TODO
   * @param {object} comment
   */
  function validate(comment) {
    const value = comment.value;
    const normalizedValue = value.toLowerCase();

    terms.forEach((term) => {
      if (!term) return;

      const searchPattern = termSearchPatterns[term];
      const normalizedTerm = term.toLowerCase();
      const termIndexes = findStandaloneTermIndexes(
        normalizedValue,
        normalizedTerm,
      );

      termIndexes.forEach((termIndex) => {
        if (!searchPattern.test(value.slice(termIndex))) {
          context.report({
            loc: comment.loc,
            messageId: getMessageId({ commentPattern, description }),
            data: { commentPattern, description, pattern, term },
          });
        }
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
