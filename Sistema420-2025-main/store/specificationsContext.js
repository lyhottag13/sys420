import React, {createContext, useContext, useReducer } from "react";
import { SpecificationsReducer } from "../reducers/specificationsReducers";
import { updateSpecificationsAction } from "../actions/actionSpecifications";

// Context created to share specifications data across components
export const SpecificationsContext = createContext();

/**
 * Context provider component that encapsulates logic for fetching, creating, and updating specifications.
 * Utilizes the useReducer hook for state management with specifications data.
 */
export const SpecificationsProvider = props => {
    // State and dispatch function initialized with the specifications reducer
    const [state, dispatch] = useReducer(...SpecificationsReducer);

    /**
     * Asynchronously fetches specifications based on provided parameters and updates state.
     * @param {Object} params - Parameters to query specifications.
     */
    const getSpecifications = async (params) => {
        try{
            // Fetches specifications using the provided query parameters
            const response = await fetch('/api/specifications?' + Object.keys(params).map(key => key + '=' + params[key]).join('&'), {
                method: 'GET', 
                headers:{
                'Content-Type': 'application/json'
                }
            });
            const specifications = await response.json();

            // Updates state with fetched specifications
            dispatch(updateSpecificationsAction(specifications));
        } catch(error){
            console.log(error);
        }
    }

    /**
     * Asynchronously fetches specifications by part number and application.
     * @param {string} pn - Part number to query specifications.
     * @param {string} application - Application to query specifications.
     * @returns {Object} Fetched specifications data.
     */
    const getSpecificationByPN = async (pn, application) => {
        try {
            // Construye la URL con los parámetros necesarios
            const response = await fetch(`/api/specifications?pn=${pn}&application=${application}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Verifica si la respuesta es válida
            if (!response.ok) {
                throw new Error('Failed to fetch specifications');
            }

            // Convierte la respuesta a JSON
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching specifications by PN:', error);
            throw error;
        }
    };

    /**
     * Asynchronously creates new specifications based on provided parameters and updates state.
     * @param {Object} params - Specifications data to be created.
     */
    const createSpecifications = async (params) => {
        try{
            // Posts new specifications data to the server
            const response = await fetch('/api/specifications', {
                method: 'POST', 
                body: JSON.stringify(params), 
                headers:{
                'Content-Type': 'application/json'
                }
            });
            const specifications = await response.json();

            // Checks for error in response and alerts accordingly
            if(specifications.error) return alert("Specifications sheet couldn't be created.");
            alert("Specifications sheet created.");
            
            // Updates state with new specifications
            dispatch(updateSpecificationsAction(specifications));
        } catch(error){
            console.log(error);
        }
    }

    /**
     * Asynchronously updates specifications based on provided parameters and updates state.
     * @param {Object} params - Updated specifications data.
     */
    const updateSpecifications = async (params) => {
        try{
            // Updates specifications data on the server
            const response = await fetch('/api/specifications', {
                method: 'PATCH', 
                body: JSON.stringify(params), 
                headers:{
                'Content-Type': 'application/json'
                }
            });
            const specifications = await response.json();

            // Checks for error in response and alerts accordingly
            if(specifications.error) return alert("Specifications sheet couldn't be updated.");
            alert("Specifications updated.");
            
            // Updates state with the updated specifications
            dispatch(updateSpecificationsAction(specifications));
        } catch(error){
            console.log(error);
        }
    }
    
    // Provides the specifications context to child components
    return (
        <SpecificationsContext.Provider
            value={{
                specifications: state,
                getSpecifications,
                createSpecifications,
                updateSpecifications,
                getSpecificationByPN, // Agregado aquí
            }}
            {...props}
        />
    );
};

/**
 * Custom hook to use the SpecificationsContext for accessing and manipulating specifications data.
 * @returns The context value including specifications data and action functions.
 */
export const useSpecificationsStore = () => useContext(SpecificationsContext);
