import React, {
  createContext, ReactElement, useEffect, useState
} from 'react';
import { IAuhResponseModel } from '../models/auth-models';
import { IEmployee } from '../models/employee-models';
import authService from '../services/auth.service';

export type AppContextState = {
  auth: IAuhResponseModel | null;
  initializing: boolean;
  selectedEmployee: IEmployee | null;
};

export type AppContext = {
  state: AppContextState;
  setState: (state: any) => void;
};

export const initialContextState: AppContextState = {
  initializing: false,
  selectedEmployee: null,
  auth: null
};

export const AppContext = createContext<AppContext>({
  state: initialContextState,
  setState: () => { }
});

const AppStateProvider = (props: { children: Array<ReactElement> | ReactElement }) => {

  const [state, setState] = useState(initialContextState);

  useEffect(() => {
    setState((prevState: AppContextState) => ({
      ...prevState,
      initializing: true
    }));
    (async () => {
      const auth = await authService.getTokenFromStorage();
      setState((prevState: AppContextState) => ({
        ...prevState,
        auth: auth,
        initializing: false
      }));
    })();
  }, []);


  const store = {
    state,
    setState
  };

  return (
    <AppContext.Provider value={store}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppStateProvider;