const IngestionManager = require('../lib/ingestion/ingestionManager');
const NCPick3Parser = require('../lib/ingestion/parsers/ncPick3Parser');

// Reset the ingestion manager before each test to clear the parsers map
jest.mock('../lib/ingestion/ingestionManager', () => {
  // We'll require the actual module but reset its state
  const actualModule = jest.requireActual('../lib/ingestion/ingestionManager');
  // Reset the singleton instance
  actualModule.parsers = new Map();
  return actualModule;
});

// Mock the supabase client properly
jest.mock('../lib/supabase/serverClient', () => {
  // Create a mock that properly chains the methods
  const mockSupabase = {
    from: jest.fn(),
    select: jest.fn(),
    eq: jest.fn(),
    single: jest.fn(),
    insert: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn()
  };

  // Setup the mock implementations
  mockSupabase.from.mockImplementation((table) => {
    // Return an object that has the select method
    const fromResult = {
      select: jest.fn().mockReturnValue(fromResult),
      eq: jest.fn().mockReturnValue(fromResult),
      single: jest.fn(),
      insert: jest.fn().mockReturnValue(fromResult),
      upsert: jest.fn().mockReturnValue(fromResult),
      update: jest.fn().mockReturnValue(fromResult)
    };

    // Configure based on table
    if (table === 'lottery_games') {
      fromResult.single.mockResolvedValue({ data: { id: 'test-game-id' }, error: null });
    } else if (table === 'draw_sources') {
      fromResult.single.mockResolvedValue({ data: { id: 'test-source-id' }, error: null });
    } else if (table === 'official_draws') {
      fromResult.upsert.mockResolvedValue({ count: 1, error: null });
    }
    
    return fromResult;
  });

  return {
    supabase: mockSupabase
  };
});

// Mock the draw ingestion run
jest.mock('../lib/ingestion/drawIngestionRun', () => {
  return {
    createRun: jest.fn().mockImplementation(() => {
      return {
        updateStatus: jest.fn().mockResolvedValue({}),
        id: 'test-run-id'
      };
    })
  };
});

describe('IngestionManager', () => {
  let ingestionManager;
  let mockParser;

  beforeEach(() => {
    // Get a fresh instance of the ingestion manager
    ingestionManager = require('../lib/ingestion/ingestionManager');
    // Clear the parsers map
    ingestionManager.parsers.clear();

    mockParser = {
      stateCode: 'NC',
      gameKey: 'nc-pick3',
      sourceKey: 'official-website',
      fetch: jest.fn().mockResolvedValue([{ draw_date: '2023-01-01', draw_type: 'day', numbers: [1, 2, 3] }]),
      parse: jest.fn().mockImplementation((raw) => raw),
      validate: jest.fn().mockImplementation((draw) => {
        return draw &&
          draw.draw_date &&
          draw.draw_type &&
          Array.isArray(draw.numbers) &&
          draw.numbers.length === 3 &&
          draw.numbers.every(n => n >= 0 && n <= 9);
      }),
      normalizeDraw: jest.fn().mockImplementation((rawDraw) => ({
        game_id: null,
        draw_date: rawDraw.draw_date,
        draw_window_label: rawDraw.draw_type,
        draw_datetime_local: new Date(`${rawDraw.draw_date}T${rawDraw.draw_type === 'day' ? '12:30' : '21:30'}`).toISOString(),
        primary_numbers: rawDraw.numbers,
        bonus_numbers: [],
        special_values: {},
        result_status: 'official'
      })),
      // Add the ingest method that the manager expects
      ingest: jest.fn().mockResolvedValue({
        success: true,
        drawsSeen: 1,
        drawsInserted: 1,
        draws: [{ draw_date: '2023-01-01', draw_type: 'day', numbers: [1, 2, 3] }]
      })
    };

    // Register the mock parser
    ingestionManager.registerParser('nc-pick3', mockParser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should register a parser', () => {
    expect(ingestionManager.getParser('nc-pick3')).toBe(mockParser);
  });

  test('should return null for unregistered parser', () => {
    expect(ingestionManager.getParser('nc-pick4')).toBeNull();
  });

  test('should ingest a game successfully', async () => {
    const result = await ingestionManager.ingestGame('nc-pick3');

    expect(result).toEqual({
      success: true,
      gameKey: 'nc-pick3',
      drawsSeen: 1,
      drawsInserted: 1
    });

    // Verify that the parser's methods were called
    expect(mockParser.fetch).toHaveBeenCalledTimes(1);
    expect(mockParser.parse).toHaveBeenCalledTimes(1);
    expect(mockParser.validate).toHaveBeenCalledTimes(1);
    expect(mockParser.normalizeDraw).toHaveBeenCalledTimes(1);

    // Verify that the draw ingestion run was created and updated
    const { createRun } = require('../lib/ingestion/drawIngestionRun');
    expect(createRun).toHaveBeenCalledWith({
      gameKey: 'nc-pick3',
      sourceKey: 'official-website',
      runType: 'scheduled'
    });

    // Verify that the run's updateStatus was called for 'running' and then for 'succeeded'
    const mockRun = createRun.mock.results[0].value;
    expect(mockRun.updateStatus).toHaveBeenCalledTimes(2);
    expect(mockRun.updateStatus).toHaveBeenNthCalledWith(1, 'running');
    expect(mockRun.updateStatus).toHaveBeenNthCalledWith(2, 'succeeded', {
      drawsSeen: 1,
      drawsInserted: 1,
      drawsUpdated: 0,
      drawsSkipped: 0,
      logSummary: 'Ingested 1 draws for nc-pick3'
    });
  });

  test('should handle ingestion failure', async () => {
    // Make the parser's ingest reject to simulate failure
    mockParser.ingest.mockRejectedValueOnce(new Error('Network error'));

    const result = await ingestionManager.ingestGame('nc-pick3');

    expect(result).toEqual({
      success: false,
      gameKey: 'nc-pick3',
      error: 'Network error'
    });

    // Verify that the draw ingestion run was created and updated to failed
    const { createRun } = require('../lib/ingestion/drawIngestionRun');
    expect(createRun).toHaveBeenCalledWith({
      gameKey: 'nc-pick3',
      sourceKey: 'official-website',
      runType: 'scheduled'
    });

    const mockRun = createRun.mock.results[0].value;
    expect(mockRun.updateStatus).toHaveBeenCalledTimes(2);
    expect(mockRun.updateStatus).toHaveBeenNthCalledWith(1, 'running');
    expect(mockRun.updateStatus).toHaveBeenNthCalledWith(2, 'failed', {
      errorCount: 1,
      logSummary: 'Failed to ingest nc-pick3: Network error'
    });
  });
});