# BrewLotto AI Gemini Context

This document provides context for the BrewLotto AI project, a predictive analytics platform for lottery games.

## Project Overview

BrewLotto AI is a Next.js application that uses statistical modeling and AI-enhanced strategies to generate smart picks for various lottery games. It features a dashboard for tracking predictions and historical trends, and it uses Supabase for its database and authentication.

The application is designed with a modular architecture, with a clear separation between the frontend, backend, and prediction logic. The frontend is built with Next.js, Tailwind CSS, and Recharts, while the backend is powered by Supabase and Node.js.

## Building and Running

To build and run the project, use the following commands:

*   **Install dependencies:** `npm install`
*   **Run the development server:** `npm run dev`
*   **Build the project:** `npm run build`
*   **Start the production server:** `npm run start`
*   **Lint the project:** `npm run lint`

## Development Conventions

The project follows a set of development conventions to ensure code quality and consistency. These include:

*   **Coding Style:** The project uses ESLint to enforce a consistent coding style.
*   **Testing:** The `README.md` mentions testing, but no specific testing framework is configured in `package.json`.
*   **Contribution Guidelines:** The `README.md` outlines a feature lifecycle that includes planning, drafting, reviewing, deploying, and documenting changes.

## Data Pipeline

The project has a well-defined data pipeline for ingesting, validating, and analyzing lottery data. The pipeline consists of the following steps:

1.  **Data Ingestion:** Node.js scripts using `axios` and `cheerio` scrape data from lottery websites.
2.  **Data Storage:** The scraped data is stored in a Supabase PostgreSQL database.
3.  **Data Validation:** The data is validated to ensure its accuracy and integrity.
4.  **Data Analysis:** The data is analyzed using various prediction strategies, such as Poisson, Markov, and Bayesian analysis.
5.  **API Endpoints:** API endpoints provide access to the prediction results and statistical data.

## Key Files

*   `README.md`: Provides a high-level overview of the project.
*   `package.json`: Lists the project's dependencies and scripts.
*   `next.config.ts`: Configuration file for the Next.js application.
*   `tailwind.config.cjs`: Configuration file for Tailwind CSS.
*   `docs/data-pipeline-manual.md`: Provides a detailed explanation of the data pipeline.
*   `scripts/scrapeNC_Pick3.js`: An example of a scraper script for ingesting lottery data.
*   `strategies/SmartPickRefactor.js`: A central point for applying different prediction strategies.
