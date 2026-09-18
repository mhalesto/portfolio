import { Link } from "react-router-dom";
import Layout from "../../components/layout";
import content from "./content.json";

const ClipAuraIOSTerms = () => (
  <Layout>
    <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
      <article className="mx-auto max-w-4xl bg-white shadow-2xl rounded-3xl p-10 md:p-6">
        <p className="text-sm uppercase tracking-widest text-gray-500">ClipAura for iPhone</p>
        <h1 className="text-4xl md:text-3xl font-bold text-theme mt-2">Terms of Use</h1>
        <p className="text-sm text-gray-500 mt-2">Effective: {content.effectiveDate}</p>
        <div className="mt-8 space-y-8">
          {content.termsSections.map(section => <section key={section.title}><h2 className="text-xl font-semibold text-theme">{section.title}</h2><div className="mt-2 space-y-3 text-slate-700 leading-7">{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></section>)}
          <section><h2 className="text-xl font-semibold text-theme">Apple Standard EULA</h2><p className="mt-2 text-slate-700 leading-7"><a className="underline" href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">Read Apple's Standard End User License Agreement</a>.</p></section>
        </div>
        <div className="flex flex-wrap gap-4 mt-10"><Link to="/projects/clipaura-ios/privacy" className="border-2 border-theme text-theme px-5 py-2 rounded-full">Privacy Policy</Link><Link to="/projects/clipaura-ios/support" className="border-2 border-theme text-theme px-5 py-2 rounded-full">Support</Link><Link to="/projects/clipaura-ios" className="border-2 border-theme text-theme px-5 py-2 rounded-full">Back to Project</Link></div>
      </article>
    </div>
  </Layout>
);

export default ClipAuraIOSTerms;
