import { NextResponse } from 'next/server';
import OpenAI from "openai";

function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  return new OpenAI({ apiKey });
}

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
        const openai = getOpenAI();
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
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
        return NextResponse.json({ reply }, { status: 200 });
    } catch (error) {
        console.error("🔴 OpenAI Error:", error);
        return NextResponse.json({ reply: "Brew encountered an error connecting to the AI core." }, { status: 500 });
    }
}
