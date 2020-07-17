const RuleTester = require("eslint").RuleTester;
const rule = require("../lib/rules/ticket-ref");
const ruleTester = new RuleTester();

const messages = {
  missingTicket:
    "TODO comment is missing a ticket reference matching pattern: ABC-[0-9]+",
};

const options = {
  jira: { pattern: "ABC-[0-9]+" },
};

ruleTester.run("ticket-ref", rule, {
  valid: [
    {
      code: "// TODO (ABC-123): Connect to the API",
      options: [options.jira],
    },
    {
      code: "//TODO (ABC-123) Connect to the API",
      options: [options.jira],
    },
    {
      code: "// TODO(ABC-123): Connect to the API",
      options: [options.jira],
    },
    {
      code: "/* TODO(ABC-123): Connect to the API */",
      options: [options.jira],
    },
    {
      code: "// todo (abc-123): Connect to the API",
      options: [options.jira],
    },
    {
      code: "// The API",
      options: [options.jira],
    },
    {
      code: `/**
              * Description
              * TODO (ABC-123): Connect to the API
              * @returns {string}
              */`,
      options: [options.jira],
    },
    {
      code: `/**
              * Description
              * @returns {string}
              */`,
      options: [options.jira],
    },
  ],

  invalid: [
    {
      code: "// TODO: Connect to the API",
      errors: [
        {
          message: messages.missingTicket,
        },
      ],
      options: [options.jira],
    },
    {
      code: "// TODO (a-1): Connect to the API",
      errors: [
        {
          message: messages.missingTicket,
        },
      ],
      options: [options.jira],
    },
    {
      code: `/**
              * Description
              * TODO: Connect to the API
              * @returns {string}
              */`,
      errors: [
        {
          message: messages.missingTicket,
        },
      ],
      options: [options.jira],
    },
  ],
});
