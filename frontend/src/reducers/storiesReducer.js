import * as A from '../constants/action';


export default function storiesReducer(state, action) {

  let newState;

  switch (action.type) {
    case A.LOAD_POSTS_FROM_SERVER:
      if (null === state) {
        newState = action.payload;
      } else {
        newState = structuredClone(state);
        newState.push(...action.payload);
      }
      break;
    case A.ADD_NEW_POST:
      {
        newState = structuredClone(state);
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const date = yyyy + '/' + mm + '/' + dd;

        const newPost = {
          id: action.payload.postID,
          content: action.payload.text,
          postDate: date,
          votes: { l: [], d: [] },
          name: action.payload.user.name,
          avatar: action.payload.user.avatar,
          mainImage: action.payload.image.src
        }
        newState.unshift(newPost);
        break;
      }
    case A.POST_UUID_TO_ID:
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