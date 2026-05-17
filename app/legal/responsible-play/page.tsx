import { LegalContentPage } from '../legal-content';

export default function ResponsiblePlayPage() {
  return (
    <LegalContentPage
      title="Responsible Play"
      eyebrow="Policy draft"
      summary="BrewLotto keeps the lottery message grounded, honest, and entertainment-first."
      supportSubject="Responsible play question"
      sections={[
        {
          title: 'Core message',
          body: 'Lottery play is entertainment, not a financial plan. The app uses plain language that avoids hype and makes clear that results are never guaranteed.',
          bullets: [
            'Set limits before you play.',
            'Only play what you can afford to lose.',
            'Seek help if play stops feeling fun or starts to feel harmful.',
          ],
        },
        {
          title: 'State references',
          body: 'The final policy links out to responsible-play resources from the relevant NC and CA lottery or state sites so users can find the right help path for their location.',
        },
        {
          title: 'Product language',
          body: 'My Picks, Results, Strategy Locker, and Brew AI stay framed as informational tools. Saved hits, timing hints, and alerts are only support surfaces for the user’s own decisions.',
        },
      ]}
      footerNote="Draft only. The responsible-play wording should be checked against the final launch posture and support resources."
    />
  );
}
