import NewNoteForm from "./NewNoteForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { PulseLoader } from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

// import { useSelector } from "react-redux";
// import { selectAllUsers } from "../users/usersApiSlice";

const NewNote = () => {
  useTitle("techNotes: New Note");
  //const users = useSelector(selectAllUsers); // selectAll memoized query always returns an array. If there are no users it will return an empty array

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      // ids is iterable, entities is not => map through ids and get users data from entities
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  // check if array is empty
  if (!users?.length) return <PulseLoader color={"#FFF"} />;

  const content = <NewNoteForm users={users} />;

  return content;
};
export default NewNote;
