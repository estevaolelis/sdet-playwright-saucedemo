export function parsePrice(text: string): number {
  const match = text.match(/\$(\d+(?:\.\d+)?)/);
  if (!match) {
    throw new Error(`No price found in: "${text}"`);
  }
  return Number.parseFloat(match[1]);
}
