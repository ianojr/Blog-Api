const apiUrl = 'http://localhost:8000/posts/';

// CAROUSEL
const carouselInner = document.getElementById('carousel-inner');
const carouselIndicators = document.getElementById('carousel-indicators');

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(posts => {
        // Sort posts by most recent
        posts.sort((a, b) => new Date(b.date_added) - new Date(a.date_added));

        // Only use the 3 most recent posts for the carousel
        const recentPosts = posts.slice(0, 3);

        if (recentPosts.length === 0) {
            carouselInner.innerHTML = '<p class="text-danger text-center mt-5">No recent posts available for carousel.</p>';
            return;
        }

        recentPosts.forEach((post, index) => {
            // Create carousel item
            const item = document.createElement('div');
            item.className = `carousel-item${index === 0 ? ' active' : ''}`;
            item.innerHTML = `
                <img src="${post.image}" class="d-block w-100" alt="${post.title}">
                <div class="carousel-caption d-none d-md-block">
                    <h5 class="text-white display-4 fw-bolder">${post.title}</h5>
                    <p class="text-white-75">${post.content.slice(0, 100)}...</p>
                </div>
            `;
            carouselInner.appendChild(item);

            // Create indicator
            const indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.setAttribute('data-bs-target', '#carouselExampleIndicators');
            indicator.setAttribute('data-bs-slide-to', index);
            indicator.setAttribute('aria-label', `Slide ${index + 1}`);
            if (index === 0) {
                indicator.className = 'active';
                indicator.setAttribute('aria-current', 'true');
            }
            carouselIndicators.appendChild(indicator);
        });
    })
    .catch(error => {
        console.error('Error loading carousel:', error);
        carouselInner.innerHTML = '<p class="text-danger text-center mt-5">Failed to load carousel items. Please check the API URL or server status.</p>';
    });


// POSTS
const postsContainer = document.getElementById('post-container');

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(posts => {
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="text-info text-center mt-5 w-100">No blog posts available yet.</p>';
            return;
        }

        posts.forEach(post => {
            const cardCol = document.createElement('div');
            cardCol.className = 'col'; // Bootstrap grid column
            
            cardCol.innerHTML = `
                <div class="card h-100">
                    <img src="${post.image}" class="card-img-top" alt="${post.title}">
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${post.content.slice(0, 150)}...</p>
                    </div>
                    <div class="card-footer text-muted">
                        Posted on: ${new Date(post.date_added).toLocaleDateString()}
                    </div>
                </div>
            `;
            postsContainer.appendChild(cardCol);
        });
    })
    .catch(error => {
        postsContainer.innerHTML = '<p class="text-danger text-center mt-5 w-100">Failed to load posts. Please check the API URL or server status.</p>';
        console.error('Error fetching posts:', error);
    });