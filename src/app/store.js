import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

// Case.
// What if the list of data opens on more than one user's screen or more than one staff member and we might get stale data after it's open for a while?
// In this case we want to refresh the data in state sporadically or with interval that we can control.
// We can do this with RTK Query.
// 1. Import setupListeners
// 2. Call setupListeners and pass store.dispatch as parameter.
// It's enable some things that we can use now with our queries in the UsersList and NotesList.
// Now we can pass some options to our useGetUsersQuery and useGetNotesQuery hooks

// Options:
// pollingInterval - set interval in milliseconds (in our case 60000 or 15000) so every interval it will re-query the data
// refetchOnFocus - if we put the focus on another OS window and come back to our browser window we refetch the data
// refetchOnMountOrArgChange - if we remount our component we refetch the data

setupListeners(store.dispatch);
// https://redux-toolkit.js.org/rtk-query/api/setupListeners
