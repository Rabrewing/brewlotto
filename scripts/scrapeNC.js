import axios from 'axios';
import { load } from 'cheerio';

// Scrape NC Pick 3 results (midday & evening)
export async function scrapeNCPick3Results() {
    const { data } = await axios.get('https://www.nclottery.com/Pick3');
    const $ = load(data);

    const results = [];
    $('.results-list .results-row').each((i, el) => {
        const date = $(el).find('.date').text().trim();
        const draws = $(el).find('.draw-result').map((_, d) => $(d).text().trim()).get();

        // Midday and evening draws
        if (draws[0]) results.push({
            date,
            time: 'midday',
            numbers: draws[0].replace(/\D/g, '').split('').map(Number)
        });
        if (draws[1]) results.push({
            date,
            time: 'evening',
            numbers: draws[1].replace(/\D/g, '').split('').map(Number)
        });
    });

    return results.slice(0, 60); // Latest 30 days, both draws per day
}

// Scrape NC Pick 4 results (midday & evening)
export async function scrapeNCPick4Results() {
    const { data } = await axios.get('https://www.nclottery.com/Pick4');
    const $ = load(data);

    const results = [];
    $('.results-list .results-row').each((i, el) => {
        const date = $(el).find('.date').text().trim();
        const draws = $(el).find('.draw-result').map((_, d) => $(d).text().trim()).get();

        // Midday and evening draws
        if (draws[0]) results.push({
            date,
            time: 'midday',
            numbers: draws[0].replace(/\D/g, '').split('').map(Number)
        });
        if (draws[1]) results.push({
            date,
            time: 'evening',
            numbers: draws[1].replace(/\D/g, '').split('').map(Number)
        });
    });

    return results.slice(0, 60);
}
