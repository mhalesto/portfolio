import { Link } from "react-router-dom";
import Layout from "../../components/layout";

const YouMineIOS = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <div className="bg-theme text-white rounded-3xl p-10 md:p-6 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-10 items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-purple-300">Voice-first AI Companion</p>
              <h1 className="text-4xl md:text-3xl font-bold mt-2">YouMine</h1>
              <p className="text-lg md:text-base mt-4">
                Talk naturally with a personalized AI companion that supports voice chat, personality
                modes, memory, local history, attachments, tools, and Pro voice options.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/projects/youmine-ios/privacy"
                  className="border-2 border-white px-5 py-2 rounded-full hover:bg-white hover:text-theme"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/projects/youmine-ios/data-collection"
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
                <div className="absolute inset-0 rounded-[2rem] bg-purple-500 blur-3xl opacity-40"></div>
                <img
                  src={`${process.env.PUBLIC_URL}/youmine.png`}
                  alt="YouMine app icon"
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
              <li>Voice-first chat with tap-to-speak, silence auto-send, and spoken replies.</li>
              <li>Switch between Motivational Coach, Funny Storyteller, Calm Advisor, and Smart Assistant modes.</li>
              <li>Remember user details such as name, goals, and preferences on device.</li>
              <li>Save chat history locally with titles and message previews.</li>
              <li>Use practical tools including weather, time, calculator, notes, reminders, and translation prompts.</li>
              <li>Attach images, PDFs, and text files with local text extraction before AI processing.</li>
            </ul>
          </div>

          <div className="bg-white shadow-2xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-theme">Platforms & notes</h2>
            <div className="mt-4 space-y-3">
              <p><span className="font-semibold">Platform:</span> iOS</p>
              <p><span className="font-semibold">Processing:</span> Memory, history, notes, voice samples, and basic tools are stored or processed on device.</p>
              <p><span className="font-semibold">AI:</span> OpenAI chat and Pro voice can be enabled through configured API access.</p>
              <p><span className="font-semibold">Permissions:</span> Microphone, Speech Recognition, Reminders, and selected files are used only for requested features.</p>
              <p><span className="font-semibold">Status:</span> Active development and App Store release preparation.</p>
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

export default YouMineIOS;
