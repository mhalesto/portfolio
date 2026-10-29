import { Link } from 'react-router-dom';
import { Page, SkystrideNav, content, supportEmail } from './shared';

export default function SkystrideIOS() {
  return <Page>
    <section className="ss-hero">
      <div>
        <p className="ss-eyebrow">Skystride · A fantasy runner for iPhone</p>
        <h1>{content.tagline}</h1>
        <p className="ss-lede">{content.intro}</p>
        <p className="ss-status">{content.status}</p>
        <SkystrideNav project={false} />
      </div>
      <div className="ss-visual"><img className="ss-icon" src={`${process.env.PUBLIC_URL}/skystride-ios.png`} width="1024" height="1024" alt="Skystride app icon: Ryder above a city in the clouds" /></div>
    </section>
    <section className="ss-features" aria-label="Game features">
      {content.features.map(([number, title, copy]) => <article className="ss-card" key={number}>
        <span className="ss-number">{number}</span><h2>{title}</h2><p>{copy}</p>
      </article>)}
    </section>
    <section className="ss-note">
      <h2>Your journey stays with you.</h2>
      <p>Play on iPhone with iOS 17 or later. Core play works offline and progress is saved on your device. Game Center adds online leaderboards and achievements when you sign in; it does not back up your local save.</p>
      <p>No ads. No in-app purchases. No separate Skystride account required.</p>
    </section>
    <div className="ss-actions ss-bottom"><Link className="ss-button" to="/projects">All projects</Link><a className="ss-button ss-primary" href={supportEmail}>Email support</a></div>
  </Page>;
}
