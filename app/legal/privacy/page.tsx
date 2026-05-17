import Link from 'next/link';

import { LegalContentPage } from '../legal-content';

export default function PrivacyPage() {
  return (
    <LegalContentPage
      title="Privacy Policy"
      eyebrow="Policy draft"
      summary="BrewLotto’s privacy policy explains what we collect, why we collect it, and how users can ask for changes."
      supportSubject="Privacy policy question"
      sections={[
        {
          title: 'What we collect',
          body: 'The app may collect account email, profile details, preferences, saved picks, play confirmations, support requests, screenshots, billing state, and product telemetry or AI usage logs when enabled.',
          bullets: [
            'Only collect what is needed to run the product and support the user.',
            'Explain whether each data type is required or optional.',
            'Be explicit about vendor involvement for email, hosting, billing, and AI services.',
          ],
        },
        {
          title: 'How we use data',
          body: 'We use that data to run login, saved picks, results matching, support handling, notifications, billing, and analytics. The published policy should state retention periods and the purpose for each class of data.',
        },
        {
          title: 'Sharing and retention',
          body: 'The final policy should explain which vendors help host, email, store, or process data, and how long different records are kept before deletion or archiving.',
          bullets: [
            'Call out the vendors that are part of the app’s normal operation.',
            'Explain which records are tied to accounts, support, or billing.',
            'Make the retention story easy to find and easy to understand.',
          ],
        },
        {
          title: 'How users can ask for help',
          body: 'Users can request access, correction, deletion, or privacy help through Support or a dedicated contact path. The final policy should name the exact request method and expected response window.',
          bullets: [
            'Use Support for privacy questions until a dedicated request form exists.',
            'Send California-specific questions to the California notice route.',
          ],
        },
        {
          title: 'California Privacy Addendum',
          body: 'California-specific privacy rights and request language live on their own route so the main privacy policy can stay focused on the general policy terms.',
          bullets: [
            'Keep the main policy general and easy to read.',
            'Send California residents to the dedicated addendum.',
            'Use Support as the request path until a dedicated form exists.',
          ],
        },
      ]}
      footerNote={
        <div className="flex flex-col gap-2">
          <div>Draft only. Final privacy wording should be reviewed before launch and aligned with the actual vendor stack.</div>
          <div>
            California residents can open the dedicated addendum here:{' '}
            <Link href="/legal/privacy/california" className="text-[#9edcff] underline decoration-[#9edcff]/40 underline-offset-4 hover:text-white">
              California Privacy Notice
            </Link>
          </div>
        </div>
      }
    />
  );
}
