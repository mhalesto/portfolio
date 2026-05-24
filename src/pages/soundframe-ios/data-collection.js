import { Link } from "react-router-dom";
import Layout from "../../components/layout";

const SoundframeIOSDataCollection = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <p className="text-sm uppercase tracking-widest text-gray-500">SoundFrame iOS</p>
          <h1 className="text-3xl md:text-2xl font-bold text-theme mt-2">Data Collection</h1>
          <p className="mt-4 text-lg md:text-base">
            SoundFrame is designed so core editing workflows can run on device, while optional account,
            subscription, cloud caption, AI, and advertising attribution features may collect the data
            needed to provide, secure, measure, and improve those services.
          </p>
          <div className="mt-4 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-theme">What We Do Not Collect</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Payment card numbers or full payment credentials</li>
                <li>Precise location, contacts, or health data</li>
                <li>Passwords for Apple, Google, or App Store accounts</li>
                <li>Sale of personal data to data brokers</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Media and Project Data</h2>
              <p className="mt-2">
                Videos, images, audio, captions, and timeline edits are processed on device for editing
                and export. Imported media stays local unless you choose to share or export it elsewhere.
                If you use cloud captions, AI Studio, generated images, or related connected features,
                selected audio, text, prompts, project context, or generated outputs may be sent to
                service providers to complete that request.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Identifiers and App Events</h2>
              <p className="mt-2">
                SoundFrame may process user identifiers, device identifiers, subscription status,
                purchase history, and product interaction events such as app launches, registration,
                login, tutorial completion, and subscription activity. These records help unlock
                features, prevent fraud, provide support, measure performance, and understand campaign
                effectiveness.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Permissions We Use</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Photos/Media Library: to import media and save finished exports.</li>
                <li>Speech Recognition: to convert selected audio into timed captions.</li>
                <li>
                  App Tracking Transparency: to ask before using advertising identifiers for campaign
                  attribution and measurement.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Payments</h2>
              <p className="mt-2">
                Optional subscription billing is processed by Apple. Apple may share purchase status so
                paid features can be unlocked, but payment credentials are not collected by us.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Advertising Attribution and TikTok SDK</h2>
              <p className="mt-2">
                SoundFrame may use the TikTok Business SDK to measure app installs, sign-ins,
                subscriptions, and selected app events from TikTok advertising campaigns. TikTok and
                SoundFrame may process device advertising identifiers, app or user identifiers, purchase
                or subscription events, and product interaction events for advertising attribution,
                analytics, and campaign measurement.
              </p>
              <p className="mt-2">
                This data may be used for tracking as defined by Apple. On iOS, you can allow or deny
                tracking when prompted, and you can change that choice later in iOS Settings.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Changes</h2>
              <p className="mt-2">
                If collection or processing practices change in a future release, this page will be
                updated before the updated app is published.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Contact</h2>
              <p className="mt-2">
                For data-collection questions, contact{" "}
                <a href="mailto:currenttech.co.za@gmail.com" className="text-blue-600 underline">
                  currenttech.co.za@gmail.com
                </a>.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/projects/soundframe-ios/privacy"
              className="border-2 border-theme text-theme px-5 py-2 rounded-full hover:bg-theme hover:text-white"
            >
              Privacy Policy
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

export default SoundframeIOSDataCollection;
