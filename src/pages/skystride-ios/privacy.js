import { PolicyPage, content } from './shared';

export default function SkystrideIOSPrivacy() {
  return <PolicyPage title="Privacy Policy">
    <p>{content.privacySummary}</p>
    {content.privacySections.map(section => <section className="ss-section" key={section.title}>
      <h2>{section.title}</h2>
      {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      {section.link && <p><a href={section.link.href}>{section.link.label}</a></p>}
    </section>)}
  </PolicyPage>;
}
