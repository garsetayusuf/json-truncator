import { JsonObject, JsonValue } from "./json-types";

export function truncateJsonArray(
  obj: JsonValue,
  maxLength: number
): JsonValue {
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
