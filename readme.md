# JsonTruncator

**JsonTruncator** is a utility class designed for truncating JSON objects or arrays to a specified maximum length. This tool is particularly useful for managing large JSON data by limiting the amount of data displayed, which can help in debugging and logging scenarios. JsonTruncator supports both objects and arrays, including nested structures, ensuring that even deeply nested JSON data can be truncated efficiently.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Importing the Class](#importing-the-class)
  - [Using the `truncate` Method](#using-the-truncate-method)
  - [CLI Usage](#cli-usage)
- [Options](#options)
- [Author](#author)

## Installation

To use `JsonTruncator`, install the package via **NPM**, **PNPM** or **YARN**. You can install it locally within your project or globally if you intend to use it as a CLI tool.

1\. Install dependencies:

- **NPM**

```bash
npm install json-truncator
```

- **PNPM**

```bash
pnpm install json-truncator
```

- **YARN**

```bash
yarn add json-truncator
```

2\.Install the package globally (optional, for CLI usage):

- **NPM**

```bash
yarn install -g json-truncator
```

- **PNPM**

```bash
pnpm install -g json-truncator
```

- **YARN**

```bash
yarn global add json-truncator
```

Installing the package globally allows you to use the truncate-json command directly from the command line.

## Usage

### Importing the Class

To utilize the `JsonTruncator` class in your project, import it as follows:

```typescript
import { JsonTruncator } from "json-truncator";
```

### Using the `truncate` Method

The `truncate` method allows you to truncate JSON objects or arrays to a maximum number of items. Here is how you can use it:

#### Example

```typescript
import { JsonTruncator } from "json-truncator";

const inputArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const truncatedArray = JsonTruncator.truncate(inputArray, 5);

console.log(truncatedArray);
// Output: [1, 2, 3, 4, 5, '...']

const inputObject = { a: 1, b: 2, c: 3, d: 4, e: 5 };
const truncatedObject = JsonTruncator.truncate(inputObject, 3);

console.log(truncatedObject);
// Output: { a: 1, b: 2, c: 3, etc: '...' }
```

## CLI Usage

If the package is installed globally, you can use it directly from the command line to truncate JSON data.

### Commands

- **Truncate a JSON Array or Object using a predefined command :**

```bash
json-truncator -c deepArrayObject -l 5
```

- **Truncate a JSON Array by providing custom data :**

```bash
json-truncator -c -c customObject -l 2 -d '{"name": "John", "age": 30, "address": "123 Street"}'
```

- **Truncate a JSON Object by providing custom data :**

```bash
json-truncator -c customObject -l 2 -d '{"name": "John", "age": 30, "address": "123 Street"}'
```

### Options

- `-c, --command <command>`: Command to execute (Available commands: `deepArrayObject`, `arrayObject`, `notArrayObject`, `mixedArray`, `deepObject`, `object`, `mixedObject`, `customArray`, `customObject`).

- `-l, --length <number>`: Maximum number of items to be displayed, `default 3`.

- `-d, --data <json>`: JSON data to be truncated (used with `customArray` or `customObject`).

## Author

**Garsetayusuf**

Email: garsetayusuf@gmail.com
