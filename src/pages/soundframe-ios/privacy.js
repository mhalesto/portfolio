import { Link } from "react-router-dom";
import Layout from "../../components/layout";

const SoundframeIOSPrivacy = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <p className="text-sm uppercase tracking-widest text-gray-500">SoundFrame iOS</p>
          <h1 className="text-3xl md:text-2xl font-bold text-theme mt-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-2">Last updated: March 15, 2026</p>

          <div className="mt-6 space-y-6">
            <p>
              SoundFrame is a video editing app for building beat-synced edits, captions, and layered
              visual clips on iPhone and iPad. We aim to keep media processing private and local.
            </p>
            <div>
              <h2 className="text-xl font-semibold text-theme">Information We Collect</h2>
              <p className="mt-2">
                We do not create user profiles, run advertising SDKs, or use third-party analytics to
                track your behavior inside the app.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">How Media Is Processed</h2>
              <p className="mt-2">
                Videos, photos, audio, captions, and timeline edits are primarily processed on your
                device. Imported media remains under your control unless you choose to export or share it.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Permissions</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Photos/Media Library: to import media and save exports.</li>
                <li>Speech Recognition: to generate timed captions from audio you choose.</li>
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
                The current release does not include third-party ad tracking. If caption model downloads
                or external services are added in the future, this policy will be updated before release.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Data Retention</h2>
              <p className="mt-2">
                We do not store your project media on our own servers. Your edits and exported files stay
                on your device unless you choose to share them through another service.
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
