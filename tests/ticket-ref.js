const RuleTester = require("eslint").RuleTester;
const rule = require("../lib/rules/ticket-ref");
const ruleTester = new RuleTester();

const messages = {
  missingTodoTicket:
    "TODO comment doesn't reference a ticket number. Ticket pattern: PROJ-[0-9]+",
  missingFixmeTicket:
    "FIXME comment doesn't reference a ticket number. Ticket pattern: PROJ-[0-9]+",
};

const options = {
  jira: { pattern: "PROJ-[0-9]+" },
};

ruleTester.run("ticket-ref", rule, {
  valid: [
    {
      code: "// TODO (PROJ-123): Connect to the API",
      options: [options.jira],
    },
    {
      code: "// TODO (PROJ-123, PROJ-456): Connect to the API",
      options: [options.jira],
    },
    {
      code: "//TODO (PROJ-123) Connect to the API",
      options: [options.jira],
    },
    {
      code: "// TODO(PROJ-123): Connect to the API",
      options: [options.jira],
    },
    {
      code: "/* TODO(PROJ-123): Connect to the API */",
      options: [options.jira],
    },
    {
      code: "// todo (PROJ-123): Connect to the API",
      options: [options.jira],
    },
    {
      code: "// The API",
      options: [options.jira],
    },
    {
      code: `/**
              * Description
              * TODO (PROJ-123): Connect to the API
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
    {
      code: "// TODO: Connect to the API",
      options: [{ pattern: "PROJ-[0-9]+", terms: ["FIXME"] }],
    },
    {
      code: "// FIXME (PROJ-2): Connect to the API",
      options: [{ pattern: "PROJ-[0-9]+", terms: ["FIXME"] }],
    },
  ],

  invalid: [
    {
      code: "// TODO: Connect to the API",
      errors: [
        {
          message: messages.missingTodoTicket,
        },
      ],
      options: [options.jira],
    },
    {
      code: "// TODO (a-1): Connect to the API",
      errors: [
        {
          message: messages.missingTodoTicket,
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
          message: messages.missingTodoTicket,
        },
      ],
      options: [options.jira],
    },
    {
      code: "// FIXME: Connect to the API",
      errors: [{ message: messages.missingFixmeTicket }],
      options: [{ pattern: "PROJ-[0-9]+", terms: ["FIXME"] }],
    },
  ],
});
