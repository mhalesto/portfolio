import { Link } from "react-router-dom";
import Layout from "../../components/layout";

const SoundframePrivacy = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <p className="text-sm uppercase tracking-widest text-gray-500">Soundframe Studio</p>
          <h1 className="text-3xl md:text-2xl font-bold text-theme mt-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-2">Last updated: January 26, 2026</p>

          <div className="mt-6 space-y-6">
            <p>
              Soundframe Studio is an on-device creative tool for extracting audio from videos
              and building soundframe clips with images. We respect your privacy.
            </p>
            <div>
              <h2 className="text-xl font-semibold text-theme">Information We Collect</h2>
              <p className="mt-2">
                We do not collect personal information, create user profiles, or sell data. The app
                does not require sign-in and does not include advertising or tracking SDKs.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">How We Process Media</h2>
              <p className="mt-2">
                Media you import is processed locally on your device. Exports are saved only when
                you choose to export or share them.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Device Permissions</h2>
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
                We do not use analytics, advertising, or tracking services in the current release.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Data Retention</h2>
              <p className="mt-2">
                We do not store your media on our servers. Files remain on your device unless you
                export or share them.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Children’s Privacy</h2>
              <p className="mt-2">
                The app is not directed to children under 13, and we do not knowingly collect
                personal information from children.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Changes to This Policy</h2>
              <p className="mt-2">
                If this policy changes, it will be updated on this page before the changes take effect.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Contact</h2>
              <p className="mt-2">
                If you have questions about privacy, contact us at{" "}
                <a href="mailto:currenttech.co.za@gmail.com" className="text-blue-600 underline">
                  currenttech.co.za@gmail.com
                </a>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/projects/soundframe-studio/data-collection"
              className="border-2 border-theme text-theme px-5 py-2 rounded-full hover:bg-theme hover:text-white"
            >
              Data Collection
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

export default SoundframePrivacy;
