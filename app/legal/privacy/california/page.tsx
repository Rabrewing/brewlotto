import { LegalContentPage } from '../../legal-content';

export default function CaliforniaPrivacyPage() {
  return (
    <LegalContentPage
      title="California Privacy Notice"
      eyebrow="Policy addendum"
      summary="California residents get a separate notice that explains privacy rights and the request path in plain language."
      supportSubject="California privacy request"
      sections={[
        {
          title: 'California rights',
          body: 'This notice explains the right to know, delete, and correct personal information, plus any opt-out or limitation language that applies to the published product posture.',
          bullets: [
            'Say what data categories BrewLotto collects.',
            'Say why those categories are collected.',
            'Say how a California resident can submit a request.',
          ],
        },
        {
          title: 'Request path',
          body: 'Until a dedicated privacy form exists, California requests route through Support with a clear category and subject so BrewCommand can triage them quickly.',
          bullets: [
            'Use the Support shortcut from this page when filing a request.',
            'Keep the response window and exception language clear.',
            'Link back to the main Privacy Policy and the Legal index.',
          ],
        },
        {
          title: 'Publication note',
          body: 'This page is the California-specific supplement for the BrewLotto legal stack. It should be reviewed with counsel before public launch and then linked from the main Privacy Policy and Legal hub.',
        },
      ]}
      footerNote="Draft only. Final California-specific wording should be reviewed before launch."
    />
  );
}
