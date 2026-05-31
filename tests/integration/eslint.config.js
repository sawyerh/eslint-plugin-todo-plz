"use strict";

const todoPlz = require("../..");

module.exports = [
  {
    plugins: {
      "todo-plz": todoPlz,
    },
    rules: {
      "todo-plz/ticket-ref": ["error", { pattern: "PROJ-[0-9]+" }],
    },
  },
  {
    files: ["commentPattern.js"],
    rules: {
      "todo-plz/ticket-ref": [
        "error",
        { commentPattern: "TODO:\\s\\[(PROJ-[0-9]+[,\\s]*)+\\]" },
      ],
    },
  },
];
