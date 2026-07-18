import { Link } from "react-router-dom";
import Layout from "../../components/layout";
import content from "./content.json";

const ResumeStudioIOSDataCollection = () => (
  <Layout>
    <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
      <article className="mx-auto max-w-4xl bg-white shadow-2xl rounded-3xl p-10 md:p-6">
        <p className="text-sm uppercase tracking-widest text-gray-500">ResumeStudio for iPhone and iPad</p>
        <h1 className="text-4xl md:text-3xl font-bold text-theme mt-2">Data Collection</h1>
        <p className="mt-4 text-lg leading-8">ResumeStudio keeps the core career workspace local and makes every external processing path explicit.</p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-1 gap-6">
          {content.dataCards.map(card => <section key={card.title} className="rounded-2xl bg-slate-50 p-6"><h2 className="text-xl font-semibold text-theme">{card.title}</h2><ul className="list-disc ml-6 mt-3 space-y-2">{card.items.map(item => <li key={item}>{item}</li>)}</ul></section>)}
        </div>
        <section className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-6"><h2 className="text-xl font-semibold text-theme">Optional product measurement</h2><p className="mt-2 leading-7">{content.measurement}</p></section>
        <section className="mt-6"><h2 className="text-xl font-semibold text-theme">Your controls</h2><p className="mt-2 leading-7">Privacy Centre can pause AI, exclude verified evidence, inspect and clear processing history, export career intelligence, and erase it. Account and backup settings separately manage local data, iCloud data, and server-account deletion.</p></section>
        <div className="flex flex-wrap gap-4 mt-10"><Link to="/projects/resumestudio-ios/privacy" className="border-2 border-theme text-theme px-5 py-2 rounded-full">Privacy Policy</Link><Link to="/projects/resumestudio-ios/support" className="border-2 border-theme text-theme px-5 py-2 rounded-full">Support</Link><Link to="/projects/resumestudio-ios" className="border-2 border-theme text-theme px-5 py-2 rounded-full">Back to Project</Link></div>
      </article>
    </div>
  </Layout>
);

export default ResumeStudioIOSDataCollection;
