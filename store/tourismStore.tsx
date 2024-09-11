"use client";
import React, { createContext, useReducer, Dispatch} from "react";
import { ACTIONS } from "./actions";

const { 
    TOGGLE_SHOW_ENTRY,
    SET_PLACES_SCROLL_POS,
    TOGGLE_SHOW_ADVENTURES
} = ACTIONS;

type initialStateType = {
    currentLanding: 'home',
    showEntry: boolean,
    placesScrollPos: 'start' | 'middle' | 'end',
    showAdventures: boolean
}

const initialState: initialStateType = {
    currentLanding: 'home',
    showEntry: true,
    placesScrollPos: 'start',
    showAdventures: false
}

type actionType = {
    type: (typeof ACTIONS)[keyof typeof ACTIONS]
    payload?: any;
};

function reducer (state: initialStateType, action: actionType) {
    const {type, payload} = action;

    switch(type) {
        case TOGGLE_SHOW_ENTRY: {
            const finalState: initialStateType = {
                ...state,
                showEntry: payload
            }
            return finalState;
        }
        case SET_PLACES_SCROLL_POS: {
            const finalState: initialStateType = {
                ...state,
                placesScrollPos: payload
            }
            return finalState;
        }
        case TOGGLE_SHOW_ADVENTURES: {
            const finalState: initialStateType = {
                ...state,
                showAdventures: payload
            }
            return finalState;
        }
        default:
            return state;
    }
}

type TourismContextType = {
    state: initialStateType,
    dispatch: Dispatch<actionType>
}

export const TourismContext = createContext<TourismContextType>({
    state: initialState,
    dispatch: () => null
})

type TourismContextProviderProps = {
    children: React.ReactNode
}

export function TourismContextProvider({
    children
}: TourismContextProviderProps) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <TourismContext.Provider value={{state, dispatch}}>
            {children}
        </TourismContext.Provider>
    )
}