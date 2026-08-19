import { Link } from "react-router-dom";
import Layout from "../../components/layout";
import content from "./content.json";

const SmartCleanerIOS = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <section className="relative overflow-hidden rounded-[2.25rem] bg-[#040a12] text-white shadow-2xl">
          <div className="absolute -right-24 -top-36 h-96 w-96 rounded-full bg-[#0a85ff] opacity-25 blur-3xl" />
          <div className="grid grid-cols-[1.08fr_.92fr] md:grid-cols-1 gap-10 items-center p-12 md:p-7">
            <div className="relative z-10">
              <p className="text-sm uppercase tracking-[.22em] text-sky-400">On-device iPhone storage cleaner</p>
              <h1 className="mt-4 max-w-2xl font-serif text-6xl md:text-4xl leading-[1.02] tracking-tight">
                Free up space. Keep what matters.
              </h1>
              <p className="mt-6 max-w-xl text-lg md:text-base leading-8 text-slate-300">
                Smart Cleaner shows you exactly what is filling your iPhone, then gets the space back by
                compressing your media rather than deleting it. Every figure it prints is one it measured
                and can act on.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link to="/projects/smartcleaner-ios/privacy" className="rounded-full bg-[#0a85ff] px-6 py-3 font-semibold hover:bg-sky-500">Privacy Policy</Link>
                <Link to="/projects/smartcleaner-ios/support" className="rounded-full border border-white/40 px-6 py-3 font-semibold hover:bg-white hover:text-[#040a12]">Support</Link>
                <Link to="/projects/smartcleaner-ios/data-collection" className="rounded-full border border-white/40 px-6 py-3 font-semibold hover:bg-white hover:text-[#040a12]">Data Collection</Link>
              </div>
            </div>
            <div className="relative flex justify-center md:order-first">
              <div className="absolute inset-10 rounded-full bg-sky-500/25 blur-3xl" />
              <img src={`${process.env.PUBLIC_URL}/smartcleaner-ios.png`} alt="Smart Cleaner app icon" className="relative w-72 md:w-52 rounded-[3rem] shadow-[0_30px_90px_rgba(0,0,0,.55)]" />
            </div>
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white p-5 shadow-xl">
          <img src={`${process.env.PUBLIC_URL}/smartcleaner-home.png`} alt="Smart Cleaner storage forecast, dashboard, and bulk cleanup screens" className="mx-auto w-full max-w-5xl rounded-[1.6rem]" />
        </section>

        <section className="grid grid-cols-3 md:grid-cols-1 gap-6 mt-10">
          {content.features.map(([number, title, copy]) => (
            <article key={number} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl">
              <span className="font-mono text-sm font-bold text-[#0a85ff]">{number}</span>
              <h2 className="mt-8 text-2xl font-bold text-[#040a12]">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{copy}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid grid-cols-[1.15fr_.85fr] md:grid-cols-1 gap-6">
          <article className="rounded-3xl bg-[#eef4fb] p-9 md:p-7">
            <p className="text-sm font-bold uppercase tracking-widest text-[#0a6fd1]">Privacy by construction</p>
            <h2 className="mt-3 font-serif text-4xl md:text-3xl text-[#040a12]">Nothing leaves the phone.</h2>
            <ul className="mt-6 space-y-3 text-slate-700">{content.privacyBullets.map(item => <li key={item}>• {item}</li>)}</ul>
          </article>
          <article className="rounded-3xl bg-[#0a85ff] p-9 md:p-7 text-white">
            <p className="text-sm font-bold uppercase tracking-widest text-sky-100">Platform</p>
            <dl className="mt-6 space-y-5">
              <div><dt className="text-sm text-sky-100">Devices</dt><dd className="text-xl font-semibold">iPhone, iOS 17 and later</dd></div>
              <div><dt className="text-sm text-sky-100">Core operation</dt><dd className="text-xl font-semibold">Fully on device</dd></div>
              <div><dt className="text-sm text-sky-100">Cloud</dt><dd className="text-xl font-semibold">None — no server, no account</dd></div>
              <div><dt className="text-sm text-sky-100">Payments</dt><dd className="text-xl font-semibold">Apple StoreKit</dd></div>
            </dl>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-9 md:p-7 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[#0a6fd1]">What it will never claim</p>
          <h2 className="mt-3 font-serif text-4xl md:text-3xl text-[#040a12]">No junk files. No RAM boost.</h2>
          <p className="mt-4 leading-7 text-slate-600 max-w-3xl">
            iOS gives no third-party app access to system caches, junk files, memory, or battery behaviour.
            Smart Cleaner does not pretend otherwise. It names the part of your storage that no app can clean
            rather than quietly attributing all of it to photos.
          </p>
        </section>

        <div className="flex flex-wrap gap-4 mt-10">
          <Link to="/projects" className="border-2 border-theme text-theme px-5 py-2 rounded-full hover:bg-theme hover:text-white">Back to Projects</Link>
          <a href="mailto:support@currenttech.app?subject=Smart%20Cleaner%20Support" className="border-2 border-theme text-theme px-5 py-2 rounded-full hover:bg-theme hover:text-white">Email Support</a>
        </div>
      </div>
    </Layout>
  );
};

export default SmartCleanerIOS;
