import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import NewNoteForm from "./NewNoteForm";

const NewNote = () => {
  const users = useSelector(selectAllUsers); // selectAll memoized query always returns an array. If there are no users it will return an empty array

  // check if array is empty
  if (!users?.length) return <p>Not Currently Available</p>;

  const content = <NewNoteForm users={users} />;

  return content;
};
export default NewNote;
