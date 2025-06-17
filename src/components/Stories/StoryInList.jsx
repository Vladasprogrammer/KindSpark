export default function StoryInList({ story }) {

  // I don't even know if I will need this for the stories cards 
  var i = 0;
  function move() {
    if (i == 0) {
      i = 1;
      var elem = document.getElementById("myBar");
      var width = 10;
      var id = setInterval(frame, 10);
      function frame() {
        if (width >= 100) {
          clearInterval(id);
          i = 0;
        } else {
          width++;
          elem.style.width = width + "%";
          elem.innerHTML = width + "%";
        }
      }
    }
  }

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

      <div className="stories-list__story__card" style={{ backgroundImage: `url(${story.image})` }}>
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