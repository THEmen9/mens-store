import Header from '../components/Header'

function MainLayout({ children }) {
  return <>
      <Header />
      {children}
    </>
}

export default MainLayout