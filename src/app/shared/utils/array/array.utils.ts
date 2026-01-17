/**
 * Array Utility Functions
 * 
 * Provides pure utility functions for array manipulation and transformation.
 * All functions are immutable and do not modify the original array.
 */

/**
 * Splits an array into chunks of specified size
 * 
 * @param array - Source array to chunk
 * @param size - Size of each chunk
 * @returns Array of arrays (chunks)
 * 
 * @example
 * chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) return [];
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * Flattens a nested array structure to a single level
 * 
 * @param array - Nested array to flatten
 * @param depth - Maximum depth to flatten (default: 1)
 * @returns Flattened array
 * 
 * @example
 * flatten([[1, 2], [3, [4, 5]]]) // [1, 2, 3, [4, 5]]
 * flatten([[1, 2], [3, [4, 5]]], Infinity) // [1, 2, 3, 4, 5]
 */
export function flatten<T>(array: any[], depth: number = 1): T[] {
  if (depth === 0) return array;
  return array.reduce((acc, val) => 
    Array.isArray(val) 
      ? acc.concat(flatten(val, depth - 1))
      : acc.concat(val), 
    []
  );
}

/**
 * Returns unique values from an array
 * 
 * @param array - Source array
 * @param keyFn - Optional function to extract comparison key
 * @returns Array with unique values
 * 
 * @example
 * unique([1, 2, 2, 3, 3, 3]) // [1, 2, 3]
 * unique([{id: 1}, {id: 2}, {id: 1}], item => item.id) // [{id: 1}, {id: 2}]
 */
export function unique<T>(array: T[], keyFn?: (item: T) => any): T[] {
  if (!keyFn) {
    return Array.from(new Set(array));
  }
  
  const seen = new Set();
  return array.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Groups array elements by a key function
 * 
 * @param array - Source array
 * @param keyFn - Function to extract grouping key
 * @returns Object with grouped elements
 * 
 * @example
 * groupBy([{type: 'a', value: 1}, {type: 'b', value: 2}, {type: 'a', value: 3}], item => item.type)
 * // { a: [{type: 'a', value: 1}, {type: 'a', value: 3}], b: [{type: 'b', value: 2}] }
 */
export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * Sorts an array by a key or comparator function
 * 
 * @param array - Source array to sort
 * @param keyFn - Function to extract sort key or comparator
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array (new array, original not modified)
 * 
 * @example
 * sortBy([{name: 'John'}, {name: 'Alice'}], item => item.name) // [{name: 'Alice'}, {name: 'John'}]
 * sortBy([3, 1, 2], x => x, 'desc') // [3, 2, 1]
 */
export function sortBy<T>(
  array: T[], 
  keyFn: (item: T) => any, 
  order: 'asc' | 'desc' = 'asc'
): T[] {
  const multiplier = order === 'asc' ? 1 : -1;
  
  return [...array].sort((a, b) => {
    const aVal = keyFn(a);
    const bVal = keyFn(b);
    
    if (aVal < bVal) return -1 * multiplier;
    if (aVal > bVal) return 1 * multiplier;
    return 0;
  });
}

/**
 * Removes falsy values from an array
 * 
 * @param array - Source array
 * @returns Array without falsy values (false, null, 0, "", undefined, NaN)
 * 
 * @example
 * compact([0, 1, false, 2, '', 3, null, undefined, NaN]) // [1, 2, 3]
 */
export function compact<T>(array: T[]): NonNullable<T>[] {
  return array.filter(Boolean) as NonNullable<T>[];
}

/**
 * Returns the difference between two arrays
 * 
 * @param array1 - First array
 * @param array2 - Second array
 * @returns Elements in array1 that are not in array2
 * 
 * @example
 * difference([1, 2, 3], [2, 3, 4]) // [1]
 */
export function difference<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2);
  return array1.filter(item => !set2.has(item));
}

/**
 * Returns the intersection of two arrays
 * 
 * @param array1 - First array
 * @param array2 - Second array
 * @returns Elements that exist in both arrays
 * 
 * @example
 * intersection([1, 2, 3], [2, 3, 4]) // [2, 3]
 */
export function intersection<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2);
  return array1.filter(item => set2.has(item));
}

/**
 * Returns the union of two arrays (all unique elements)
 * 
 * @param array1 - First array
 * @param array2 - Second array
 * @returns All unique elements from both arrays
 * 
 * @example
 * union([1, 2, 3], [2, 3, 4]) // [1, 2, 3, 4]
 */
export function union<T>(array1: T[], array2: T[]): T[] {
  return unique([...array1, ...array2]);
}

/**
 * Partitions an array into two groups based on a predicate
 * 
 * @param array - Source array
 * @param predicate - Function to test each element
 * @returns Tuple of [matching elements, non-matching elements]
 * 
 * @example
 * partition([1, 2, 3, 4, 5], x => x % 2 === 0) // [[2, 4], [1, 3, 5]]
 */
export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];
  
  array.forEach(item => {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  });
  
  return [truthy, falsy];
}

/**
 * Returns the first element that matches the predicate
 * 
 * @param array - Source array
 * @param predicate - Function to test each element
 * @returns First matching element or undefined
 * 
 * @example
 * find([1, 2, 3, 4], x => x > 2) // 3
 */
export function find<T>(array: T[], predicate: (item: T) => boolean): T | undefined {
  return array.find(predicate);
}

/**
 * Removes elements at specified indices
 * 
 * @param array - Source array
 * @param indices - Array of indices to remove
 * @returns New array without elements at specified indices
 * 
 * @example
 * removeAt([1, 2, 3, 4], [1, 3]) // [1, 3]
 */
export function removeAt<T>(array: T[], indices: number[]): T[] {
  const indexSet = new Set(indices);
  return array.filter((_, index) => !indexSet.has(index));
}

/**
 * Moves an element from one index to another
 * 
 * @param array - Source array
 * @param fromIndex - Current index of element
 * @param toIndex - Target index
 * @returns New array with element moved
 * 
 * @example
 * move([1, 2, 3, 4], 0, 2) // [2, 3, 1, 4]
 */
export function move<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}
