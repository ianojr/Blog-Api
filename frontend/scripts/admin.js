const form = document.getElementById('postForm');
const statusDiv = document.getElementById('status');
const postsTableBody = document.getElementById('postsTableBody');
const loadingStatusDiv = document.getElementById('loadingStatus');

const apiUrl = 'http://localhost:8000/posts/';

let editingPostId = null; // Track if editing a post

// Fetch and display all posts
async function loadPosts() {
  postsTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-info py-4">Loading posts...</td></tr>';
  loadingStatusDiv.innerHTML = '';

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const posts = await response.json();

    postsTableBody.innerHTML = '';

    if (posts.length === 0) {
      postsTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No blog posts found. Add one above!</td></tr>';
      return;
    }

    posts.forEach(post => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${post.id}</td>
        <td>${post.title}</td>
        <td>${post.content.slice(0, 100)}${post.content.length > 100 ? '...' : ''}</td>
        <td><img src="${post.image}" alt="${post.title}" class="img-fluid" width="100"></td>
        <td>${new Date(post.date_added).toLocaleDateString()}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2" onclick="editPost(${post.id})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deletePost(${post.id})">Delete</button>
        </td>
      `;
      postsTableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Failed to load posts:', error);
    postsTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">Failed to load posts: ${error.message}</td></tr>`;
  }
}

// Submit form for Add or Update
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  statusDiv.innerHTML = '<p class="text-info">Processing...</p>';

  const postData = {
    title: document.getElementById('title').value,
    content: document.getElementById('content').value,
    image: document.getElementById('image').value,
    date_added: new Date().toISOString()
  };

  try {
    let response;
    if (editingPostId) {
      // Update existing post (PUT)
      response = await fetch(apiUrl + editingPostId + '/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
    } else {
      // Add new post (POST)
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
    }

    if (response.ok) {
      if (editingPostId) {
        statusDiv.innerHTML = '<p class="text-success">Post updated successfully!</p>';
        editingPostId = null;
        form.querySelector('button[type="submit"]').textContent = 'Add Post';
      } else {
        statusDiv.innerHTML = '<p class="text-success">Post added successfully!</p>';
      }
      form.reset();
      loadPosts();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save post');
    }
  } catch (error) {
    statusDiv.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
    console.error('Error saving post:', error);
  }
});

// Fill form for editing post
async function editPost(id) {
  statusDiv.innerHTML = '<p class="text-info">Loading post data...</p>';
  try {
    const response = await fetch(apiUrl + id + '/');
    if (!response.ok) throw new Error('Failed to fetch post');
    const post = await response.json();

    document.getElementById('title').value = post.title;
    document.getElementById('content').value = post.content;
    document.getElementById('image').value = post.image;

    editingPostId = id;
    statusDiv.innerHTML = '<p class="text-warning">Editing post ID ' + id + '</p>';
    form.querySelector('button[type="submit"]').textContent = 'Update Post';
  } catch (error) {
    statusDiv.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
  }
}

// Delete post
async function deletePost(id) {
  if (!confirm('Are you sure you want to delete this post?')) return;

  statusDiv.innerHTML = '<p class="text-info">Deleting post...</p>';

  try {
    const response = await fetch(apiUrl + id + '/', { method: 'DELETE' });
    if (response.ok) {
      statusDiv.innerHTML = '<p class="text-success">Post deleted successfully!</p>';
      // If editing deleted post, reset form
      if (editingPostId === id) {
        editingPostId = null;
        form.reset();
        form.querySelector('button[type="submit"]').textContent = 'Add Post';
      }
      loadPosts();
    } else {
      throw new Error('Failed to delete post');
    }
  } catch (error) {
    statusDiv.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
    console.error('Error deleting post:', error);
  }
}

// Expose functions globally so buttons can access them
window.editPost = editPost;
window.deletePost = deletePost;

// Load posts on page load
window.addEventListener('DOMContentLoaded', loadPosts);
