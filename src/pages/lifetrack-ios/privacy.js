import { Link } from "react-router-dom";
import Layout from "../../components/layout";

const LifeTrackIOSPrivacy = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <p className="text-sm uppercase tracking-widest text-gray-500">LifeTrack iOS</p>
          <h1 className="text-3xl md:text-2xl font-bold text-theme mt-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-2">Last updated: May 2, 2026</p>

          <div className="mt-6 space-y-6">
            <p>
              LifeTrack is an iOS app for task planning, focus sessions, money tracking,
              document-assisted capture, reminders, widgets, and local backup/export. This
              policy explains how information is handled in the app.
            </p>
            <div>
              <h2 className="text-xl font-semibold text-theme">Information We Collect</h2>
              <p className="mt-2">
                We do not sell personal data, use advertising SDKs, or run cross-app tracking.
                LifeTrack stores the tasks, notes, categories, reminders, money records, focus
                history, settings, documents, and backups you create on your device.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Local Processing</h2>
              <p className="mt-2">
                Core planning, focus, money tracking, receipt parsing, bank statement import,
                document storage, widgets, and backup workflows are designed to run locally.
                Backup files are created as portable JSON exports only when you choose to share
                or save them.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">AI Features</h2>
              <p className="mt-2">
                Free task suggestions use Apple Foundation Models when available, with offline
                task rules as a fallback. Ultimate users may add their own Claude API key in
                Settings. When Claude-backed features are used, task-oriented context may be sent
                to Anthropic to generate suggestions or analysis.
              </p>
              <p className="mt-2">
                Raw bank transactions, raw HealthKit samples, StoreKit receipts, API keys, and
                document binaries are not sent to Claude by LifeTrack.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Permissions</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Notifications: to deliver task, money, and reminder alerts.</li>
                <li>Location: to trigger location reminders you create.</li>
                <li>Camera and Files: to scan, import, and attach documents or receipts.</li>
                <li>Microphone and Speech Recognition: to create tasks from voice input.</li>
                <li>Calendar: to read busy windows and optionally sync scheduled task blocks.</li>
                <li>Health: to read sleep and heart rate variability for energy-aware planning.</li>
                <li>Photos: to choose a local profile avatar.</li>
              </ul>
              <p className="mt-2">Permissions are requested only when you use a feature that needs them.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Subscriptions and Payments</h2>
              <p className="mt-2">
                Optional subscriptions are handled by Apple. We do not receive your full payment
                card details. Apple may provide transaction status needed to unlock subscription
                features.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Data Retention</h2>
              <p className="mt-2">
                Local app data remains on your device unless you delete it, export it, restore a
                backup, share it, or uninstall the app. Claude API keys are stored in the iOS
                Keychain and are not included in LifeTrack backup exports.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Children's Privacy</h2>
              <p className="mt-2">
                LifeTrack is not directed to children under 13, and we do not knowingly collect
                personal information from children.
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
              to="/projects/lifetrack-ios/data-collection"
              className="border-2 border-theme text-theme px-5 py-2 rounded-full hover:bg-theme hover:text-white"
            >
              Data Collection
            </Link>
            <Link
              to="/projects/lifetrack-ios"
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

export default LifeTrackIOSPrivacy;
