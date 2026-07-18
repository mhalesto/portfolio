import { Link } from "react-router-dom";
import Layout from "../../components/layout";

const ResumeStudioIOSSupport = () => (
  <Layout>
    <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
      <article className="mx-auto max-w-4xl bg-white shadow-2xl rounded-3xl p-10 md:p-6">
        <p className="text-sm uppercase tracking-widest text-gray-500">Official ResumeStudio support</p>
        <h1 className="text-4xl md:text-3xl font-bold text-theme mt-2">How can we help?</h1>
        <p className="mt-4 text-lg leading-8">Get help with documents, accounts, purchases, AI credits, iCloud sync, public CV pages, trackable links, and Review Rooms.</p>
        <a href="mailto:currenttech.co.za@gmail.com?subject=ResumeStudio%20Support" className="mt-7 inline-flex rounded-full bg-[#f05a13] px-6 py-3 font-semibold text-white hover:bg-orange-600">Email currenttech.co.za@gmail.com</a>
        <p className="mt-3 text-sm text-slate-500">Include your device model, iOS version, ResumeStudio version, and the steps that caused the problem. Never send passwords, access codes, or payment-card details.</p>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-1 gap-6">
          <section className="rounded-2xl bg-slate-50 p-6"><h2 className="text-xl font-semibold text-theme">Account and data</h2><p className="mt-2 leading-7">Use Settings → Account and backup to reset a password or separately delete server, local, and iCloud data. Account deletion does not cancel an App Store subscription.</p></section>
          <section className="rounded-2xl bg-slate-50 p-6"><h2 className="text-xl font-semibold text-theme">Plans and purchases</h2><p className="mt-2 leading-7">Use Settings → Plans and purchases to restore purchases. Manage or cancel subscriptions through your Apple Account subscription settings.</p></section>
          <section className="rounded-2xl bg-slate-50 p-6"><h2 className="text-xl font-semibold text-theme">Offline access</h2><p className="mt-2 leading-7">Editing, preview, export, applications, saved interview work, OCR, and eligible on-device AI remain available offline. Connected AI and hosted features require a connection.</p></section>
          <section className="rounded-2xl bg-slate-50 p-6"><h2 className="text-xl font-semibold text-theme">Privacy and hosted links</h2><p className="mt-2 leading-7">Privacy Centre controls AI and history. CV pages, résumé links, and Review Rooms can be withdrawn, revoked, or deleted from their management screens.</p></section>
        </div>
        <div className="flex flex-wrap gap-4 mt-10"><Link to="/projects/resumestudio-ios/privacy" className="border-2 border-theme text-theme px-5 py-2 rounded-full">Privacy Policy</Link><Link to="/projects/resumestudio-ios/data-collection" className="border-2 border-theme text-theme px-5 py-2 rounded-full">Data Collection</Link><Link to="/projects/resumestudio-ios" className="border-2 border-theme text-theme px-5 py-2 rounded-full">Back to Project</Link></div>
      </article>
    </div>
  </Layout>
);

export default ResumeStudioIOSSupport;
