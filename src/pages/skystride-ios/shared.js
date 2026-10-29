import { Link } from 'react-router-dom';
import Layout from '../../components/layout';
import content from './content.json';
import './skystride.css';

export { content };
export const base = '/projects/skystride-ios';
export const supportEmail = `mailto:${content.email}?subject=Skystride%20Support`;

export function SkystrideNav({ project = true }) {
  return <nav className="ss-actions" aria-label="Skystride information">
    <Link className="ss-button" to={`${base}/privacy`}>Privacy Policy</Link>
    <Link className="ss-button" to={`${base}/data-collection`}>Data Collection</Link>
    <Link className="ss-button" to={`${base}/support`}>Support</Link>
    {project && <Link className="ss-button" to={base}>Back to Skystride</Link>}
  </nav>;
}

export function Page({ children }) {
  return <Layout><main className="skystride-page">{children}</main></Layout>;
}

export function PolicyPage({ title, children }) {
  return <Page><article className="ss-policy">
    <p className="ss-eyebrow">Skystride for iPhone · CurrentTech</p>
    <h1>{title}</h1>
    <p className="ss-date">Effective {content.effectiveDate}</p>
    {children}
    <SkystrideNav />
  </article></Page>;
}
