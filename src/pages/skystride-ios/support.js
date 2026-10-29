import { PolicyPage, content, supportEmail } from './shared';

export default function SkystrideIOSSupport() {
  return <PolicyPage title="Skystride Support">
    <p>{content.supportIntro}</p>
    <a className="ss-button ss-primary" href={supportEmail}>Email {content.email}</a>
    <p className="ss-diagnostic">{content.supportDiagnostic}</p>
    <div className="ss-grid">
      {content.supportCards.map(card => <section className="ss-card" key={card.title}>
        <h2>{card.title}</h2><p>{card.body}</p>
      </section>)}
    </div>
  </PolicyPage>;
}
