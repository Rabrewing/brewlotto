"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fetcher = void 0;
const axios_1 = require("axios");
/**
 * HTTP fetcher with retry logic and timeout control
 */
class Fetcher {
    constructor(options = {}) {
        this.maxRetries = options.maxRetries ?? 3;
        this.timeoutMs = options.timeoutMs ?? 10000;
        this.userAgent = options.userAgent ?? 'BrewLotto-Ingestion/1.0';
    }
    /**
     * Fetch data with retry logic
     */
    async fetch(url, options = {}) {
        let lastError;
        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            try {
                const response = await axios_1.default.get(url, {
                    timeout: this.timeoutMs,
                    headers: {
                        'User-Agent': this.userAgent,
                        'Accept': options.responseType === 'text' ? 'text/html' : 'application/json',
                    },
                    responseType: options.responseType === 'text' ? 'text' : 'json',
                });
                return options.responseType === 'text' ? response.data : response.data;
            }
            catch (error) {
                lastError = error;
                // Don't retry on client errors (4xx) except 429
                if (axios_1.default.isAxiosError(error) && error.response?.status >= 400 && error.response?.status < 500 && error.response?.status !== 429) {
                    throw error;
                }
                // Wait before retry (exponential backoff)
                if (attempt < this.maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                }
            }
        }
        throw new Error(`Failed to fetch ${url} after ${this.maxRetries + 1} attempts: ${lastError?.message}`);
    }
}
exports.Fetcher = Fetcher;
