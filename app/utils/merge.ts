type GenericObject = { [key: string]: any };

export class ObjectMatcher<T extends GenericObject> {
  private structuredObject: T;

  constructor(structuredObject: T) {
    this.structuredObject = structuredObject;
  }

  match(objects: T[]): boolean {
    for (const obj of objects) {
      if (this.isMatch(obj)) {
        return true;
      }
    }
    return false;
  }

  mergeMatching(...arrays: T[][]): T[] {
    const matchingObjects: T[] = [];
    for (const array of arrays) {
      for (const obj of array) {
        if (this.match([obj])) {
          matchingObjects.push(obj);
        }
      }
    }
    return this.recursiveMerge(matchingObjects);
  }

  matchCSV(csvString: string): boolean {
    const objects = this.csvToObjects(csvString);
    return this.match(objects);
  }

  private isMatch(obj: T): boolean {
    const structuredKeys = Object.keys(this.structuredObject);
    const objKeys = Object.keys(obj);

    // Check if both objects have the same keys
    if (
      structuredKeys.length !== objKeys.length ||
      !structuredKeys.every((key) => objKeys.includes(key))
    ) {
      return false;
    }

    // Check if the value for each key in both objects has matching structure
    return structuredKeys.every((key) => {
      const structuredValue = this.structuredObject[key];
      const objValue = obj[key];

      // Check if both values are objects for nested comparison
      if (typeof structuredValue === "object" && typeof objValue === "object") {
        return this.isMatch(objValue); // Recursively check nested structure
      }

      // If not objects, structures match
      return true;
    });
  }

  private recursiveMerge(objects: T[]): T[] {
    const mergedObjects: T[] = [];

    for (const obj of objects) {
      const mergedObject: T = {} as T; // Create a new mergedObject for each iteration

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key in mergedObject) {
            if (
              typeof mergedObject[key] === "object" &&
              !Array.isArray(mergedObject[key])
            ) {
              // Recursive merge for nested objects
              (mergedObject[key] as any) = this.recursiveMerge(
                objects.map((o) => o[key] as T)
              );
            } else {
              // If key already exists, and it's not an object, skip
              continue;
            }
          } else {
            // Assign value directly if key doesn't exist
            mergedObject[key] = obj[key];
          }
        }
      }
      // Push the merged object into the array
      mergedObjects.push(mergedObject);
    }

    return mergedObjects;
  }

  private csvToObjects(csvString: string): T[] {
    const lines = csvString.trim().split("\n");
    const headers = lines[0].split(",").map((header) => header.trim());
    const objects: T[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const obj: GenericObject = {};
      values.forEach((value, index) => {
        obj[headers[index]] = this.parseValue(value.trim());
      });
      objects.push(obj as T);
    }

    return objects;
  }

  private parseValue(value: string): any {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      return numValue;
    }

    if (value.toLowerCase() === "true") {
      return true;
    } else if (value.toLowerCase() === "false") {
      return false;
    }

    // Check for date format (YYYY-MM-DD)
    const dateMatch = value.match(/^\d{4}-\d{2}-\d{2}$/);
    if (dateMatch) {
      return new Date(value);
    }

    // Attempt to parse as JSON
    try {
      return JSON.parse(value);
    } catch (error) {
      // Return value as string if not able to parse as JSON
      return value;
    }
  }
}
