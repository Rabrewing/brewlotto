// =============================================
// 📁 File: /lib/server/scanEngine.js
// 🧠 Summary: Executes directory scan + category classification for BrewAudit
// ✨ Enhanced: Phase 5.1 — App-Level Domain Categorization
// =============================================

import fs from "fs";
import path from "path";
import { generateAISummary } from "./summarizeUtils.js";

// 🗂️ Domain tag config (fallback auto-map)
const DOMAIN_MAP = [
    { match: "dashboard", label: "Customer Dashboard" },
    { match: "brew-command", label: "BrewCommand IDE" },
    { match: "brew-vision", label: "BrewVision" },
    { match: "pick3", label: "Pick 3" },
    { match: "pick4", label: "Pick 4" },
    { match: "pick5", label: "Pick 5" },
    { match: "powerball", label: "Powerball" },
    { match: "megamillions", label: "Mega Millions" }
];

// 🧠 Optional: Manual category overrides via .brew-domain-map.json
let manualMap = {};
try {
    const mapPath = path.resolve(process.cwd(), ".brew-domain-map.json");
    manualMap = JSON.parse(fs.readFileSync(mapPath, "utf-8"));
} catch {
    // fallback if file doesn't exist
}

const getDomainTag = (normalizedPath) => {
    // 🔎 Check manual overrides first
    for (const key in manualMap) {
        if (normalizedPath.startsWith(key)) return manualMap[key];
    }
    // 🧠 Fallback to domain heuristics
    const hit = DOMAIN_MAP.find(({ match }) => normalizedPath.includes(match));
    return hit?.label || "Uncategorized";
};

export function getAuditConfig() {
    const defaults = {
        complexityThreshold: 100,
        extensions: [".js", ".jsx"],
        ignoreDirs: ["node_modules", ".next", "dist", "out"],
        refactorMessage: "Complexity exceeds threshold"
    };

    try {
        const configPath = path.resolve(process.cwd(), ".brew-auditrc.json");
        const raw = fs.readFileSync(configPath, "utf-8");
        return { ...defaults, ...JSON.parse(raw) };
    } catch {
        return defaults;
    }
}

const isDeprecated = (filePath) =>
    filePath.includes("archive/") || filePath.includes("old/") || filePath.includes("legacy");

const isUnused = (filePath) =>
    ["PredictionCard.jsx", "DrawEntropyCard.jsx", "BrewLottoBot.jsx"].some((f) =>
        filePath.endsWith(f)
    );

const isActive = (filePath) =>
    ["SmartPickRefactor.js", "DrawDataTriage.js", "BrewMergeUI.jsx"].some((f) =>
        filePath.endsWith(f)
    );

const estimateComplexity = (content) => {
    const lines = content.split("\n").length;
    const nesting = (content.match(/[\{\(]|\b(if|for|while|switch)\b/g) || []).length;
    return lines + nesting;
};

const walkDirectory = (dir, config, collected = []) => {
    const entries = fs.readdirSync(dir);
    for (let entry of entries) {
        const fullPath = path.join(dir, entry);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory() && !config.ignoreDirs.includes(entry)) {
            walkDirectory(fullPath, config, collected);
        } else if (
            stats.isFile() &&
            config.extensions.some((ext) => fullPath.endsWith(ext))
        ) {
            collected.push(fullPath);
        }
    }
    return collected;
};

export function runAuditScan(startDir = "./src") {
    const config = getAuditConfig();
    const absoluteStart = path.resolve(process.cwd(), startDir);
    const allFiles = walkDirectory(absoluteStart, config);

    const deprecated = [];
    const unused = [];
    const active = [];
    const refactor = [];
    const summaries = {};

    allFiles.forEach((filePath) => {
        const content = fs.readFileSync(filePath, "utf-8");
        const normalized = path.relative(process.cwd(), filePath).replace(/\\/g, "/");
        const category = getDomainTag(normalized);

        if (isDeprecated(normalized)) {
            deprecated.push({
                file: normalized,
                category,
                reason: "Deprecated folder",
                status: "Deprecated"
            });
        } else if (isUnused(normalized)) {
            unused.push({
                file: normalized,
                category,
                reason: "Marked unused",
                status: "Unused"
            });
        } else if (isActive(normalized)) {
            active.push({ file: normalized, category });
        }

        const complexity = estimateComplexity(content);
        if (complexity > config.complexityThreshold) {
            refactor.push({
                file: normalized,
                category,
                score: complexity,
                reason: config.refactorMessage,
                status: "Refactor Candidate"
            });
        }

        summaries[normalized] = generateAISummary(content);
    });

    return {
        deprecated_modules: deprecated,
        unused_files: unused,
        active_modules: active,
        refactor_candidates: refactor,
        file_summaries: summaries,
        timestamp: new Date().toISOString()
    };
}