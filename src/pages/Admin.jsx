import { useState, useEffect } from 'react';
import api from '../axios';

function Admin() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    api.get('/admin/stories')
      .then(res => setStories(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleStatusChange = (id, status) => {
    api.put(`/admin/stories/${id}/status`, { status })
      .then(() => {
        setStories(stories.map(story => 
          story.id === id ? {...story, status} : story
        ));
      })
      .catch(err => alert('Update failed'));
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Panel</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stories.map(story => (
            <tr key={story.id}>
              <td>{story.title}</td>
              <td>{story.author_name}</td>
              <td>{story.status}</td>
              <td>
                {story.status === 'pending' && (
                  <>
                    <button onClick={() => handleStatusChange(story.id, 'approved')}>
                      Approve
                    </button>
                    <button onClick={() => handleStatusChange(story.id, 'rejected')}>
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;