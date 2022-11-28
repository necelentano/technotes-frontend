import { store } from "../../app/store";
import { notesApiSlice } from "../notes/notesApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
  useEffect(() => {
    console.log("subscribing");
    // manual subscription to notes and users ===> notesApiSlice.endpoints.getNotes.initiate()
    // we use the slice, then we call the endpoints, than we call the query that we want(getNotes). initiate method creates manual subscription

    // This way we have access to state (notes & users) and it will not expire in 5 sec (or default 60 sec)
    // if we leave protected pages we will unsubscribe
    // We wrap protected pages with this Prefetch component
    // It also helps when we refresh the protected page and we still want to have state, including pre-filling our forms

    const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate());
    const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

    // in cleanup we use unsubscribe method
    // if we go to the unprotected pages it will unsubscribe
    return () => {
      console.log("unsubscribing");
      notes.unsubscribe();
      users.unsubscribe();
    };
  }, []);

  return <Outlet />;
};
export default Prefetch;
