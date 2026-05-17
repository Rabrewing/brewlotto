import { LegalContentPage } from '../legal-content';

export default function TermsPage() {
  return (
    <LegalContentPage
      title="Terms of Use"
      eyebrow="Policy draft"
      summary="The BrewLotto terms define how the service works and what users are responsible for."
      supportSubject="Terms of Use question"
      sections={[
        {
          title: 'Service scope',
          body: 'BrewLotto provides saved-pick management, results matching, strategy insights, and education. It does not sell guaranteed wins, certify lottery outcomes, or replace the official lottery operator rules.',
          bullets: [
            'Users remain responsible for every play decision they make.',
            'NC and CA game behavior follows the relevant lottery operators and state rules.',
            'Saved hits, confirmed plays, and settlements are separate concepts inside the app.',
          ],
        },
        {
          title: 'Accounts and access',
          body: 'Users are responsible for keeping login credentials secure, maintaining accurate account data, and using the service within the allowed age and jurisdiction rules. BrewLotto may limit access if a feature, state, or account condition makes that necessary.',
          bullets: [
            'Do not share your account or session with unauthorized users.',
            'Do not use the service to mislead, spam, scrape, or reverse engineer the app.',
            'Access can be limited, paused, or revoked if abuse or policy violations occur.',
          ],
        },
        {
          title: 'Liability and disputes',
          body: 'The app is provided as an informational and account-management service. Final liability limits, dispute language, and venue provisions belong in the published legal version after counsel review.',
        },
      ]}
      footerNote="Draft only. Final legal language should be reviewed before public launch."
    />
  );
}
