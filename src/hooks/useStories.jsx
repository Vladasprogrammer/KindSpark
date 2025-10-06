import { useEffect, useReducer, useState } from "react";
import * as C from '../constants/main';
import * as A from '../constants/action';
import axios from 'axios';
import storiesReducer from "../reducers/storiesReducer";

export default function useStories() {

  const [stories, dispatchStories] = useReducer(storiesReducer, null);

  const [storyUpdate, setStoryUpdate] = useState(null);

  const [storyStore, setStoryStore] = useState(null);

  useEffect(_ => {
    if (null === storyStore) {
      return;
    }
    axios.post(C.SERVER_URL + '/new-story', storyStore, { withCredentials: true })
    .then(res => {
      console.log(res.data);
      dispatchStories({
        type: A.STORY_UUID_TO_ID,
        payload: {
          id: res.data.id,
          uuid: res.data.uuid,
        }
      })
    })
    .catch(err => {
      console.log(err);
    });
  }, [storyStore]);

  useEffect(_ => {
    if (null === storyUpdate) {
      return;
    }
    axios.post(C.SERVER_URL + 'stories/update/' + storyUpdate.id, {
      type: storyUpdate.type,
      payload: storyUpdate.payload ?? null
    }, { withCredentials: true })
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
  }, [storyUpdate]);
  
  useEffect(_ => {
    axios.get(C.SERVER_URL + 'stories/load-stories/1')
    .then(res => {
      dispatchStories({
        type: A.LOAD_STORIES_FROM_SERVER,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  return { stories, dispatchStories, setStoryUpdate, setStoryStore };
}