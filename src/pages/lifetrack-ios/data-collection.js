import { Link } from "react-router-dom";
import Layout from "../../components/layout";

const LifeTrackIOSDataCollection = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <p className="text-sm uppercase tracking-widest text-gray-500">LifeTrack iOS</p>
          <h1 className="text-3xl md:text-2xl font-bold text-theme mt-2">Data Collection</h1>
          <p className="mt-4 text-lg md:text-base">
            LifeTrack is designed to keep personal planning, focus, money, and document data under
            user control. Most app data is stored locally on the device, and external processing
            happens only for features the user chooses to use.
          </p>
          <div className="mt-4 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-theme">What We Don't Collect</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Advertising identifiers or cross-app tracking data</li>
                <li>Payment card details</li>
                <li>Contacts or social profiles</li>
                <li>Account passwords</li>
                <li>Raw HealthKit samples, raw bank transactions, StoreKit receipts, or API keys for analytics</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Stored on Device</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Tasks, notes, categories, priorities, due dates, recurrence, and completion history</li>
                <li>Focus sessions, daily planning state, weekly review data, and dashboard settings</li>
                <li>Money entries, budgets, bills, recurring templates, receipt drafts, and statement imports</li>
                <li>Attached documents, extracted text, local search metadata, and backup files you create</li>
                <li>Notification, privacy, display, avatar, subscription tier, and AI settings</li>
                <li>Claude API key data stored in the iOS Keychain when the user adds a key</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Sent to Service Providers When Used</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Anthropic Claude may receive task-focused prompts when an Ultimate user enables Claude features with their own API key.</li>
                <li>Apple processes in-app purchases and may provide entitlement status.</li>
                <li>Apple Speech Recognition may process voice input to produce task transcripts.</li>
                <li>Apple Calendar busy windows may be used for planning; event titles are omitted from AI scheduling prompts.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Files, Receipts, and Bank Statements</h2>
              <p className="mt-2">
                Documents, receipts, and bank statements are selected by the user. LifeTrack stores
                attached files locally, extracts readable text where possible, and uses parsed data
                for task and money workflows. Document binaries and raw bank statement rows are not
                sent to Claude by LifeTrack.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">User Controls</h2>
              <p className="mt-2">
                Users can edit or delete tasks and money entries, disable sensitive notification
                previews, manage Spotlight indexing, remove or replace the Claude API key, export
                local backups, and manage permissions through iOS Settings.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Changes</h2>
              <p className="mt-2">
                If data collection or processing practices change in a future release, this page will
                be updated before the updated app is published.
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
              to="/projects/lifetrack-ios/privacy"
              className="border-2 border-theme text-theme px-5 py-2 rounded-full hover:bg-theme hover:text-white"
            >
              Privacy Policy
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

export default LifeTrackIOSDataCollection;
