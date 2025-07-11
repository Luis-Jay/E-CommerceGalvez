export function truncateString(str: string, maxLength: number, ending: string = '...'): string {
    if (str.length > maxLength) {
      // Ensure there's enough space for the ending
      const truncatedLength = maxLength - ending.length;
      // Prevent negative length if maxLength is too small
      const finalLength = Math.max(0, truncatedLength); 
      return str.slice(0, finalLength) + ending;
    }
    return str;
  }