export default function StoryInList({ story }) {


  return (
    <li className="stories-list__story">
      <div className="stories-list__story__top">
        <div className="stories-list__story__top__avatar">
          <img src={story.avatar} alt={story.username} />
        </div>
        <div className="stories-list__story__top__user">
          {story.username}
        </div>
        <div className="stories-list__story__top__date">
          {story.storyDate.split('T')[0]}
        </div>
      </div>

      <div className="stories-list__story__image">
        <img src={story.image} alt="story image" />
      </div>
      <div className="stories-list__story__description">
        {story.description}
      </div>

      {/* Comments Yes or No? 
      I want to do them but not enough knowledge how I should do it,
      and if I would be able to do it.
      Should I do them?  */}
    </li>
  )
}