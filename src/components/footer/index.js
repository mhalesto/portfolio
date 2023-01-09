import { FaFacebook, FaInstagram, FaGithub, FaLinkedin, FaMailBulk } from 'react-icons/fa'
const Footer = () => {
  return (
    <>
      <div className="h-44 md:h-16">
        <svg xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320">
          <path
            fill="#2a2a2a"
            fill-opacity="1"
            d="M0,288L0,224L288,224L288,96L576,96L576,224L864,224L864,128L1152,128L1152,160L1440,160L1440,320L1152,320L1152,320L864,320L864,320L576,320L576,320L288,320L288,320L0,320L0,320Z"></path>
        </svg>
      </div>
      <div className="bg-theme w-screen flex justify-center">
        <div className="md:w-full w-1/2">
          <div className="p-10 font-mont text-center">
            <p className="text-gray-50 pb-5">Designed and Developed By</p>

            <div className="h-1 border-white border-2 border-dotted"></div>

            <div className="flex text-white w-full justify-between py-2">
              <FaFacebook />
              <FaInstagram />
              <FaGithub />
              <FaLinkedin />
              <FaMailBulk />
            </div>

            <div className="h-1 border-white border-2 border-dotted"></div>
            <p className="text-gray-50 pt-5">Halalisani Mbanjwa</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer;