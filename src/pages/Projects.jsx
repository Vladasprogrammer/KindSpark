import React, { useEffect, useState } from 'react';
import api from '../axios';

function Projects() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    api.get('/stories')
      .then(res => {
        console.log('Received data:', res.data);
        setStories(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <div className="projects-list">
      {stories.map(story => (
        <div key={story.id} className="story-card">
          <img src={story.image} alt={story.title} />
          <h3>{story.title}</h3>
          <p>{story.description}</p>
          <div className="progress-bar">
            <div
              style={{ width: `${(story.current_amount / story.goal_amount) * 100}%` }}
            ></div>
          </div>
          <p>${story.current_amount} of ${story.goal_amount} raised</p>

          {story.status !== 'completed' && (
            <form onSubmit={e => {
              e.preventDefault();
              const amount = e.target.elements.amount.value;
              console.log(amount);
              const name = e.target.elements.name.value || 'Anonymous';
              console.log(name);
              api.post(`/stories/${story.id}/donate`, { amount, donorName: name }, { withCredentials: true })
                .then(() => alert('Donation successful!'))
                .catch(err => alert('Donation failed'));
            }}>
              <input type="number" name="amount" placeholder="Amount" required />
              <input type="text" name="name" placeholder="Your name (optional)" />
              <button type="submit">Donate</button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}

export default Projects;
