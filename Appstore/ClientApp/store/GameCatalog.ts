import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface CatalogState {
    isLoading: boolean;
    filter: string;
    catalog: CatalogEntry[];

}

export interface CatalogEntry {
    id: string;
    title: string;
    description: string;
    pictures: string[];
    
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestCatalogAction {
    type: 'REQUEST_CATALOG';
    filter: string;
}

interface ReceiveCatalogAction {
    type: 'RECEIVE_CATALOG';
    filter: string;
    catalog: CatalogEntry[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestCatalogAction | ReceiveCatalogAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestCatalog: (filter: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        console.log(getState());
        // Only load data if it's something we don't already have (and are not already loading)
        if (filter !== getState().catalogEntries.filter) {
            let fetchTask = fetch(`api/Catalog/Search?filter=${ filter }`)
                .then(response => response.json() as Promise<CatalogEntry[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_CATALOG', filter: filter, catalog: data });
                    
                });

            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
            dispatch({ type: 'REQUEST_CATALOG', filter: filter });

        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: CatalogState = { catalog: [], isLoading: false, filter: "" };

export const reducer: Reducer<CatalogState> = (state: CatalogState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_CATALOG':
            return {
                //startDateIndex: action.startDateIndex,
                catalog: state.catalog,
                filter: action.filter,
                isLoading: true
            };
        case 'RECEIVE_CATALOG':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.           
            if (action.filter === state.filter) {
                return {                    
                    //startDateIndex: action.startDateIndex,
                    catalog: action.catalog,
                    filter: action.filter,
                    isLoading: false
                };
            }
            break;
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
