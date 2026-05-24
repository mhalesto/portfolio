import { Link } from "react-router-dom";
import Layout from "../../components/layout";

const SoundframeIOSPrivacy = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <p className="text-sm uppercase tracking-widest text-gray-500">SoundFrame iOS</p>
          <h1 className="text-3xl md:text-2xl font-bold text-theme mt-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-2">Last updated: May 24, 2026</p>

          <div className="mt-6 space-y-6">
            <p>
              SoundFrame is a video editing app for building beat-synced edits, captions, and layered
              visual clips on iPhone and iPad. We aim to keep core media editing private and local,
              while supporting optional account, subscription, cloud caption, AI, and advertising
              attribution features.
            </p>
            <div>
              <h2 className="text-xl font-semibold text-theme">Information We Collect</h2>
              <p className="mt-2">
                Depending on the features you use, SoundFrame may process app or user identifiers,
                device identifiers, subscription or purchase status, product interaction events, and
                media or project content needed to provide editing, caption, account, subscription, AI,
                support, analytics, and advertising measurement features.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">How Media Is Processed</h2>
              <p className="mt-2">
                Videos, photos, audio, captions, and timeline edits are primarily processed on your
                device. Imported media remains under your control unless you choose to export or share it.
                When you use cloud captioning, AI Studio, generated visuals, or similar connected
                features, selected audio, text, prompts, project context, or generated outputs may be
                sent to service providers only to perform the requested feature.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Permissions</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Photos/Media Library: to import media and save exports.</li>
                <li>Speech Recognition: to generate timed captions from audio you choose.</li>
                <li>
                  App Tracking Transparency: to ask before accessing advertising identifiers for
                  advertising attribution and measurement.
                </li>
              </ul>
              <p className="mt-2">
                Permissions are requested only when you use a feature that needs them.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Subscriptions and Payments</h2>
              <p className="mt-2">
                Optional in-app purchases are handled through Apple. We do not receive your full payment
                card details. Apple may provide transaction status needed to unlock subscription features.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Third-Party Services</h2>
              <p className="mt-2">
                SoundFrame may use trusted third-party services for authentication, subscriptions,
                crash diagnostics, cloud features, AI-assisted tools, and advertising attribution.
                These services may process data on our behalf to provide the feature you request or to
                measure app performance and campaign effectiveness.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Advertising Attribution and TikTok SDK</h2>
              <p className="mt-2">
                SoundFrame may use the TikTok Business SDK to measure app installs, sign-ins,
                subscriptions, and selected app events from TikTok advertising campaigns. This helps us
                understand whether TikTok ads are working and improve campaign performance.
              </p>
              <p className="mt-2">
                For this purpose, TikTok and SoundFrame may process identifiers such as device
                advertising identifiers, app or user identifiers, purchase or subscription events, and
                product interaction events. Some of this data may be used for tracking as defined by
                Apple, including advertising measurement across apps and websites owned by other
                companies.
              </p>
              <p className="mt-2">
                On iOS, SoundFrame asks for App Tracking Transparency permission before accessing the
                device advertising identifier. You can allow or deny tracking, and you can change this
                choice later in iOS Settings.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Data Retention</h2>
              <p className="mt-2">
                Your local projects and exported files stay on your device unless you choose to share
                them or use a connected feature. Server-side records, such as account, subscription,
                attribution, support, and cloud feature logs, are retained only as needed to provide the
                service, operate the app, meet legal obligations, and protect against abuse.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Children’s Privacy</h2>
              <p className="mt-2">
                SoundFrame is not directed to children under 13, and we do not knowingly collect personal
                information from children.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Changes to This Policy</h2>
              <p className="mt-2">
                If privacy practices change, this page will be updated before those changes take effect.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Contact</h2>
              <p className="mt-2">
                For privacy questions, contact{" "}
                <a href="mailto:currenttech.co.za@gmail.com" className="text-blue-600 underline">
                  currenttech.co.za@gmail.com
                </a>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/projects/soundframe-ios/data-collection"
              className="border-2 border-theme text-theme px-5 py-2 rounded-full hover:bg-theme hover:text-white"
            >
              Data Collection
            </Link>
            <Link
              to="/projects/soundframe-ios"
              className="border-2 border-theme text-theme px-5 py-2 rounded-full hover:bg-theme hover:text-white"
            >
              Back to Project
            </Link>
            <Link
              to="/contact"
              className="border-2 border-theme text-theme px-5 py-2 rounded-full hover:bg-theme hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SoundframeIOSPrivacy;
