export interface EntropyReport {
  characterCount: number;
  lineCount: number;
  uniqueCharacterCount: number;
}

export function analyzeEntropy(input: string): EntropyReport {
  const uniqueCharacters = new Set(input);

  return {
    characterCount: input.length,
    lineCount: input.length === 0 ? 0 : input.split(/\r?\n/).length,
    uniqueCharacterCount: uniqueCharacters.size,
  };
}
