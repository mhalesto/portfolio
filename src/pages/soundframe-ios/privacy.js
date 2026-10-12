import { Link } from "react-router-dom";
import Layout from "../../components/layout";

const SoundframeIOSPrivacy = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <p className="text-sm uppercase tracking-widest text-gray-500">SoundFrame iOS</p>
          <h1 className="text-3xl md:text-2xl font-bold text-theme mt-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-2">Last updated: October 12, 2026</p>

          <div className="mt-6 space-y-6">
            <p>SoundFrame is a video editor and AI creation app for iPhone and iPad. Core timeline editing and export run on your device. Optional account, subscription, cloud caption, AI Director, product-ad, image, video, music-video, 3D and advertising attribution features use connected services. This policy explains the information involved when you choose those features.</p>
            <div>
              <h2 className="text-xl font-semibold text-theme">Information We Collect</h2>
              <p className="mt-2">Depending on the features you use, we process your optional account name and email address, guest or linked account ID, device identifiers, subscription transactions, product interaction events, selected photos or videos, audio, prompts, lyrics, captions, product briefs and other project content. Crash reports and technical diagnostics help us investigate errors. Cloud creation records and diagnostics can be linked to your guest or linked account ID. These records support account access, requested creation tools, purchases, saved work, security, reliability and advertising measurement.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">How Media Is Processed</h2>
              <p className="mt-2">Core video, photo, audio, caption and timeline editing is processed on your device. Using cloud captions, AI Director, Product Ad, image or video generation, music videos, 3D creation or other connected tools sends the selected media, sampled frames, audio, prompts, product details, lyrics, transcripts or project context to our backend and the provider needed for that request. Cloud job records, source references and generated outputs may be stored to run or resume work and show your Library. We do not automatically upload your entire Photos library. A reference photo or selected video frame may contain a face. It is used as creative reference or scene context for the feature you request, rather than to identify a real person. On-device motion tracking can follow a subject for editable effects. These workflows do not create a face-recognition account or identity database.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Permissions</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Photos/Media Library: to import media and save exports.</li>
                <li>Speech Recognition: to generate timed captions from audio you choose.</li>
                <li>
                  App Tracking Transparency: to ask before accessing advertising identifiers for
                  advertising attribution and measurement.
                </li>
              </ul>
              <p className="mt-2">
                Permissions are requested only when you use a feature that needs them.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Subscriptions and Payments</h2>
              <p className="mt-2">
                Optional in-app purchases are handled through Apple. We do not receive your full payment
                card details. Apple may provide transaction status needed to unlock subscription features.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Third-Party Services</h2>
              <p className="mt-2">Connected services include Firebase for authentication, cloud records, storage and Crashlytics diagnostics; Apple for optional sign-in and StoreKit subscriptions; Google for optional sign-in and Gemini-based AI; and the selected media providers used by the app, including OpenAI, BytePlus/ByteDance, Hyper3D and Hitem3D. Availability depends on the feature and selected model. These providers receive the inputs needed for the requested workflow and apply their own processing and retention policies. TikTok Business SDK handles advertising attribution as described below. Photos, audio, prompts and product briefs are not sent to TikTok by our sharing workflow; when you choose Share, the selected destination receives the files you select.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Advertising Attribution and TikTok SDK</h2>
              <p className="mt-2">
                SoundFrame may use the TikTok Business SDK to measure app installs, sign-ins,
                subscriptions, and selected app events from TikTok advertising campaigns. This helps us
                understand whether TikTok ads are working and improve campaign performance.
              </p>
              <p className="mt-2">
                For this purpose, TikTok and SoundFrame may process identifiers such as device
                advertising identifiers, app or user identifiers, purchase or subscription events, and
                product interaction events. Some of this data may be used for tracking as defined by
                Apple, including advertising measurement across apps and websites owned by other
                companies.
              </p>
              <p className="mt-2">
                On iOS, SoundFrame asks for App Tracking Transparency permission before accessing the
                device advertising identifier. You can allow or deny tracking, and you can change this
                choice later in iOS Settings.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Data Retention</h2>
              <p className="mt-2">Local projects and downloaded or exported files stay on your device until you remove them or share them. Cloud generation records and outputs are retained for limited periods to run jobs, recover interrupted work and show saved creations; some cloud assets expire, so download a copy if you want to keep it. Account, entitlement, anti-abuse, attribution and diagnostic records may be retained as needed to operate the service, investigate issues or meet legal obligations. Provider retention policies also apply to inputs sent to them.</p>
            </div>
            <div>
              <h2 id="choices" className="text-xl font-semibold text-theme">Your Privacy Choices</h2>
              <p className="mt-2">You can choose local editing without optional AI requests, choose which media to submit, decline tracking, and manage permissions in iOS Settings. Apple and Google linking are optional; the app can use a guest cloud identity. Sign-out does not by itself delete server records. To request access, correction or deletion of your SoundFrame account or cloud data, contact currenttech.co.za@gmail.com and identify the account or creation involved. We may need to verify ownership. Manage subscription cancellation through your Apple account; deleting app data does not cancel a subscription.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">Children’s Privacy</h2>
              <p className="mt-2">
                SoundFrame is not directed to children under 13, and we do not knowingly collect personal
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
              to="/projects/soundframe-ios/data-collection"
              className="border-2 border-theme text-theme px-5 py-2 rounded-full hover:bg-theme hover:text-white"
            >
              Data Collection
            </Link>
            <Link
              to="/projects/soundframe-ios"
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

export default SoundframeIOSPrivacy;
