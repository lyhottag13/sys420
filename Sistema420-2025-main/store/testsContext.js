import React, { createContext, useContext, useReducer } from "react";
import { TestsReducer } from "../reducers/testsReducers";
import { updateParamsAction } from "../actions/actionTests";

// Context for storing and managing test data throughout the application.
export const TestsContext = createContext();

/**
 * Provides a context provider for test data, including functionalities to update
 * and select tests. It uses a reducer to manage the tests state.
 */
export const TestsProvider = props => {
    // Initializes test data state with the useReducer hook using the TestsReducer.
    const [state, dispatch] = useReducer(...TestsReducer);

    /**
     * Asynchronously fetches tests data based on provided search parameters and updates
     * the state with the new tests data.
     * @param {Object} params - The search parameters to fetch tests data.
     */
    const updateParams = async (params) => {
        try {
            // Fetches test data from the server using provided parameters.
            var response = await fetch('/api/tests?' + Object.keys(params).map(key => key + '=' + params[key]).join('&'), {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(await response);
            var json = await response.json();
            console.log(json);

            // Processes the fetched tests data before updating the state.
            // json = json.map((t) => ({...t, idle_time: new Date(0).toLocaleString(), test_time: new Date(0).toLocaleString(), elapsed_time: (t.end_datetime - t.start_datetime).toLocaleString()
            // }));
            json = json.map((t) => ({...t, idle_time: (t.idle_time).toLocaleString(), test_time: (t.test_time).toLocaleString(), elapsed_time: (t.elapsed_time).toLocaleString()
            }));

            // Prepares the updated tests data for the state.
            const current = {
                params, 
                ...(json[0] ? {selectedTest: json[0]} : {}),
                tests: json
            };

            // Updates the state with the new tests data.
            dispatch(updateParamsAction(current));
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Selects a test from the current list of tests in the state based on the provided index.
     * @param {number} index - The index of the test to select.
     */
    const selectTest = (index) => {
        // Updates the current state with the newly selected test.
        const current = {
            ...state,
            selectedTest: state.tests[index] || {},
        };

        // Dispatches the selection update to the state.
        dispatch(updateParamsAction(current));
    };

    const setSelectedTests = (selectedTests) => {
        // Actualiza el estado con los tests seleccionados
        const current = {
            ...state,
            selectedTests,
        };
        dispatch(updateParamsAction(current));
    };

    // Provides the tests context to its children components.
    return <TestsContext.Provider value={{
        currentSearch: state,
        updateParams,
        selectTest,
        toggleTestSelection: setSelectedTests // <-- agrega esto
    }} {...props} />;
};

// Custom hook to use the tests context in functional components.
export const useTestsStore = () => useContext(TestsContext);
