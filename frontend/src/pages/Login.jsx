import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Input } from '../components/ui'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const location = useLocation()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      await login(formData)
      const redirectTo = location.state?.from || '/'
      navigate(redirectTo)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="px-4 py-12 md:px-8 md:py-16">
      <section className="mx-auto max-w-md">
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-neutral-500">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">
            Welcome back
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Sign in to continue to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-neutral-900 underline underline-offset-4"
          >
            Create account
          </Link>
        </p>
      </section>
    </main>
  )
}

export default Login