import OpenAI from "openai";

export type AiProviderName = "openai" | "deepseek" | "nim";

export interface AiRuntimeConfig {
    provider: AiProviderName;
    model: string;
    client: OpenAI;
}

function normalizeProvider(value: string | undefined | null): "auto" | AiProviderName {
    const normalized = (value || "auto").trim().toLowerCase();

    if (normalized === "openai" || normalized === "deepseek") {
        return normalized;
    }

    return "auto";
}

export function getAiRuntimeConfig(): AiRuntimeConfig | null {
    const providerSetting = normalizeProvider(process.env.AI_PROVIDER);
    const openaiKey = process.env.OPENAI_API_KEY?.trim();
    const deepseekKey = process.env.DEEPSEEK_API_KEY?.trim();
    const nimKey = process.env.NIM_API_KEY?.trim();

    const getDeepSeekConfig = (): AiRuntimeConfig | null => {
        if (!deepseekKey) {
            return null;
        }

        return {
            provider: "deepseek",
            model: process.env.DEEPSEEK_MODEL?.trim() || "deepseek-v4-flash",
            client: new OpenAI({
                apiKey: deepseekKey,
                baseURL: "https://api.deepseek.com",
            }),
        };
    };

    const getOpenAIConfig = (): AiRuntimeConfig | null => {
        if (!openaiKey) {
            return null;
        }

        return {
            provider: "openai",
            model: process.env.OPENAI_MODEL?.trim() || "gpt-5.4-mini",
            client: new OpenAI({ apiKey: openaiKey }),
        };
    };

    const getNimConfig = (): AiRuntimeConfig | null => {
        if (!nimKey) {
            return null;
        }

        return {
            provider: "nim",
            model: process.env.NIM_MODEL?.trim() || "meta/llama-3.1-70b-instruct",
            client: new OpenAI({
                apiKey: nimKey,
                baseURL: process.env.NIM_BASE_URL?.trim() || "https://integrate.api.nvidia.com/v1",
            }),
        };
    };

    if (providerSetting === "deepseek") {
        return getDeepSeekConfig();
    }

    if (providerSetting === "openai") {
        return getOpenAIConfig();
    }

    if (providerSetting === "nim") {
        return getNimConfig();
    }

    return getDeepSeekConfig() || getOpenAIConfig() || getNimConfig();
}
