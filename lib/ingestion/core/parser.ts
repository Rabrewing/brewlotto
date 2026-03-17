/**
 * CSV and HTML parser utilities for lottery data ingestion
 */
import { load } from 'cheerio';

export interface ParsedRow {
  [key: string]: string | number | null;
}

/**
 * Parse CSV content into array of objects
 */
export function parseCSV(csvContent: string): ParsedRow[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  const rows: ParsedRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row: ParsedRow = {};
      headers.forEach((header, index) => {
        const value = values[index].replace(/"/g, '').trim();
        row[header] = value === '' ? null : (isNaN(Number(value)) ? value : Number(value));
      });
      rows.push(row);
    }
  }

  return rows;
}

/**
 * Parse a CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result;
}

/**
 * Parse HTML table into array of objects
 */
export function parseHTMLTable(html: string, tableIndex = 0): ParsedRow[] {
  const $ = load(html);
  const tables = $('table');

  if (tables.length === 0) return [];

  const table = $(tables[tableIndex]);
  const headers: string[] = [];

  table.find('thead th, thead td').each((_, el) => {
    headers.push($(el).text().trim().toLowerCase().replace(/\s+/g, '_'));
  });

  const rows: ParsedRow[] = [];
  table.find('tbody tr, tr').each((_, tr) => {
    const cells = $(tr).find('td');
    if (cells.length === headers.length) {
      const row: ParsedRow = {};
      cells.each((index, cell) => {
        const value = $(cell).text().trim();
        row[headers[index]] = value === '' ? null : (isNaN(Number(value)) ? value : Number(value));
      });
      rows.push(row);
    }
  });

  return rows;
}

/**
 * Extract numbers from various HTML formats
 */
export function extractNumbersFromHTML(html: string, count: number): number[] {
  const $ = load(html);
  const numbers: number[] = [];

  // Try lottery balls format
  $('ul.displayball li, .ball, .number-ball').each((i, el) => {
    if (i < count) {
      const text = $(el).text().trim();
      const match = text.match(/\d+/);
      if (match) {
        numbers.push(parseInt(match[0], 10));
      }
    }
  });

  // Fallback: look for any numbers
  if (numbers.length < count) {
    const allText = $('body').text();
    const digitMatches = allText.match(/\b\d\b/g);
    if (digitMatches) {
      for (const match of digitMatches) {
        if (numbers.length >= count) break;
        const num = parseInt(match, 10);
        if (!numbers.includes(num)) {
          numbers.push(num);
        }
      }
    }
  }

  return numbers.slice(0, count);
}
