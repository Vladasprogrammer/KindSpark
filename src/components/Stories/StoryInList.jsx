export default function StoryInList({ story }) {


  return (
    <li className="stories-list__story">
      <div className="stories-list__story__top">
        <div className="stories-list__story__top__avatar">
          <img src={story.avatar} alt={story.username} />
        </div>
        <div className="stories-list__story__top__name">
          {story.username}
        </div>
        <div className="stories-list__story__top__date">
          {story.storyDate.split('T')[0]}
        </div>
      </div>

      <div className="stories-list__story__card" style={{"--story-image": `url(${story.image})` }}>
        <div className="stories-list__story__card__content">
          <div className="stories-list__story__card__content__title">
            {story.title}
          </div>
          <div className="stories-list__story__card__content__description">
            {story.description}
          </div>
          <button className="stories-list__story__card__content__button">
            Donate
          </button>
        </div>
      </div>

    </li>
  )
}