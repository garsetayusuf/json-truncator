#!/usr/bin/env node

import { Command } from "commander";
import { truncateJsonArray, truncateJsonObject } from "./index";
import {
  deepArrayObject,
  arrayObject,
  notArrayObject,
  mixedArray,
  deepObject,
  object,
  mixedObject,
} from "./data";

const availableCommands = [
  "deepArrayObject",
  "arrayObject",
  "notArrayObject",
  "mixedArray",
  "deepObject",
  "object",
  "mixedObject",
];

const program = new Command();

program
  .version("1.0.0")
  .description("A CLI for truncating JSON arrays and objects")
  .option("-c, --command <command>", `Command to execute.`)
  .option("-l, --length <number>", "Max length for truncation", "3")
  .option(
    "-d, --data <string>",
    "JSON data for customArray or customObject commands"
  )
  .on("--help", () => {
    console.log("\nAvailable commands:");
    console.log(availableCommands.join(", "));
  });

// Parse the arguments
program.parse(process.argv);

const options = program.opts();
const command = options.command;
const maxLength = parseInt(options.length, 10);

if (process.argv.length === 2) {
  // No arguments provided, show help
  program.help();
} else {
  // If a command is provided, ensure it is valid
  if (command && !availableCommands.includes(command)) {
    console.error(
      `Invalid command: ${command}\nAvailable commands: ${availableCommands.join(
        ", "
      )}`
    );
    process.exit(1);
  }

  // Check if a command was provided and if it's valid
  if (!command) {
    console.error(
      "Command is required. Use -c to specify a command. Available commands: " +
        availableCommands.join(", ")
    );
    process.exit(1);
  }

  function processAndPrint(data: any, isArray: boolean) {
    const result = isArray
      ? truncateJsonArray(data, maxLength)
      : truncateJsonObject(data, maxLength);
    console.log(JSON.stringify(result, null, 2));
  }

  try {
    // Process predefined commands
    switch (command) {
      case "deepArrayObject":
        processAndPrint(deepArrayObject, true);
        break;
      case "arrayObject":
        processAndPrint(arrayObject, true);
        break;
      case "notArrayObject":
        processAndPrint(notArrayObject, false);
        break;
      case "mixedArray":
        processAndPrint(mixedArray, true);
        break;
      case "deepObject":
        processAndPrint(deepObject, false);
        break;
      case "object":
        processAndPrint(object, false);
        break;
      case "mixedObject":
        processAndPrint(mixedObject, false);
        break;
      default:
        console.error("Unknown command");
        program.help();
        break;
    }
  } catch (error) {
    console.error("Error:", (error as Error).message);
    process.exit(1);
  }
}
