import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'

import {
  Account,
  Cart,
  Collections,
  Home,
  NewArrivals,
  Shop,
  Wishlist,
  Search,
  ProductDetails,
  Checkout,
  Login,
  Register,
} from './pages';

function App() {

  return (
     <MainLayout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/search" element={<Search />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path='/register' element= {<Register />}/>
      </Routes>
    </MainLayout>
  )
}

export default App
