import { createContext, use, useContext, useState } from "react";
import { apiRequest } from "../services/api";

const AuthContext = createContext(null)

export function AuthProvider({ children }){
    const [session, setSession] = useState(null)

    const login = (result) => {
        setSession(result.data)
    }

    const logout = async () => {
        try{
            if(session?.accessToken){
                await apiRequest('/auth/logout', { method: 'POST', token: session?.accessToken })
            }
        }catch(error){
                console.error(error)
            }finally{
                setSession(null)
            }
    }
    
    return(
        <AuthContext.Provider value={{session, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext)
    return context
}