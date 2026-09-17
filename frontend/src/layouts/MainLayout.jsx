import Header from '../components/Header'
import Footer from '../components/Footer'


function MainLayout({ children }) {
  return <>
      <Header />
      {children}
       <Footer />
    </>
}

export default MainLayout