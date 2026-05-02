import { Link } from "react-router-dom";
import Layout from "../../components/layout";

const YouMineIOSPrivacy = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <p className="text-sm uppercase tracking-widest text-gray-500">YouMine iOS</p>
          <h1 className="text-3xl md:text-2xl font-bold text-theme mt-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-2">Last updated: May 2, 2026</p>

          <div className="mt-6 space-y-6">
            <p>
              YouMine is a voice-first AI companion for daily conversation, memory, spoken replies,
              and practical assistant tools. This policy explains how data is handled in the app.
            </p>
            <div>
              <h2 className="text-xl font-semibold text-theme">Information We Collect</h2>
              <p className="mt-2">
                We do not sell personal data or use advertising SDKs. The app can store information
                you choose to enter, including chat history, memory details, notes, voice samples,
                usage metrics, and settings on your device.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">AI Processing</h2>
              <p className="mt-2">
                When AI features are enabled, prompts, conversation context, selected memory, and
                text extracted from attachments may be sent to the configured AI provider to generate
                a response. Pro voice may send response text to a text-to-speech provider so spoken
                audio can be generated.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Voice and Audio</h2>
              <p className="mt-2">
                Voice input uses the microphone and speech recognition only when you use voice
                features. Uploaded or recorded voice samples are saved locally for preview and future
                eligible custom voice support. Voice cloning is not performed unless a supported
                provider, consent flow, and updated policy are added.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Permissions</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Microphone: to record speech and voice samples you request.</li>
                <li>Speech Recognition: to turn your spoken prompts into text.</li>
                <li>Files and Photos you select: to attach images, PDFs, or text files to a chat.</li>
                <li>Reminders: to save reminders when you choose that tool.</li>
              </ul>
              <p className="mt-2">Permissions are requested only when you use a feature that needs them.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Tools and Third Parties</h2>
              <p className="mt-2">
                Weather requests may send the location text you enter to Open-Meteo to retrieve
                current weather. In-app purchases are handled by Apple, and Apple may provide
                purchase status needed to unlock subscription features.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Data Retention</h2>
              <p className="mt-2">
                Local chat history, memory, notes, settings, API key data, voice samples, and usage
                metrics remain on your device unless you delete them, uninstall the app, or choose to
                send selected content to an AI or tool provider.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Children’s Privacy</h2>
              <p className="mt-2">
                YouMine is not directed to children under 13, and we do not knowingly collect personal
                information from children.
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
              to="/projects/youmine-ios/data-collection"
              className="border-2 border-theme text-theme px-5 py-2 rounded-full hover:bg-theme hover:text-white"
            >
              Data Collection
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

export default YouMineIOSPrivacy;
