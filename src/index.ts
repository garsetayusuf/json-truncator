type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonValue[];
type JsonObject = { [key: string]: JsonValue };
type JsonValue = JsonPrimitive | JsonArray | JsonObject;

function truncateJsonArray(obj: JsonValue, maxLength: number): JsonValue {
  if (Array.isArray(obj)) {
    // Separate primitives and non-primitives
    const primitives = obj.filter(
      (item) => typeof item !== "object" || item === null
    );
    const arrays = obj.filter(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        Object.values(item).some((value) => Array.isArray(value))
    );
    const nonArrayObjects = obj.filter(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        Object.values(item).some((value) => !Array.isArray(value))
    );

    // Truncate all types
    const truncatedPrimitives = primitives.slice(0, Math.max(1, maxLength));
    const truncatedArrays = arrays.slice(0, Math.max(1, maxLength));
    const truncatedNonArrayObjects = nonArrayObjects.slice(
      0,
      Math.max(1, maxLength)
    );

    let result: JsonValue[] = [
      ...truncatedPrimitives,
      ...truncatedArrays,
      ...truncatedNonArrayObjects,
    ];

    // If truncation occurs, add '...' or '{ etc: "..." }'
    if (obj.length > maxLength) {
      if (result.length === 0) {
        result.push({ etc: "..." });
      } else if (
        typeof result[result.length - 1] === "object" &&
        !Array.isArray(result[result.length - 1])
      ) {
        result.push({ etc: "..." });
      } else {
        result.push("...");
      }
    }

    // Recursively apply truncation on arrays and non-array objects
    return result.map((item) => truncateJsonArray(item, maxLength));
  } else if (typeof obj === "object" && obj !== null) {
    // Process each key-value pair in the object
    const newObj: JsonObject = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = truncateJsonArray((obj as JsonObject)[key], maxLength);
      }
    }
    return newObj;
  } else {
    return obj;
  }
}

function truncateJsonObject(obj: JsonObject, maxLength: number): JsonObject {
  // Separate primitives, arrays, and non-array objects
  const primitives: JsonObject[] = [];
  const arrays: JsonObject[] = [];
  const nonArrayObjects: JsonObject[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value !== "object" || value === null) {
      primitives.push({ [key]: value });
    } else if (Array.isArray(value)) {
      arrays.push({ [key]: value });
    } else {
      nonArrayObjects.push({ [key]: value });
    }
  }

  // Truncate each type ensuring at least one of each type is included
  const truncatedPrimitives = primitives.slice(0, Math.max(1, maxLength));
  const truncatedArrays = arrays.slice(0, Math.max(1, maxLength));
  const truncatedNonArrayObjects = nonArrayObjects.slice(
    0,
    Math.max(1, maxLength)
  );
  const merge = [
    ...truncatedPrimitives,
    ...truncatedArrays,
    ...truncatedNonArrayObjects,
  ];
  let result: JsonObject | any = {};

  merge.forEach((item) => Object.assign(result, item));

  // If truncation occurs, add '...' or '{ etc: "..." }'
  const totalItems = primitives.length + arrays.length + nonArrayObjects.length;
  if (totalItems > maxLength) {
    if (typeof result === "object" && !Array.isArray(result)) {
      result.etc = "...";
    } else {
      result = { ...result, etc: "..." };
    }
  }

  // Recursively apply truncation on arrays and non-array objects
  if (arrays.length > 0) {
    const truncate = arrays.reduce((acc, curr) => {
      const keys = Object.keys(acc);

      // If the accumulator already has the maximum number of keys, skip merging
      if (keys.length >= maxLength) {
        return acc;
      }

      const newKeys = Object.keys(curr);
      const remainingSpace = maxLength - keys.length;

      // Merge the current object with the accumulator, up to the remaining space
      const merged = newKeys.slice(0, remainingSpace).reduce(
        (obj, key) => {
          obj[key] = curr[key];
          return obj;
        },
        { ...acc }
      );

      // If we have filled up the space, add the "etc" indicator
      if (Object.keys(merged).length >= maxLength) {
        merged.etc = "...";
      }

      return merged;
    }, {} as JsonObject);

    for (const key in truncate) {
      if (Array.isArray(truncate[key])) {
        truncate[key] = truncateJsonArray(truncate[key], maxLength);
      }
    }
    return { ...result, ...truncate };
  }

  if (nonArrayObjects.length > 0) {
    for (const key in nonArrayObjects[0]) {
      result[key] = truncateJsonObject(
        nonArrayObjects[0][key] as JsonObject,
        maxLength
      );
    }
  }

  return result;
}

export { truncateJsonArray, truncateJsonObject };

export class JsonTruncator {
  /**
   * 
   * @param obj The json object or array to be truncated
   * @param maxLength The maximum number of items to be displayed
   * @example
   * const input = { a: 1, b: 2, c: 3, d: 4, e: 5 };
   * const result = JsonTruncator.truncate(input, 3);
   * // result: { a: 1, b: 2, c: 3, etc: '...' }
   */
  public static truncate(obj: any, maxLength: number): any {
    const isArray = Array.isArray(obj);
    const isObject = typeof obj === "object" && !Array.isArray(obj);

    if (isArray) {
      return truncateJsonArray(obj, maxLength);
    } else if (isObject) {
      return truncateJsonObject(obj, maxLength);
    } else {
      return obj;
    }
  }
}

