// @pages/api/brew-ai.js
// Summary: Brew AI backend with OpenAI support + tool simulation fallback
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const {
        messages = [],
        context = {},
        systemPrompt = null,
        fileEditing = false
    } = req.body;

    const lastMessage = messages.at(-1)?.content || "No input.";
    const mode = context.mode || "dev";

    // 🔧 Shell command simulation mode
    if (mode === "shell" || /git|npm|yarn|ls|cd|touch|rm/.test(lastMessage)) {
        const command = lastMessage.trim();
        const shellReply = simulateShellCommand(command);
        return res.status(200).json({ reply: shellReply });
    }

    // 🧠 GPT response
    try {
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
            ]
        });

        const reply =
            completion.choices?.[0]?.message?.content?.trim() || "(no reply)";
        return res.status(200).json({ reply });
    } catch (error) {
        console.error("🔴 OpenAI Error:", error);
        return res
            .status(500)
            .json({ reply: "Brew encountered an error connecting to the AI core." });
    }
}

// 🔧 Shell command simulation logic
function simulateShellCommand(cmd) {
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