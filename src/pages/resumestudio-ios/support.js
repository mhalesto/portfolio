import { Link } from "react-router-dom";
import Layout from "../../components/layout";
import content from "./content.json";

const ResumeStudioIOSSupport = () => (
  <Layout>
    <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
      <article className="mx-auto max-w-4xl bg-white shadow-2xl rounded-3xl p-10 md:p-6">
        <p className="text-sm uppercase tracking-widest text-gray-500">Official ResumeStudio support</p>
        <h1 className="text-4xl md:text-3xl font-bold text-theme mt-2">How can we help?</h1>
        <p className="mt-4 text-lg leading-8">{content.supportIntro}</p>
        <a href="mailto:currenttech.co.za@gmail.com?subject=ResumeStudio%20Support" className="mt-7 inline-flex rounded-full bg-[#f05a13] px-6 py-3 font-semibold text-white hover:bg-orange-600">Email currenttech.co.za@gmail.com</a>
        <p className="mt-3 text-sm text-slate-500">{content.supportDiagnostic}</p>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-1 gap-6">
          {content.supportCards.map(card => <section key={card.title} className="rounded-2xl bg-slate-50 p-6"><h2 className="text-xl font-semibold text-theme">{card.title}</h2><p className="mt-2 leading-7">{card.body}</p></section>)}
        </div>
        <div className="flex flex-wrap gap-4 mt-10"><Link to="/projects/resumestudio-ios/privacy" className="border-2 border-theme text-theme px-5 py-2 rounded-full">Privacy Policy</Link><Link to="/projects/resumestudio-ios/data-collection" className="border-2 border-theme text-theme px-5 py-2 rounded-full">Data Collection</Link><Link to="/projects/resumestudio-ios" className="border-2 border-theme text-theme px-5 py-2 rounded-full">Back to Project</Link></div>
      </article>
    </div>
  </Layout>
);

export default ResumeStudioIOSSupport;
