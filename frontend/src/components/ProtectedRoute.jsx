import { Navigate, useLocation  } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
    const location = useLocation()
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return null
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{
                from: location.pathname + location.search,
                }}
                replace
            />
        )
    }
    return children
}

export default ProtectedRoute