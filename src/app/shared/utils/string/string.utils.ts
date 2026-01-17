/**
 * String Utility Functions
 */

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function camelCase(str: string): string {
  return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}

export function kebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();
}

export function snakeCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toLowerCase();
}

export function pascalCase(str: string): string {
  return camelCase(str).replace(/^(.)/, (_, c) => c.toUpperCase());
}

export function slugify(str: string): string {
  return str.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

export function sanitize(str: string): string {
  return str.replace(/[<>]/g, '');
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}
