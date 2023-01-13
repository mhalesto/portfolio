import Footer from "../footer";
import Header from "../header";

const Layout = ({ children }) => {
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