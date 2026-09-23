import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

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
} from './pages';

function App() {

  return (
     <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<Account />} />
        <Route path="/search" element={<Search />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
      </Routes>
    </MainLayout>
  )
}

export default App
