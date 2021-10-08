
import '../styles/auth.scss'
import { useAuth } from '../hooks/useAuth';

export function UserProfile() {

        const { user } = useAuth()

    return (
        <div id="page-auth">
        
        <h1>olá {user?.name}</h1>
           
        </div>
    )
}