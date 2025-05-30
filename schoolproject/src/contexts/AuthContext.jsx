import { createContext, useEffect, useState, useContext, use } from "react";
import { supabase } from "../supabase";

const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(undefined)

    
    const signUpNewUser = async (email, password) => {
        const {data, error} = await supabase.auth.signUp ({
            email: email,
            password: password,
      
        });

        if(error) {
            console.error("there was a problem signing up: ", error);
            return { success: false, error };
        }
        return { success: true, data};
    };

    const signInUser = async (email, password) => {
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error) {
                console.error("sign in error occurred: ", error);
                return {success: false, error: error.message};
            }

            return {success: true, data};
        } catch (error) {
            console.error("an error occured: ", error);
        }
    };

    useEffect (() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);


    //Sign Out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("there was an error: ", error);
        } else {
          window.location.href = "/login"; // forces refresh & ensures protection
        }
      };

    return(
        <AuthContext.Provider value={{session, signUpNewUser, signInUser, signOut}}>
            {children}
        </AuthContext.Provider>
    );
};

export const userAuth = () => {
    return useContext(AuthContext);
};