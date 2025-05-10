import { createContext } from "react";
import useUsers from "../hooks/useUsers";
import useStories from "../hooks/useStories";

const Data = createContext();

export const DataProvider = ({ children }) => {

  const {users, dispatchUsers} = useUsers();
  const {stories, dispatchStories} = useStories();
  
  return (
    <Data.Provider value={{
      users, dispatchUsers,
      stories, dispatchStories
    }}>
      { children }
    </Data.Provider>
  )
}
export default Data;