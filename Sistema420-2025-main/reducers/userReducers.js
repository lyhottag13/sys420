// Defines the initial state for the user reducer as an empty object.
const initialState = {};

/**
 * Updates the user state with the given object, effectively replacing the previous state.
 * 
 * @param {Object} state The current state before this update.
 * @param {Object} action The action object containing the new state for the user.
 * @param {Object} action.object The new state to be applied to the user.
 * @returns {Object} The updated state for the user.
 */
const updateUser = (state, {object}) => (object);

/**
 * Creates a reducer function that updates the state based on the received actions.
 * This function checks if the action type is handled within the provided handlers object;
 * if so, it calls the corresponding handler function with the current state and action.
 * 
 * @param {Object} handlers An object mapping action types to handler functions. Each handler is responsible for updating the state based on the action.
 * @returns {Function} A reducer function that takes the current state and an action as arguments and returns the new state.
 */
const createReducer = (handlers) => (state, action) => {
    if (!handlers.hasOwnProperty(action.type)) {
        return state;
    }
    return handlers[action.type](state, action);
};

// Maps the 'updateUser' function to its corresponding action type within the reducer.
const userReducerHandler = {
    updateUser
}

// Exports the UserReducer, which is composed of the reducer created with 'createReducer' function and the initial state.
export const UserReducer = [createReducer(userReducerHandler), initialState];
