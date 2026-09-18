import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileBottomNav from '../components/MobileBottomNav'
import MobileNav from '../components/MobileNav'


function MainLayout({ children }) {
  return <>
    <Header />
    <MobileNav/>
    {children}
    <Footer />
    <MobileBottomNav />
    </>
}

export default MainLayout