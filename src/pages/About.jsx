import { PublicPageLayout, ContentSections } from '@/components/layout/PublicPageLayout';
import { getLegalContent } from '@/lib/legalContent';
import { useLang, useT } from '@/lib/i18n';

export default function About() {
  const lang = useLang((s) => s.lang);
  const t = useT();
  const c = getLegalContent(lang, 'about');

  return (
    <PublicPageLayout title={c.title} subtitle={c.intro} eyebrow={t('footerCompany')}>
      <ContentSections sections={c.sections} />
    </PublicPageLayout>
  );
}
