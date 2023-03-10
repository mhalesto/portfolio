import { useState } from "react";
import { FaBars } from 'react-icons/fa';
import { Link } from "react-router-dom";

const Header = () => {

  const [showMenu, setShowMenu] = useState('md:hidden');

  const menuItems = [
    {
      title: 'Home',
      key: '/'
    },
    {
      title: 'Projects',
      key: '/projects'
    },
    {
      title: 'Contact',
      key: '/contact'
    },
  ];

  const pathname = window.location.pathname

  return (
    <div className="text-white font-mont fixed top-0 left-0 right-0 z-50 ">
      <div className={`flex bg-theme justify-between items-center p-2 shadow-lg ${showMenu === '' && 'md:flex-col'}`}>
        <div className="flex justify-between items-center w-full">
          <Link to={'/'}>
            <h1 className="text-4xl font-semibold hover:text-yellow-500 cursor-pointer">HG-M</h1>
          </Link>

          <FaBars
            className="md:flex lg:hidden xl:hidden 2xl:hidden cursor-pointer"
            onClick={() => {
              if (showMenu === 'md:hidden') {
                setShowMenu('')
              } else {
                setShowMenu('md:hidden')
              }
            }
            }
          />
        </div>
        <div className="flex md:hidden">
          {
            menuItems.map((item) => {
              return (
                <li className={`list-none mx-5 px-3 py-2 ${item.key === pathname && 'bg-white text-black rounded-md'}`}>
                  <Link to={`${item.key}`}> {item.title} </Link>
                </li>
              );
            })
          }
        </div>

        <div className={`mt-5 md:flex w-full items-start flex-col lg:hidden 2xl:hidden xl:hidden ${showMenu} `}>
          {
            menuItems.map((item) => {
              return (
                <li className={`list-none  my-2 p-1 ${item.key === pathname && 'bg-white text-black rounded-md px-5'}`}>
                  <Link to={`${item.key}`}> {item.title} </Link>
                </li>
              );
            })
          }
        </div>

      </div>
    </div>
  )
}

export default Header;