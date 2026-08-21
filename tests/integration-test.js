"use strict";

const assert = require("assert");
const path = require("path");
const ESLint = require("eslint").ESLint;

describe("flat config integration", () => {
  it("loads the plugin and reports the expected invalid comments", async () => {
    const integrationDirectory = path.join(__dirname, "integration");
    const eslint = new ESLint({
      cwd: integrationDirectory,
      overrideConfigFile: path.join(integrationDirectory, "eslint.config.js"),
    });
    const results = await eslint.lintFiles(["index.js", "commentPattern.js"]);
    const errors = results.flatMap((result) =>
      result.messages.map((message) => ({
        file: path.basename(result.filePath),
        line: message.line,
        messageId: message.messageId,
        ruleId: message.ruleId,
      })),
    );

    assert.deepStrictEqual(errors, [
      {
        file: "index.js",
        line: 4,
        messageId: "missingTicket",
        ruleId: "todo-plz/ticket-ref",
      },
      {
        file: "commentPattern.js",
        line: 4,
        messageId: "missingTicketWithCommentPattern",
        ruleId: "todo-plz/ticket-ref",
      },
    ]);
  });
});
