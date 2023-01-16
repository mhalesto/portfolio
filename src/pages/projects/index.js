import Layout from "../../components/layout";
import projectsData from '../../resources/projects';
import AOS from 'aos';

AOS.init({
  duration: 1000
});

const Projects = () => {
  return (
    <Layout>
      <div>
        <div className="md:pt-24 pt-28 mb-16">
          <div className="-ml-5 md:-ml-2">
            <lottie-player
              src="https://assets7.lottiefiles.com/packages/lf20_uhoBnYFtuw.json"
              background="transparent"
              speed="0.6"
              loop
              autoplay
            >
            </lottie-player>
          </div>
          <p className="text-xl md:text-sm font-semibold text-center mt-16 px-72 md:px-6" data-aos='zoom-in'>
            Good ideas are not adopted automatically. They must be driven into practice with courageous patience
          </p>
          <h1 className="text-4xl text-center font-bold mt-5">Because</h1>
        </div>

        <div className="w-full">
          <div className="font-bold text-center bg-red-500 text-white md:mx-6 mx-20 p-20 rounded-tl-full rounded-br-full">
            <h1 className="text-8xl md:text-2xl" data-aos='slide-left'>THE GAME IS...</h1>
            <h1 className="text-8xl md:text-2xl" data-aos='slide-right'>CONSISTENCY</h1>
          </div>
        </div>

        <div className="grid mt-20 md:grid-cols-1 grid-cols-3 items-center justify-center gap-10 mx-20 md:mx-5">
          {
            projectsData.map((project) => {
              return (
                <div>
                  <div className="relative p-10 border-2 rounded-tr-3xl rounded-bl-3xl text-center border-gray-300">
                    <img src={project.image} alt="" className="w-full h-52 text-center" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 bg-black 
                         hover:opacity-80 text-white rounded-tr-3xl rounded-bl-3xl">
                      <h1 className="text-3xl font-semibold">{project.title}</h1>
                      <button className="border-2 rounded border-white py-2 px-5 hover:bg-green-500 mt-5">DEMO</button>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </Layout>
  )
}

export default Projects;