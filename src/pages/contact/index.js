import Layout from "../../components/layout";

const Contact = () => {
  return (
    <Layout>
      <div>
        <div className="h-screen mt-10">
          <lottie-player
            src="https://assets1.lottiefiles.com/packages/lf20_kdx6cani.json"
            background="transparent"
            speed="0.6"
            loop
            autoplay
          >
          </lottie-player>
        </div>

        <div className="w-screen flex justify-center items-center">
          <div className="md:w-full w-1/2 p-10 shadow-2xl bg-gray-50">
            <h1 className="text-2xl font-semibold">Contact me for more</h1>
            <hr />
            <input type='text' placeholder="Name" className="w-full border-2 border-gray-400 h-12 rounded p-1 mt-5 shadow-lg" />
            <input type='text' placeholder="Email" className="w-full border-2 border-gray-400 h-12 rounded p-1 mt-5 shadow-lg" />
            <textarea type='text' placeholder="Query" className="w-full border-2 border-gray-400 h-28 rounded p-1 mt-5 shadow-lg" />

            <button className="bg-red-500 rounded text-white px-5 py-2 mt-3">SUBMIT</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Contact;