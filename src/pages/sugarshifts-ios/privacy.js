import { Link } from "react-router-dom";
import Layout from "../../components/layout";

const SugarShiftsIOSPrivacy = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <p className="text-sm uppercase tracking-widest text-gray-500">SugarShifts iOS</p>
          <h1 className="text-3xl md:text-2xl font-bold text-theme mt-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-2">Last updated: May 21, 2026</p>

          <div className="mt-6 space-y-6">
            <p>
              SugarShifts is a match-3 puzzle game for iPhone. This policy explains how game progress,
              purchases, optional sync, and permissions are handled.
            </p>
            <div>
              <h2 className="text-xl font-semibold text-theme">Information We Collect</h2>
              <p className="mt-2">
                We do not sell personal data or use advertising SDKs for cross-app tracking. The app
                stores gameplay data such as level progress, stars, coins, lives, boosters, settings,
                local gameplay events, daily rewards, and purchase-delivery records on your device.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Progress Sync</h2>
              <p className="mt-2">
                If iCloud key-value storage is available, selected progress and economy values may be
                mirrored through Apple iCloud so progress can follow your devices. If you choose Sign in
                with Apple for account sync, Firebase may store a sanitized progress snapshot and StoreKit
                delivery ledger so purchases and progress can be restored.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Purchases</h2>
              <p className="mt-2">
                Optional coin packs are processed by Apple through StoreKit. We do not receive your full
                payment card details. The app may save transaction identifiers and product information so
                coin delivery is not duplicated and can be restored after a device switch.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Game Center and Notifications</h2>
              <p className="mt-2">
                Game Center may be used for leaderboards and achievements if you enable it. Local
                notifications may be requested for reminders such as full lives or daily challenge resets.
                Permissions are requested only when a feature needs them.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Third-Party Services</h2>
              <p className="mt-2">
                Apple provides iCloud, Game Center, Sign in with Apple, notifications, and StoreKit
                services. Firebase may be used for authentication, Firestore progress sync, Cloud
                Functions, and purchase-delivery validation. The current release does not include a
                third-party ad network.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Data Retention</h2>
              <p className="mt-2">
                Local progress remains on your device until you delete it, reset the game, or uninstall
                the app. Cloud progress remains available while the linked iCloud or Firebase account
                exists, subject to the controls provided by Apple and Firebase-backed app settings.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Children's Privacy</h2>
              <p className="mt-2">
                SugarShifts is not directed to children under 13, and we do not knowingly collect
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
              to="/projects/sugarshifts-ios/data-collection"
              className="border-2 border-theme text-theme px-5 py-2 rounded-full hover:bg-theme hover:text-white"
            >
              Data Collection
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

export default SugarShiftsIOSPrivacy;
