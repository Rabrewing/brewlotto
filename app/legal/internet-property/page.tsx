import { LegalContentPage } from '../legal-content';

export default function InternetPropertyPage() {
  return (
    <LegalContentPage
      title="Internet Property"
      eyebrow="Policy draft"
      summary="BrewLotto needs a clear policy for brand ownership, content reuse, and uploaded material."
      supportSubject="Internet property question"
      sections={[
        {
          title: 'Brand and site ownership',
          body: 'BrewLotto brand names, logos, UI copy, screenshots, and layout systems should be treated as BrewLotto property unless a third party is explicitly credited.',
          bullets: [
            'Lottery operator names and marks belong to their respective owners.',
            'Do not imply endorsement by NC or CA lottery operators unless expressly granted.',
            'Official draw data should keep source attribution wherever practical.',
          ],
        },
        {
          title: 'User uploads',
          body: 'Support screenshots, QA images, and similar uploads should be licensed only as needed to operate the product, resolve the request, and meet support obligations.',
        },
        {
          title: 'Reuse and scraping',
          body: 'The policy should prohibit unauthorized scraping, mirroring, reverse engineering, or republishing of BrewLotto content and interface assets.',
        },
      ]}
      footerNote="Draft only. Counsel should review any final ownership, reuse, and submission-license wording before launch."
    />
  );
}
