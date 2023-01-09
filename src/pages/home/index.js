import { FaAngular, FaBootstrap, FaCss3, FaHtml5, FaJava, FaJsSquare, FaNodeJs, FaReact } from "react-icons/fa";
import Layout from "../../components/layout";

const Home = () => {
  return (
    <Layout>
      <div>
        {/* Intro section */}
        <div className="h-screen bg-theme">
          <div
            className="grid md:grid-cols-1 grid-cols-2 h-screen items-center border-4 border-white transform rotate-12  md:rotate-0 md:border-0 mx-14 bg-theme">
            <div className="h-1/1 md:p-0 sm:p-0 p-20">
              <lottie-player src="https://assets6.lottiefiles.com/packages/lf20_kkflmtur.json"
                background="transparent"
                speed="1"
                loop
                autoplay
              >
              </lottie-player>
            </div>

            <div className="font-bold text-white md:px-5">
              <h1 className="text-7xl md:text-4xl">Hii, I am <b className="text-yellow-500">HALALISANI</b></h1>
              <h1 className="text-4xl md:text-2xl">Fullstack <b className="text-red-500">Developer</b>, Freelancer</h1>
            </div>
          </div>
        </div>
        {/* Technologies */}
        <div className="mt-20">
          <h1 className="text-4xl text-blue-800 font-bold text-center my-8">Technologies I USE</h1>
          <div className="grid md:grid-cols-1 grid-cols-4">
            <FaReact size={180} color='cyan' className="w-full text-center mt-20" />
            <FaAngular size={180} color='red' className="w-full text-center mt-20 animate-bounce " />
            <FaJava size={180} color='orange' className="w-full text-center mt-20 animate-bounce" />
            <FaNodeJs size={180} color='green' className="w-full text-center mt-20" />
            <FaBootstrap size={180} color='blue' className="w-full text-center mt-20 animate-bounce" />
            <FaJsSquare size={180} color='green' className="w-full text-center mt-20" />
            <FaHtml5 size={180} color='orange' className="w-full text-center mt-20" />
            <FaCss3 size={180} color='blue' className="w-full text-center mt-20 animate-bounce" />
            {/* <FaCss3 size={180} color='cadetblue' className="w-full text-center" /> */}
          </div>
        </div>

        {/* Javascript Buff */}
        <div className="my-20">
          <div className="text-center h-52 bg-primary">
            <h1 className="text-4xl font-bold text-white py-10">Yes, You are right on Time...</h1>
          </div>

          <div className="md:mx-5 mx-32 shadow-2xl bg-gray-50 -mt-20 rounded-md hover:bg-gray-700 hover:text-white">
            <div className="h-96">
              <lottie-player
                src="https://assets10.lottiefiles.com/packages/lf20_sSF6EG.json"
                background="transparent"
                speed="1"
                loop
                autoplay
              >
              </lottie-player>
            </div>
            <p className="text-xl my-5 font-semibold md:px-5 px-14 py-10">
              Javascript is one of the most top-ranked programming languages
              because of its ubiquitous use on all platforms and mass adoption.
              Main Use Cases: Web Development
            </p>
          </div>
        </div>

        {/* Dev Stack */}
        <div className="my-20">
          <div className="text-center h-52 bg-red-500">
            <h1 className="text-4xl font-bold text-white py-10">My DEV Stack</h1>
          </div>

          <div className="md:mx-5 mx-32 shadow-2xl bg-gray-50 -mt-20 rounded-md hover:bg-gray-700 hover:text-white">
            <div className="h-96">
              <lottie-player
                src="https://assets2.lottiefiles.com/packages/lf20_vybwn7df.json"
                // src="https://assets1.lottiefiles.com/packages/lf20_dydyldzm.json"
                background="transparent"
                speed="1"
                loop
                autoplay
              >
              </lottie-player>
            </div>
            <div className="grid md:grid-cols-1 grid-cols-3 p-5">
              <div className="font-bold text-left">
                <h1 className="text-xl font-bold">Front End</h1>
                <hr />
                <p className="font-semibold mt-2">HTML/CSS</p>
                <p className="font-semibold mt-2">React</p>
                <p className="font-semibold mt-2">Angular</p>
                <p className="font-semibold mt-2">Redux</p>
                <p className="font-semibold mt-2">HTML/CSS</p>
              </div>

              <div className="text-center md:mt-5">
                <h1 className="text-xl font-bold">UI / UX</h1>
                <hr />
                <p className="font-semibold mt-2">Tailwind</p>
                <p className="font-semibold mt-2">Bootstrap</p>
                <p className="font-semibold mt-2">Material UI</p>
                <p className="font-semibold mt-2">Ant Design</p>
                <p className="font-semibold mt-2">Semantic UI</p>
              </div>

              <div className="text-right md:mt-5">
                <h1 className="text-xl font-bold">Backend & DB</h1>
                <hr />
                <p className="font-semibold mt-2">Node JS</p>
                <p className="font-semibold mt-2">Express JS</p>
                <p className="font-semibold mt-2">PHP</p>
                <p className="font-semibold mt-2">My SQL</p>
                <p className="font-semibold mt-2">MongoDB</p>
              </div>


            </div>
          </div>
        </div>

        {/* Dev info */}
        <div>
          <h1 className="text-4xl text-gray-500 text-center font-bold">
            Who is Halalisani?
          </h1>

          <div className="md:-mt-24">
            <div className="h-screen relative text-gray-800">
              <div className="h-full">
                <lottie-player src="https://assets2.lottiefiles.com/packages/lf20_dcatp5cr.json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                >
                </lottie-player>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-left">
                  Hi, Hello there <span className="animate-spin">👋</span>
                  <hr />

                  <pre className="text-xl md:text-sm my-5 font-mont">
                    {JSON.stringify({
                      name: 'Halalisani Mbanjwa',
                      age: null,
                      gender: 'Male',
                      country: 'South Africa'
                    }, null, 2)}
                  </pre>
                </h1>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default Home;