# BrewLotto V1 - Fireball & Special Value Handling

## Overview

BrewLotto V1 properly accounts for fireball, greenball, and double play features in NC and CA lotteries.

## NC Lottery Special Values

### NC Pick 3
- **Fireball**: Single number (0-9) drawn after main numbers
- **GreenBall**: Appears to be for special promotions (currently unused)
- **Data Format**: CSV with columns `Ball 1, Ball 2, Ball 3, Fireball, GreenBall`
- **Parser**: `ncPick3Parser.js` captures both values in `special_values`

### NC Pick 4
- **Fireball**: Single number (0-9) drawn after main numbers
- **Data Format**: CSV with columns `Ball 1, Ball 2, Ball 3, Ball 4, Fireball`
- **Parser**: `ncPick4Parser.js` captures fireball in `special_values`

### NC Cash 5
- **Double Play (DP)**: Additional draw for extra prizes (0 or 1)
- **Data Format**: CSV with columns `Ball 1, Ball 2, Ball 3, Ball 4, Ball 5, DP`
- **Parser**: `ncCash5Parser.js` captures double play in `special_values`

## CA Lottery Special Values

### CA Daily 3 (Pick 3)
- **Fireball**: Single number (0-9) as bonus number
- **Parser**: `caPick3Parser.js` updated to handle fireball

### CA Daily 4 (Pick 4)
- **Fireball**: Single number (0-9) as bonus number
- **Parser**: `caPick4Parser.js` updated to handle fireball

### CA Fantasy 5
- **No special values** in current data source
- Parser ready for future updates if special values are added

## Database Schema

The `official_draws` table includes:
- `primary_numbers`: Array of main numbers
- `bonus_numbers`: Array of bonus numbers (e.g., Powerball)
- `special_values`: JSON object for game-specific values
  - Example: `{"fireball": 6, "greenball": null}`
  - Example: `{"doublePlay": 1}`

## Parser Implementation

### NC CSV Parser (`ncCSVParser.js`)
```javascript
// Parses NC CSV files with special values
{
  draw_date: "2026-03-16",
  draw_type: "day",
  numbers: [3, 5, 6],
  fireball: 6,        // From Fireball column
  greenball: null,    // From GreenBall column
  doublePlay: 0       // From DP column (Cash 5)
}
```

### Normalization
Special values are stored in the `special_values` field:
```javascript
{
  special_values: {
    fireball: 6,
    greenball: null,
    doublePlay: 0
  }
}
```

## Current Data Status

### North Carolina (✅ Complete)
- Pick 3: 13,605 draws with Fireball
- Pick 4: 11,674 draws with Fireball
- Cash 5: 8,866 draws with Double Play

### California (⚠️ Partial)
- Fantasy 5: 30 draws (live data)
- Pick 3: Sample data (need live source)
- Pick 4: Sample data (need live source)

## API Integration

The prediction API handles special values:
- GET `/api/predict/[game]` - Returns predictions with strategy scores
- POST `/api/predict` - Stores predictions with special values

## Next Steps

1. **Find live CA data sources** for Pick 3/Pick 4
2. **Ingest NC data** into Supabase with special values
3. **Test prediction storage** with fireball values
4. **Update UI** to display special values in predictions

## Files Updated

- `/lib/ingestion/parsers/ncCSVParser.js` - New CSV parser with special values
- `/lib/ingestion/parsers/ncPick3Parser.js` - Updated for Fireball/Greenball
- `/lib/ingestion/parsers/ncPick4Parser.js` - Updated for Fireball
- `/lib/ingestion/parsers/ncCash5Parser.js` - Updated for Double Play
- `/lib/ingestion/parsers/caPick3Parser.js` - Updated for Fireball
- `/lib/ingestion/parsers/caPick4Parser.js` - Updated for Fireball
- `/app/api/predict/route.js` - Added POST method for prediction storage
