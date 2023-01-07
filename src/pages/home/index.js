import Layout from "../../components/layout";

const Home = () => {
  return (
    <Layout>
      <div>
        <div className="h-screen bg-theme">
          <div
            className="grid md:grid-cols-1 grid-cols-2 h-screen items-center border-4 border-white transform rotate-12  md:rotate-0 md:border-0 mx-10 bg-theme">
            <div className="h-1/2">
              <lottie-player src="https://assets6.lottiefiles.com/packages/lf20_kkflmtur.json"
                background="transparent"
                speed="1"
                loop
                autoplay
              >
              </lottie-player>
            </div>

            <div className="font-bold text-white md:px-5">
              <h1 className="text-7xl md:text-4xl">Hii , I am <b className="text-yellow-500">HALALISANI</b></h1>
              <h1 className="text-4xl md:text-2xl">Fullstack <b className="text-red-500">Developer</b>, Freelancer</h1>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home;