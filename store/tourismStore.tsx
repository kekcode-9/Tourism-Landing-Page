"use client";
import React, { createContext, useReducer, Dispatch} from "react";
import { ACTIONS } from "./actions";

const { TOGGLE_NAV } = ACTIONS;

type initialStateType = {
    showNav: boolean,
    currentLanding: 'home'
}

const initialState: initialStateType = {
    showNav: false,
    currentLanding: 'home'
}

type actionType = {
    type: (typeof ACTIONS)[keyof typeof ACTIONS]
    payload?: any;
};

function reducer (state: initialStateType, action: actionType) {
    const {type, payload} = action;

    switch(type) {
        case TOGGLE_NAV: {
            const finalState: initialStateType = {
                ...state,
                showNav: payload
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