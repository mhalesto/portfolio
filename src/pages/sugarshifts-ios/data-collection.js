import { Link } from "react-router-dom";
import Layout from "../../components/layout";

const SugarShiftsIOSDataCollection = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <p className="text-sm uppercase tracking-widest text-gray-500">SugarShifts iOS</p>
          <h1 className="text-3xl md:text-2xl font-bold text-theme mt-2">Data Collection</h1>
          <p className="mt-4 text-lg md:text-base">
            SugarShifts is designed so core play can run from local game data. Cloud sync and Apple
            services are used only for platform features such as progress restore, purchases, Game
            Center, and reminders.
          </p>
          <div className="mt-4 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-theme">What We Don't Collect</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Payment card details</li>
                <li>Advertising identifiers or cross-app tracking data</li>
                <li>Contacts, precise location, health data, photos, camera, or microphone recordings</li>
                <li>Passwords or social profile data</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Stored on Device</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Current level, unlocked progress, stars, score, and daily challenge state</li>
                <li>Coins, lives, boosters, piggy bank state, rewards, and shop settings</li>
                <li>Accessibility and gameplay settings such as sound, haptics, high contrast, and hints</li>
                <li>Local gameplay event history used to review level balance and app behavior</li>
                <li>StoreKit transaction IDs already delivered, to avoid duplicate coin grants</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Sent to Service Providers When Used</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Apple may process StoreKit purchases, Game Center activity, iCloud sync, Sign in with Apple, and local notification permissions.</li>
                <li>Firebase may receive a user ID, progress snapshot, economy state, and purchase-delivery records when optional account sync is used.</li>
                <li>Firebase Cloud Functions may verify StoreKit transaction details against Apple's App Store Server API before recording delivery.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">User Controls</h2>
              <p className="mt-2">
                Users can manage notifications, Game Center, iCloud, and Sign in with Apple through iOS
                Settings. In-app settings can be used for gameplay preferences and account sync actions
                where available.
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
              to="/projects/sugarshifts-ios/privacy"
              className="border-2 border-theme text-theme px-5 py-2 rounded-full hover:bg-theme hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              to="/projects/sugarshifts-ios"
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

export default SugarShiftsIOSDataCollection;
