import { PolicyPage, content } from './shared';

export default function SkystrideIOSDataCollection() {
  return <PolicyPage title="Data Collection">
    <p>{content.privacySummary}</p>
    <div className="ss-grid">
      {content.dataCards.map(card => <section className="ss-card" key={card.title}>
        <h2>{card.title}</h2><ul>{card.items.map(item => <li key={item}>{item}</li>)}</ul>
      </section>)}
    </div>
    <section className="ss-section ss-bottom"><h2>Your controls</h2><p>Manage Game Center sign-in and sharing in iPhone Settings. Photo saving is optional and its add-only permission can be changed in Settings. Deleting Skystride removes local progress, so contact support before reinstalling if you are trying to recover a save.</p><p><a href={content.applePrivacyURL}>Apple’s Game Center &amp; Privacy information</a></p></section>
  </PolicyPage>;
}
