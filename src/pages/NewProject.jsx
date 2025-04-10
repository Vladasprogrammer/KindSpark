import React, { useState } from 'react';
import api from '../axios'
import { useNavigate } from 'react-router';

function NewProject() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    goal_amount: '',
    image: null
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('goal_amount', form.goal_amount);
    if (form.image) formData.append('image', form.image);

    api.post('/stories', formData)
      .then(() => navigate('/projects'))
      .catch(err => alert('Error creating story'));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create New Story</h1>
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({...form, title: e.target.value})}
        required
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({...form, description: e.target.value})}
        required
      />
      <input
        type="number"
        placeholder="Goal Amount"
        value={form.goal_amount}
        onChange={(e) => setForm({...form, goal_amount: e.target.value})}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setForm({...form, image: e.target.files[0]})}
      />
      <button type="submit">Submit Story</button>
    </form>
  );
}

export default NewProject;
