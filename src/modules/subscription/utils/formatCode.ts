export function formatCode(name: string): string {
    if (!name || typeof name !== 'string') {
      throw new Error('Name must be a non-empty string');
    }
    return name.split(' ').map(word => word.toUpperCase()).join('_');
  }