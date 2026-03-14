import { Link } from "react-router-dom";
import Layout from "../../components/layout";

const SoundframeIOS = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <div className="bg-theme text-white rounded-3xl p-10 md:p-6 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-10 items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-yellow-400">iOS Video Editor</p>
              <h1 className="text-4xl md:text-3xl font-bold mt-2">SoundFrame</h1>
              <p className="text-lg md:text-base mt-4">
                Build fast beat-synced edits with captions, timeline layers, overlays, audio control,
                filters, speed tools, and export-ready clips for short-form video.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/projects/soundframe-ios/privacy"
                  className="border-2 border-white px-5 py-2 rounded-full hover:bg-white hover:text-theme"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/projects/soundframe-ios/data-collection"
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
              <img
                src={`${process.env.PUBLIC_URL}/soundframe-ios.svg`}
                alt="SoundFrame iOS"
                className="w-80 md:w-64"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-1 gap-8 mt-12">
          <div className="bg-white shadow-2xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-theme">What it does</h2>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Create reels and edits with beat-aware cuts, trim tools, and timeline snapping.</li>
              <li>Generate timed captions and edit text blocks directly on the timeline.</li>
              <li>Stack video, audio, graphics, text, and speed layers in one project.</li>
              <li>Add overlays, filters, effects, beat-reactive visuals, and still-image layers.</li>
              <li>Adjust clip timing with split, resize, move, mute, lock, and hide controls.</li>
              <li>Export polished clips for vertical and social-first formats.</li>
            </ul>
          </div>

          <div className="bg-white shadow-2xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-theme">Platforms & notes</h2>
            <div className="mt-4 space-y-3">
              <p><span className="font-semibold">Platform:</span> iOS</p>
              <p><span className="font-semibold">Processing:</span> Editing, waveform analysis, and core caption workflows run on device.</p>
              <p><span className="font-semibold">Account:</span> No login required to edit. Optional subscription unlocks Pro features.</p>
              <p><span className="font-semibold">Permissions:</span> Photos access for import/export and Speech Recognition for caption generation.</p>
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

export default SoundframeIOS;
