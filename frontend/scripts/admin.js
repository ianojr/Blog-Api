function editPost(id) {
    const newTitle = prompt("Enter new title:");
    const newContent = prompt("Enter new content:");
    const newImage = prompt("Enter new image URL:");

    if (!newTitle || !newContent || !newImage) {
        alert("All fields are required to update the post.");
        return;
    }

    const updatedPost = {
        title: newTitle,
        content: newContent,
        image: newImage
    };

    fetch(`${apiUrl}${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify(updatedPost)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to update post.");
        }
        return response.json();
    })
    .then(data => {
        alert("Post updated successfully!");
        loadPosts();
    })
    .catch(error => {
        console.error("Error updating post:", error);
        alert("An error occurred while updating the post.");
    });
}

function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    fetch(`${apiUrl}${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            alert("Post deleted successfully.");
            loadPosts();
        } else {
            throw new Error("Failed to delete post.");
        }
    })
    .catch(error => {
        console.error("Error deleting post:", error);
        alert("An error occurred while deleting the post.");
    });
}
