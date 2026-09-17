// src/components/Footer.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | success | error

  function handleSubscribe(e) {
    e.preventDefault()

    if (!email.trim()) {
      setStatus('error')
      return
    }

    // TODO: replace with real POST /api/newsletter once backend exists
    console.log('Subscribing:', email)
    setStatus('success')
    setEmail('')
  }

  return (
    <footer className="border-t px-6 py-10 md:px-12">
      {/* Brand identity */}

      <div className='flex flex-col gap-10 md:flex-row md:justify-between md:gap-6'>
        <div className="flex flex-col gap-2">
        <Link to="/">Logo</Link>
        <p>Short brand statement goes here.</p>
      </div>

      {/* Main navigation */}
      <nav aria-label="Footer navigation" className="flex flex-col gap-2">
        <Link to="/">Shop</Link>
        <Link to="/">Collections</Link>
        <Link to="/">New Arrivals</Link>
      </nav>

      {/* Customer/service links */}
      <nav aria-label="Customer service" className="flex flex-col gap-2">
        <Link to="/">Contact Us</Link>
        <Link to="/">Shipping & Returns</Link>
        <Link to="/">FAQs</Link>
        <Link to="/">Track Order</Link>
      </nav>

      {/* Social links */}
      <div className="flex gap-4">
        <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
      </div>
      </div>

      {/* Newsletter signup */}
      <div className="mt-10 flex flex-col gap-3 md:mt-8">
        <p>Subscribe for updates</p>
        <form
        onSubmit={handleSubscribe}
        className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status !== 'idle') setStatus('idle')
            }}
            required
            className="border px-3 py-2"
          />
          <button
          type="submit"
          className="border px-4 py-2"
          >
            Subscribe
        </button>
        </form>
        {status === 'success' && <p>Thanks — you're subscribed!</p>}
        {status === 'error' && <p>Please enter a valid email.</p>}
      </div>

      {/* Legal links */}
      <div className="mt-10 flex flex-col gap-3 border-t pt-6 text-sm md:flex-row
      md:items-center md:justify-between">
        <nav aria-label="Legal" className="flex gap-4">
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms of Service</Link>
        </nav>
     </div>
      {/* Copyright */}
      <p>&copy; {new Date().getFullYear()} Mens-Store. All rights reserved.</p>
    </footer>
  )
}

export default Footer