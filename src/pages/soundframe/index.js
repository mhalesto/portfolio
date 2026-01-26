import { Link } from "react-router-dom";
import Layout from "../../components/layout";

const SoundframeStudio = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <div className="bg-theme text-white rounded-3xl p-10 md:p-6 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-10 items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-yellow-400">Audio + Visual</p>
              <h1 className="text-4xl md:text-3xl font-bold mt-2">Soundframe Studio</h1>
              <p className="text-lg md:text-base mt-4">
                Turn any video into a clean audio track, then pair it with a still image or a slideshow
                to create a soundframe clip.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/projects/soundframe-studio/privacy"
                  className="border-2 border-white px-5 py-2 rounded-full hover:bg-white hover:text-theme"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/projects/soundframe-studio/data-collection"
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
                src={`${process.env.PUBLIC_URL}/soundframe.svg`}
                alt="Soundframe Studio"
                className="w-80 md:w-64"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-1 gap-8 mt-12">
          <div className="bg-white shadow-2xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-theme">What it does</h2>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Extract audio from videos with clean sound cuts.</li>
              <li>Trim and refine clips with snap and beat grids.</li>
              <li>Mix multiple layers with volume, mute/solo, offset, and speed controls.</li>
              <li>Build slideshows (up to 10 images) with transitions.</li>
              <li>Add reactive visual presets for motion energy.</li>
              <li>Export clips, stills, audio, and snapshots.</li>
            </ul>
          </div>

          <div className="bg-white shadow-2xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-theme">Platforms & notes</h2>
            <div className="mt-4 space-y-3">
              <p><span className="font-semibold">Platforms:</span> iOS (primary), Android (in progress)</p>
              <p><span className="font-semibold">Processing:</span> All audio and image work runs locally on device.</p>
              <p><span className="font-semibold">Account:</span> No login required.</p>
              <p><span className="font-semibold">Status:</span> Active development and updates.</p>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Want more info? Check the privacy and data collection pages above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SoundframeStudio;
