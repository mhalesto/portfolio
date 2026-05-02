import { Link } from "react-router-dom";
import Layout from "../../components/layout";

const YouMineIOSDataCollection = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <p className="text-sm uppercase tracking-widest text-gray-500">YouMine iOS</p>
          <h1 className="text-3xl md:text-2xl font-bold text-theme mt-2">Data Collection</h1>
          <p className="mt-4 text-lg md:text-base">
            YouMine is designed to keep personal companion data under user control. Most app data is
            saved locally on the device, and external processing happens only for features the user
            chooses to use.
          </p>
          <div className="mt-4 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-theme">What We Don’t Collect</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Advertising identifiers or cross-app tracking data</li>
                <li>Payment card details</li>
                <li>Contacts, health data, or background location</li>
                <li>Account passwords or social profiles</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Stored on Device</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Chat history and generated conversation titles</li>
                <li>Memory details such as name, goals, and preferences</li>
                <li>Notes, reminders you choose to create, and usage metrics</li>
                <li>Uploaded or recorded voice samples</li>
                <li>Settings, selected voice, and locally saved API key data for development builds</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Sent to Service Providers When Used</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Speech Recognition may process audio to produce a transcript.</li>
                <li>OpenAI or another configured AI provider may receive prompts, memory context, chat context, and extracted attachment text.</li>
                <li>Text-to-speech providers may receive response text to generate spoken audio.</li>
                <li>Open-Meteo may receive a typed weather location to return current weather.</li>
                <li>Apple processes App Store purchases and may provide entitlement status.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Attachments</h2>
              <p className="mt-2">
                Images, PDFs, and text files are selected by the user. The app extracts readable text
                locally where possible. If the user sends the attachment in chat, extracted text may be
                included in the AI request so the assistant can answer.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">User Controls</h2>
              <p className="mt-2">
                Users can delete saved chats, remove a saved API key, replace or remove voice samples,
                clear local notes, and manage app permissions through iOS Settings.
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
              to="/projects/youmine-ios/privacy"
              className="border-2 border-theme text-theme px-5 py-2 rounded-full hover:bg-theme hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              to="/projects/youmine-ios"
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

export default YouMineIOSDataCollection;
