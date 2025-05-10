import { useContext } from "react";
import Data from "../../contexts/Data";
import StoryInList from "./StoryInList";

export default function StoriesList() {
  const {stories} = useContext(Data);

  if (null === stories) {
    return (
      <div className="bin">
        <h1>Stories loading...</h1>
      </div>
    )
  }
  
  return (
    <div className="bin">
      <h1>Kindspark</h1>
      <ul className="stories-list">
        {
          stories.map(s => <StoryInList key={s.id} story={s} />)
        }
      </ul>
    </div>
  );
};