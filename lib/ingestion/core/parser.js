"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCSV = parseCSV;
exports.parseHTMLTable = parseHTMLTable;
exports.extractNumbersFromHTML = extractNumbersFromHTML;
/**
 * CSV and HTML parser utilities for lottery data ingestion
 */
var cheerio_1 = require("cheerio");
/**
 * Parse CSV content into array of objects
 */
function parseCSV(csvContent) {
    var lines = csvContent.trim().split('\n');
    if (lines.length < 2)
        return [];
    var headers = lines[0].split(',').map(function (h) { return h.replace(/"/g, '').trim(); });
    var rows = [];
    var _loop_1 = function (i) {
        var values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            var row_1 = {};
            headers.forEach(function (header, index) {
                var value = values[index].replace(/"/g, '').trim();
                row_1[header] = value === '' ? null : (isNaN(Number(value)) ? value : Number(value));
            });
            rows.push(row_1);
        }
    };
    for (var i = 1; i < lines.length; i++) {
        _loop_1(i);
    }
    return rows;
}
/**
 * Parse a CSV line handling quoted values
 */
function parseCSVLine(line) {
    var result = [];
    var current = '';
    var inQuotes = false;
    for (var i = 0; i < line.length; i++) {
        var char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        }
        else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        }
        else {
            current += char;
        }
    }
    result.push(current);
    return result;
}
/**
 * Parse HTML table into array of objects
 */
function parseHTMLTable(html, tableIndex) {
    if (tableIndex === void 0) { tableIndex = 0; }
    var $ = (0, cheerio_1.load)(html);
    var tables = $('table');
    if (tables.length === 0)
        return [];
    var table = $(tables[tableIndex]);
    var headers = [];
    table.find('thead th, thead td').each(function (_, el) {
        headers.push($(el).text().trim().toLowerCase().replace(/\s+/g, '_'));
    });
    var rows = [];
    table.find('tbody tr, tr').each(function (_, tr) {
        var cells = $(tr).find('td');
        if (cells.length === headers.length) {
            var row_2 = {};
            cells.each(function (index, cell) {
                var value = $(cell).text().trim();
                row_2[headers[index]] = value === '' ? null : (isNaN(Number(value)) ? value : Number(value));
            });
            rows.push(row_2);
        }
    });
    return rows;
}
/**
 * Extract numbers from various HTML formats
 */
function extractNumbersFromHTML(html, count) {
    var $ = (0, cheerio_1.load)(html);
    var numbers = [];
    // Try lottery balls format
    $('ul.displayball li, .ball, .number-ball').each(function (i, el) {
        if (i < count) {
            var text = $(el).text().trim();
            var match = text.match(/\d+/);
            if (match) {
                numbers.push(parseInt(match[0], 10));
            }
        }
    });
    // Fallback: look for any numbers
    if (numbers.length < count) {
        var allText = $('body').text();
        var digitMatches = allText.match(/\b\d\b/g);
        if (digitMatches) {
            for (var _i = 0, digitMatches_1 = digitMatches; _i < digitMatches_1.length; _i++) {
                var match = digitMatches_1[_i];
                if (numbers.length >= count)
                    break;
                var num = parseInt(match, 10);
                if (!numbers.includes(num)) {
                    numbers.push(num);
                }
            }
        }
    }
    return numbers.slice(0, count);
}
