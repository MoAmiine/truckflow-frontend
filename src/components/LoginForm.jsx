import { useState } from "react";
import { apiRequest } from "../services/api";


function LoginForm({onlogin}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!email.trim() || !password.trim()){
            setError('Veuillez remplir tous les champs');
            return;
        }
        setIsLoading(true)
        setError(null)
        try{
            const data = await apiRequest('/auth/login', {method: 'POST', body: JSON.stringify({email, password})})
            if(onlogin){
                onlogin(data)
            }

        }catch(err){
            setError(err.message)
        }finally{
            setIsLoading(false)
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="error-text">{error}</p>}
            <button type="submit" disabled={isLoading}>submit</button>
        </form>
    );
}

export default LoginForm;
