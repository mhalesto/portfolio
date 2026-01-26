import { Link } from "react-router-dom";
import Layout from "../../components/layout";

const SoundframeDataCollection = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <p className="text-sm uppercase tracking-widest text-gray-500">Soundframe Studio</p>
          <h1 className="text-3xl md:text-2xl font-bold text-theme mt-2">Data Collection</h1>
          <p className="mt-4 text-lg md:text-base">
            Soundframe Studio does not collect, store, or sell personal data.
          </p>
          <div className="mt-4 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-theme">What We Don’t Collect</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Names, emails, phone numbers, or account details</li>
                <li>Device identifiers or advertising IDs</li>
                <li>Usage analytics or behavioral tracking</li>
                <li>Precise location data</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">On-Device Processing</h2>
              <p className="mt-2">
                All audio extraction, editing, and image processing happens locally on your device.
                When you import media, it stays on device unless you choose to export or share it.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Permissions We Use</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Photos/Media Library: to select images or videos and save exports.</li>
                <li>Files: to import audio or video files you choose.</li>
              </ul>
              <p className="mt-2">
                We request permissions only when you use a feature that needs them.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Third-Party Services</h2>
              <p className="mt-2">
                The app does not require an account, and we do not run analytics or ad tracking
                in the current release.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Changes</h2>
              <p className="mt-2">
                If data practices change in the future, this page will be updated before the change
                takes effect.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Contact</h2>
              <p className="mt-2">
                If you have questions about data practices, contact us at{" "}
                <a href="mailto:currenttech.co.za@gmail.com" className="text-blue-600 underline">
                  currenttech.co.za@gmail.com
                </a>.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/projects/soundframe-studio/privacy"
              className="border-2 border-theme text-theme px-5 py-2 rounded-full hover:bg-theme hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              to="/projects/soundframe-studio"
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

export default SoundframeDataCollection;
