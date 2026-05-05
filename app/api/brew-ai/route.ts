import { NextResponse } from 'next/server';
import { getAiRuntimeConfig } from "@/lib/ai/client";
import { estimateAiUsageCostUsd, recordAiUsageEvent } from '@/lib/ai/usage';

// 🔧 Shell command simulation logic
function simulateShellCommand(cmd: string): string {
    switch (true) {
        case /git\s+diff/.test(cmd):
            return `> git diff\n\n- removed: console.log('debug')\n+ added: logger.debug('Brew engaged');`;
        case /npm\s+install/.test(cmd):
            return `> npm install\n\n📦 Installing dependencies...\n✔ lodash@4.17.21\n✔ tailwindcss@3.4.0`;
        case /ls/.test(cmd):
            return `> ls\n\ncomponents/\nlib/\npages/\npublic/`;
        case /npm\s+audit/.test(cmd):
            return `> npm audit\n\n6 vulnerabilities found\nRun \`npm audit fix\` to address.`;
        default:
            return `> ${cmd}\n\n🧠 Brew shell ran: "${cmd}" (output stubbed)`;
    }
}

export async function POST(req: Request) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
    }

    const {
        messages = [],
        context = {},
        systemPrompt = null
    } = await req.json();

    const lastMessage = messages.at(-1)?.content || "No input.";
    const mode = context.mode || "dev";

    // 🔧 Shell command simulation mode
    if (mode === "shell" || /git|npm|yarn|ls|cd|touch|rm/.test(lastMessage)) {
        const command = lastMessage.trim();
        const shellReply = simulateShellCommand(command);
        return NextResponse.json({ reply: shellReply }, { status: 200 });
    }

    // 🧠 GPT response
    try {
        const ai = getAiRuntimeConfig();
        if (!ai) {
            return NextResponse.json(
                {
                    reply:
                        "Brew is not configured yet because no AI provider credentials are available.",
                },
                { status: 500 }
            );
        }

        const startedAt = Date.now();
        const completion = await ai.client.chat.completions.create({
            model: ai.model,
            temperature: 0.7,
            messages: [
                ...(systemPrompt
                    ? [{ role: "system", content: systemPrompt }]
                    : [
                        {
                            role: "system",
                            content:
                                "You are Brew, a helpful and emotionally intelligent dev assistant."
                        }
                    ]),
                ...messages
            ] as any // Type assertion for messages array
        });

        const reply =
            completion.choices?.[0]?.message?.content?.trim() || "(no reply)";

        const usageSnapshot = estimateAiUsageCostUsd(ai.provider, ai.model, completion.usage);
        void recordAiUsageEvent({
            route: '/api/brew-ai',
            operation: 'chat_completion',
            provider: ai.provider,
            model: ai.model,
            status: 'success',
            latencyMs: Date.now() - startedAt,
            inputTokens: usageSnapshot.inputTokens,
            outputTokens: usageSnapshot.outputTokens,
            totalTokens: usageSnapshot.totalTokens,
            estimatedCostUsd: usageSnapshot.estimatedCostUsd,
            metadata: {
                mode,
                messageCount: messages.length,
                systemPromptProvided: Boolean(systemPrompt),
            },
        }).catch((logError) => {
            console.error('AI usage log error:', logError);
        });

        return NextResponse.json({ reply, provider: ai.provider }, { status: 200 });
    } catch (error) {
        console.error("🔴 AI Error:", error);

        const ai = getAiRuntimeConfig();
        if (ai) {
            void recordAiUsageEvent({
                route: '/api/brew-ai',
                operation: 'chat_completion',
                provider: ai.provider,
                model: ai.model,
                status: 'error',
                errorMessage: error instanceof Error ? error.message : 'Unknown AI error',
                metadata: {
                    mode,
                    messageCount: messages.length,
                    systemPromptProvided: Boolean(systemPrompt),
                },
            }).catch((logError) => {
                console.error('AI usage log error:', logError);
            });
        }

        return NextResponse.json({ reply: "Brew encountered an error connecting to the AI core." }, { status: 500 });
    }
}
