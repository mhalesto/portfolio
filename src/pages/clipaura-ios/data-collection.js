import { Link } from "react-router-dom";
import Layout from "../../components/layout";
import content from "./content.json";

const ClipAuraIOSDataCollection = () => (
  <Layout>
    <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
      <article className="mx-auto max-w-5xl bg-white shadow-2xl rounded-3xl p-10 md:p-6">
        <p className="text-sm uppercase tracking-widest text-gray-500">ClipAura for iPhone</p>
        <h1 className="text-4xl md:text-3xl font-bold text-theme mt-2">Data Collection</h1>
        <p className="mt-4 text-lg leading-8">{content.summary}</p>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-1 gap-6">
          {content.dataCards.map(card => <section key={card.title} className="rounded-2xl bg-slate-50 p-6"><h2 className="text-xl font-semibold text-theme">{card.title}</h2><ul className="mt-3 space-y-2 text-slate-700">{card.items.map(item => <li key={item}>• {item}</li>)}</ul></section>)}
        </div>
        <section className="mt-8 rounded-2xl bg-[#f4efff] p-6"><h2 className="text-xl font-semibold text-theme">Service measurement</h2><p className="mt-2 leading-7 text-slate-700">{content.measurement}</p></section>
        <div className="flex flex-wrap gap-4 mt-10"><Link to="/projects/clipaura-ios/privacy" className="border-2 border-theme text-theme px-5 py-2 rounded-full">Privacy Policy</Link><Link to="/projects/clipaura-ios/support" className="border-2 border-theme text-theme px-5 py-2 rounded-full">Support</Link><Link to="/projects/clipaura-ios/terms" className="border-2 border-theme text-theme px-5 py-2 rounded-full">Terms</Link><Link to="/projects/clipaura-ios" className="border-2 border-theme text-theme px-5 py-2 rounded-full">Back to Project</Link></div>
      </article>
    </div>
  </Layout>
);

export default ClipAuraIOSDataCollection;
