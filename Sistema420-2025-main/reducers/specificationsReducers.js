// Defines the initial state for the reducer as an empty object.
const initialState = {};

/**
 * Updates the specifications in the state with new values from the action object.
 * Adds formatted revision_date and revision_time based on the revision_datetime.
 * 
 * @param {Object} state The current state before this update.
 * @param {Object} action The action object containing the specifications to update.
 * @param {Object} action.object The object containing the new specifications and potentially a revision_datetime.
 * @returns {Object} The updated state with new specifications, revision_date, and revision_time.
 */
const updateSpecifications = (state, {object}) => ({
    ...object, 
    revision_date: object.revision_datetime && object.revision_datetime.slice(0 ,10), 
    revision_time: object.revision_datetime && object.revision_datetime.slice(11,19)
});

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

// Maps the 'updateSpecifications' function to its corresponding action type.
const specificationsReducerHandler = {
    updateSpecifications
}

// Exports the SpecificationsReducer composed of the reducer created with 'createReducer' function and the initial state.
export const SpecificationsReducer = [createReducer(specificationsReducerHandler), initialState];
