export function truncateString(str: string, maxLength: number = 30): string {
    if (str.length <= maxLength) {
      return str; // No truncation needed
    } else {
      return str.substring(0, maxLength - 3) + "..."; 
    }
  }