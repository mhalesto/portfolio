import { Link } from "react-router-dom";
import Layout from "../../components/layout";

const LifeTrackIOS = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <div className="bg-theme text-white rounded-3xl p-10 md:p-6 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-10 items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-emerald-300">iOS Life Planner</p>
              <h1 className="text-4xl md:text-3xl font-bold mt-2">LifeTrack</h1>
              <p className="text-lg md:text-base mt-4">
                Plan tasks, protect focus time, track money, capture documents, schedule reminders,
                review progress, and export local backups from one privacy-conscious iOS app.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/projects/lifetrack-ios/privacy"
                  className="border-2 border-white px-5 py-2 rounded-full hover:bg-white hover:text-theme"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/projects/lifetrack-ios/data-collection"
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
                <div className="absolute inset-0 rounded-[2rem] bg-emerald-400 blur-3xl opacity-35"></div>
                <img
                  src={`${process.env.PUBLIC_URL}/lifetrack-ios.png`}
                  alt="LifeTrack app icon"
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
              <li>Create, schedule, prioritize, complete, archive, and restore tasks.</li>
              <li>Plan the day with focus recommendations, calendar-aware scheduling, and focus sessions.</li>
              <li>Track income, expenses, bills, recurring transactions, budgets, and money insights.</li>
              <li>Scan receipts, import bank statements, attach documents, and search supporting files.</li>
              <li>Use notifications, widgets, App Intents, Share Extension capture, and location reminders.</li>
              <li>Export and restore integrity-checked local JSON backups.</li>
            </ul>
          </div>

          <div className="bg-white shadow-2xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-theme">Platforms & notes</h2>
            <div className="mt-4 space-y-3">
              <p><span className="font-semibold">Platform:</span> iOS</p>
              <p><span className="font-semibold">Processing:</span> Tasks, focus history, documents, receipts, bank imports, HealthKit samples, and backups are processed locally where possible.</p>
              <p><span className="font-semibold">AI:</span> Free task suggestions use on-device AI or offline rules. Ultimate users can add their own Claude API key for optional cloud AI features.</p>
              <p><span className="font-semibold">Permissions:</span> Notifications, Location, Camera, Microphone, Speech Recognition, Calendar, Health, Photos, and Files are requested only for features that need them.</p>
              <p><span className="font-semibold">Status:</span> Release preparation and TestFlight validation.</p>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Support, privacy, and data-use details are available in the pages linked above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LifeTrackIOS;
