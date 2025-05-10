import * as A from '../constants/action';


export default function storiesReducer(state, action) {

  let newState;

  switch (action.type) {
    case A.LOAD_STORIES_FROM_SERVER:
      if (null === state) {
        newState = action.payload;
      } else {
        newState = structuredClone(state);
        newState.push(...action.payload);
      }
      break;
    case A.ADD_NEW_STORY:
      {
        newState = structuredClone(state);
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const date = `${yyyy}/${mm}/${dd}`;

        const newStory = {
          id: action.payload.storyID,
          title: action.payload.text,
          image: action.payload.image,
          description: action.payload.text,
          user_id: action.payload.user_id,
          goal_amount: action.payload.goal_amount,
          current_amount: action.payload.current_amount,
          status: action.payload.status,
          created_at: date,
        }
        newState.unshift(newStory);
        break;
      }
    case A.STORY_UUID_TO_ID:
      {
        newState = structuredClone(state);
        const uuidPost = newState.find(p => p.id === action.payload.uuid);
        if (!uuidPost) {
          break;
        }
        uuidPost.id = action.payload.id;
        break;
      }
    default: newState = state;
      break;
  }
  return newState;
}