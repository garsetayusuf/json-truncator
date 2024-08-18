import { JsonObject } from "./json-types";
import { truncateJsonArray } from "./truncate-array-object";

export function truncateJsonObject(
  obj: JsonObject,
  maxLength: number
): JsonObject {
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
