// Initial state with empty parameters and an empty tests array.
const initialState = {params: {}, tests: []};

/**
 * Updates the state parameters with the given object.
 * 
 * @param {Object} state The current state before this update.
 * @param {Object} action The action object containing the new parameters.
 * @param {Object} action.object The new parameters to update the state with.
 * @returns {Object} The updated state with new parameters.
 */
const updateParams = (state, {object}) => (object);

/**
 * Creates a reducer function for handling state updates based on actions and their types.
 * 
 * @param {Object} handlers An object mapping action types to handler functions that should be called when an action of that type is dispatched.
 * @returns {Function} A reducer function that takes the current state and an action as arguments, and returns the new state.
 */
const createReducer = (handlers) => (state, action) => {
    if (!handlers.hasOwnProperty(action.type)) {
        return state;
    }
    return handlers[action.type](state, action);
};

// Maps the 'updateParams' function to its corresponding action type.
const testsReducerHandler = {
    updateParams
}

// Exports the TestsReducer composed of the reducer created with 'createReducer' function and the initial state.
export const TestsReducer = [createReducer(testsReducerHandler), initialState];
