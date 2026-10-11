
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../footer";
import Header from "../header";
import { titleForPath } from "../../site/routeTitle";

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  useEffect(() => {
    const title = titleForPath(pathname);
    if (title) document.title = title;
  }, [pathname])

  return (
    <div className="legacy">
      <Header />

      <div className="content font-mont">
        {children}
      </div>

      <Footer />
    </div>
  )
}

export default Layout;
