import { LegalContentPage } from '../legal-content';

export default function AiUsagePage() {
  return (
    <LegalContentPage
      title="AI Usage Disclosure"
      eyebrow="Policy draft"
      summary="Brew AI helps explain patterns, but it is not a source of official truth."
      supportSubject="AI usage disclosure question"
      sections={[
        {
          title: 'What Brew AI does',
          body: 'Brew AI can summarize patterns, explain strategy behavior, and help users understand timing or result context. It may also help power admin workflows and support triage.',
        },
        {
          title: 'What Brew AI does not do',
          body: 'It does not guarantee results, certify winnings, or override official draw data. Saved plays, play logs, and official results remain the source of truth.',
          bullets: [
            'AI output must be labeled as generated commentary.',
            'Users should never treat AI output as a guarantee of a win.',
            'Tiering may limit AI usage or the amount of AI detail shown.',
          ],
        },
        {
          title: 'Logging and transparency',
          body: 'If AI usage is logged, the policy should say what is captured, why it is captured, and whether it is used for cost accounting, safety, product improvement, or both.',
        },
      ]}
      footerNote="Draft only. The final disclosure should match the actual AI providers and product behavior at launch."
    />
  );
}
