import React, {createContext, useContext, useReducer } from "react";
import { UserReducer } from "../reducers/userReducers";
import { updateUserAction } from "../actions/actionUsers";

// Creates a React context for user information accessible across the component tree.
export const UserContext = createContext();

/**
 * UserProvider wraps child components to provide them access to the user context,
 * including the current user state and functions to modify it such as login, signup, and logout.
 */
export const UserProvider = props => {
    // Initializes the user state using the reducer pattern provided by UserReducer.
    const [state, dispatch] = useReducer(...UserReducer);

    /**
     * Attempts to log in a user with specified credentials. Upon success, the user's information
     * is stored in the state.
     * @param {Object} params - The login credentials.
     */
    const login = async (params) => {
        try{
            const response = await fetch('/api/user?' + Object.keys(params).map(key => key + '=' + params[key]).join('&'), {
                method: 'GET', 
                headers:{
                    'Content-Type': 'application/json'
                }
            });
            const user = await response.json();

            dispatch(updateUserAction(user));
        } catch(error){
            console.log(error);
        }
    }

    /**
     * Registers a new user with the provided information. Upon success, the new user's information
     * is stored in the state.
     * @param {Object} params - The user's sign-up information.
     */
    const signup = async (params) => {
        try{
            const response = await fetch('/api/user', {
                method: 'POST', 
                body: JSON.stringify(params), 
                headers:{
                    'Content-Type': 'application/json'
                }
            });
            const user = await response.json();

            dispatch(updateUserAction(user));
        } catch(error){
            console.log(error);
        }
    }

    /**
     * Logs out the current user by clearing the user state.
     */
    const logout = (params) => {
        try{
            dispatch(updateUserAction({}));
        }
        catch(error){
            console.log(error);
        }
    }

    // Renders the provider component that passes down the user state and operations to child components.
    return <UserContext.Provider value={{user: state, login, signup, logout}} {...props} />;
};

// Custom hook to facilitate the use of the user context in other components.
export const useUserStore = () => useContext(UserContext);
