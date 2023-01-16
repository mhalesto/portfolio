import { useEffect } from "react";
import Footer from "../footer";
import Header from "../header";

const Layout = ({ children }) => {
  useEffect(() => {
    window.scroll(0, 0)
  }, [])
  return (
    <div>
      <Header />

      <div className="content font-mont">
        {children}
      </div>

      <Footer />
    </div>
  )
}

export default Layout;