/**
 * Convert a date string from lottery sources to YYYY-MM-DD.
 */
function formatDate(dateString) {
  const slashParts = dateString.split("/");

  if (slashParts.length === 3) {
    const [month, day, year] = slashParts.map((part) => parseInt(part.trim(), 10));

    if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
      return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    }
  }

  const monthNames = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };

  const match = dateString.match(/^(\w+)\s+(\d+),?\s+(\d+)$/i);

  if (match) {
    const [, monthStr, dayStr, yearStr] = match;
    const month = monthNames[monthStr.toLowerCase()];
    const day = parseInt(dayStr, 10);
    const year = parseInt(yearStr, 10);

    if (month !== undefined && !Number.isNaN(day) && !Number.isNaN(year)) {
      return `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    }
  }

  return dateString;
}

module.exports = { formatDate };
