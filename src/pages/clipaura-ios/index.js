import { Link } from "react-router-dom";
import Layout from "../../components/layout";
import content from "./content.json";

const ClipAuraIOS = () => (
  <Layout>
    <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-[#03030d] text-white shadow-2xl">
        <div className="absolute -left-28 -top-36 h-96 w-96 rounded-full bg-[#8a16ff] opacity-30 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#12dff2] opacity-25 blur-3xl" />
        <div className="grid grid-cols-[1.08fr_.92fr] md:grid-cols-1 gap-10 items-center p-12 md:p-7">
          <div className="relative z-10">
            <p className="text-sm uppercase tracking-[.22em] text-cyan-300">Creative iOS video studio</p>
            <h1 className="mt-4 max-w-2xl font-serif text-6xl md:text-4xl leading-[1.02] tracking-tight">
              Make videos people stop for.
            </h1>
            <p className="mt-6 max-w-xl text-lg md:text-base leading-8 text-slate-300">
              Smart templates, AI effects, beat-synced editing, captions, Brand Kits, and polished export in one focused creative flow.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/projects/clipaura-ios/privacy" className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-6 py-3 font-semibold hover:brightness-110">Privacy Policy</Link>
              <Link to="/projects/clipaura-ios/support" className="rounded-full border border-white/40 px-6 py-3 font-semibold hover:bg-white hover:text-[#03030d]">Support</Link>
              <Link to="/projects/clipaura-ios/data-collection" className="rounded-full border border-white/40 px-6 py-3 font-semibold hover:bg-white hover:text-[#03030d]">Data Collection</Link>
              <Link to="/projects/clipaura-ios/terms" className="rounded-full border border-white/40 px-6 py-3 font-semibold hover:bg-white hover:text-[#03030d]">Terms</Link>
            </div>
          </div>
          <div className="relative flex justify-center md:order-first">
            <div className="absolute inset-10 rounded-full bg-violet-500/30 blur-3xl" />
            <img src={`${process.env.PUBLIC_URL}/clipaura-ios.png`} alt="ClipAura app icon" className="relative w-72 md:w-52 rounded-[3rem] shadow-[0_30px_90px_rgba(0,0,0,.7)]" />
          </div>
        </div>
      </section>

      <section className="mt-10 overflow-hidden rounded-[2.25rem] border border-slate-200 bg-[#080815] p-5 shadow-xl">
        <img src={`${process.env.PUBLIC_URL}/clipaura-home.jpg`} alt="ClipAura App Store screenshot campaign" className="mx-auto w-full max-w-5xl rounded-[1.6rem]" />
      </section>

      <section className="grid grid-cols-3 md:grid-cols-1 gap-6 mt-10">
        {content.features.map(([number, title, copy]) => (
          <article key={number} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl">
            <span className="font-mono text-sm font-bold text-violet-600">{number}</span>
            <h2 className="mt-8 text-2xl font-bold text-[#090916]">{title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{copy}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid grid-cols-[1.15fr_.85fr] md:grid-cols-1 gap-6">
        <article className="rounded-3xl bg-[#f4efff] p-9 md:p-7">
          <p className="text-sm font-bold uppercase tracking-widest text-violet-700">Privacy with a clear boundary</p>
          <h2 className="mt-3 font-serif text-4xl md:text-3xl text-[#090916]">Local by default. Shared only when you choose.</h2>
          <ul className="mt-6 space-y-3 text-slate-700">{content.privacyBullets.map(item => <li key={item}>• {item}</li>)}</ul>
        </article>
        <article className="rounded-3xl bg-gradient-to-br from-violet-700 to-cyan-500 p-9 md:p-7 text-white">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-100">Platform</p>
          <dl className="mt-6 space-y-5">
            <div><dt className="text-sm text-cyan-100">Devices</dt><dd className="text-xl font-semibold">iPhone, iOS 17 and later</dd></div>
            <div><dt className="text-sm text-cyan-100">Editing</dt><dd className="text-xl font-semibold">On device</dd></div>
            <div><dt className="text-sm text-cyan-100">Hosted AI</dt><dd className="text-xl font-semibold">Explicit consent first</dd></div>
            <div><dt className="text-sm text-cyan-100">Payments</dt><dd className="text-xl font-semibold">Apple StoreKit</dd></div>
          </dl>
        </article>
      </section>

      <div className="flex flex-wrap gap-4 mt-10">
        <Link to="/projects" className="border-2 border-theme text-theme px-5 py-2 rounded-full hover:bg-theme hover:text-white">Back to Projects</Link>
        <a href="mailto:currenttech.co.za@gmail.com?subject=ClipAura%20Support" className="border-2 border-theme text-theme px-5 py-2 rounded-full hover:bg-theme hover:text-white">Email Support</a>
      </div>
    </div>
  </Layout>
);

export default ClipAuraIOS;
