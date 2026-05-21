import { Link } from "react-router-dom";
import Layout from "../../components/layout";

const SugarShiftsIOS = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <div className="bg-theme text-white rounded-3xl p-10 md:p-6 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-10 items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-pink-300">iOS Match-3 Puzzle Game</p>
              <h1 className="text-4xl md:text-3xl font-bold mt-2">SugarShifts</h1>
              <p className="text-lg md:text-base mt-4">
                Swap fruit tiles, build special combo clears, manage lives and coins, and chase star
                targets across a colorful 200-level puzzle campaign.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/projects/sugarshifts-ios/privacy"
                  className="border-2 border-white px-5 py-2 rounded-full hover:bg-white hover:text-theme"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/projects/sugarshifts-ios/data-collection"
                  className="border-2 border-white px-5 py-2 rounded-full hover:bg-white hover:text-theme"
                >
                  Data Collection
                </Link>
                <Link
                  to="/projects"
                  className="border-2 border-white px-5 py-2 rounded-full hover:bg-white hover:text-theme"
                >
                  Back to Projects
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-[2rem] bg-pink-400 blur-3xl opacity-35"></div>
                <img
                  src={`${process.env.PUBLIC_URL}/sugarshifts-ios.png`}
                  alt="SugarShifts app icon"
                  className="relative w-72 md:w-56 rounded-[2rem] shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-1 gap-8 mt-12">
          <div className="bg-white shadow-2xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-theme">What it does</h2>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Play match-3 fruit puzzles with shaped boards, blockers, specials, and combo swaps.</li>
              <li>Progress through a 200-level campaign with star goals and crowned late-game stages.</li>
              <li>Use boosters, shuffles, hammers, swaps, extra moves, lives, and coin rewards.</li>
              <li>Return for daily challenges, life regeneration, local reminders, and reward moments.</li>
              <li>Buy optional StoreKit coin packs, with delivery protected by a transaction ledger.</li>
              <li>Sync progress through iCloud key-value storage and optional Sign in with Apple/Firebase sync.</li>
            </ul>
          </div>

          <div className="bg-white shadow-2xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-theme">Platforms & notes</h2>
            <div className="mt-4 space-y-3">
              <p><span className="font-semibold">Platform:</span> iOS</p>
              <p><span className="font-semibold">Processing:</span> Gameplay, local progress, economy state, settings, and gameplay analytics are stored on device first.</p>
              <p><span className="font-semibold">Cloud:</span> iCloud and optional Firebase account sync can mirror progress, rewards, and purchase delivery records.</p>
              <p><span className="font-semibold">Payments:</span> Optional coin packs are handled by Apple through StoreKit.</p>
              <p><span className="font-semibold">Permissions:</span> Notifications and Game Center are used only when enabled for reminders and achievements.</p>
              <p><span className="font-semibold">Status:</span> App Store release preparation.</p>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Support, privacy, and data-use details are available in the pages linked above.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-2xl rounded-2xl p-8 col-span-2 md:col-span-1">
            <h2 className="text-2xl font-bold text-theme">Support</h2>
            <p className="mt-4">
              For help with SugarShifts, privacy questions, purchase issues, or app feedback, contact{" "}
              <a href="mailto:currenttech.co.za@gmail.com" className="text-blue-600 underline">
                currenttech.co.za@gmail.com
              </a>.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SugarShiftsIOS;
