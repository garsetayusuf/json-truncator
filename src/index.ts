import { truncateJsonArray } from "./truncate-array-object";
import { truncateJsonObject } from "./truncate-json-object";

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

export default JsonTruncator;