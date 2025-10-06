import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

export default function NewStory() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    goal_amount: '',
    image: null
  });
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('goal_amount', form.goal_amount);
    if (form.image) formData.append('image', form.image);

    axios.post('/stories', formData)
      .then(() => navigate('/stories'))
      .catch(err => alert('Nea, kazkas nepavyko'));
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h1>Create New Story</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Story Title</label>
          <input
            className="title"
            name="title"
            type="text"
            placeholder="Your title here"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <label htmlFor="desc">Your Story</label>
          <textarea
            className="description"
            name="desc"
            placeholder="Add your story here"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <label htmlFor="goal-amount">Goal Amount</label>
          <input
            className="goal-amount"
            name="goal-amount"
            type="number"
            placeholder="Enter number"
            value={form.goal_amount}
            onChange={(e) => setForm({ ...form, goal_amount: e.target.value })}
            required
          />
          <label htmlFor="add-image">Add an image</label>
          <input
            className="add-image"
            name="add-image"
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />
          <button className="submit-story" type="submit">Create story</button>
        </form>
      </div>
    </div>
  );
}

