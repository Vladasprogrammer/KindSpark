import React, { useEffect, useState } from 'react';
import api from '../axios';

function AdminDashboard() {
  const [stories, setStories] = useState([]);
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null); 

  useEffect(() => {
    api.get('/admin')
      .then(response => {
        console.log("ADMIN STORIES RESPONSE:", response.data);
        setStories(response.data);
      })
      .catch(error => setError('Failed to fetch stories'));

    api.get('/admin/donations')
      .then(response => setDonations(response.data))
      .catch(error => setError('Failed to fetch donations'));
  }, []);

  const handleApprove = (id) => {
    api.put(`/admin/${id}/approve`)
      .then(response => {
        setError(null); 
        alert('Story approved');
      })
      .catch(error => setError('Failed to approve story'));
  };

  const handleReject = (id) => {
    api.put(`/admin/${id}/reject`)
      .then(response => {
        setError(null);
        alert('Story rejected');
      })
      .catch(error => setError('Failed to reject story'));
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>} 

      <h2>Active Stories</h2>
      <ul>
        {stories.map(story => (
          <li key={story.id}>
            {story.title} - {story.status}
            <button onClick={() => handleApprove(story.id)}>Approve</button>
            <button onClick={() => handleReject(story.id)}>Reject</button>
          </li>
        ))}
      </ul>

      <h2>Donations</h2>
      <ul>
        {donations.map(donation => (
          <li key={donation.id}>
            {donation.donor_email} donated {donation.amount} to {donation.story_title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
