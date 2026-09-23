import { useState } from 'react'
import { Link, useNavigate  } from 'react-router-dom'
import { Button, Input } from '../components/ui'
import { useAuth } from '../context/AuthContext'

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })

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
            await register(formData)
            navigate('/account')
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
            Create account
            </h1>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
            Create an account to manage your orders and preferences.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <Input
                label="Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
            />

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
                placeholder="Create a password"
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
                {loading ? 'Creating account...' : 'Create account'}
            </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{' '}
            <Link
            to="/login"
            className="text-neutral-900 underline underline-offset-4"
            >
            Login
            </Link>
        </p>
    </section>
</main>
  )
}

export default Register