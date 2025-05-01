  // Global variables
     let allPosts = [];
     let filteredPosts = [];
     let currentIndex = 0;
     let pageSize = 10;
     let isLoading = false;
 
     // Show message to user
     function showMessage(message, type = 'info') {
       const messageContainer = document.getElementById('messageContainer');
       messageContainer.innerHTML = `<div class="${type}-message message">${message}</div>`;
 
       // Auto-hide success messages after 5 seconds
       if (type === 'success') {
         setTimeout(() => {
           if (messageContainer.innerHTML.includes(message)) {
             messageContainer.innerHTML = '';
           }
         }, 5000);
       }
     }
 
     // Clear messages
     function clearMessages() {
       document.getElementById('messageContainer').innerHTML = '';
     }
 
     // Show loading indicator
     function showLoading() {
       isLoading = true;
       document.getElementById('postsContainer').innerHTML = '<div class="loading">Loading data...</div>';
     }
 
     // Hide loading indicator
     function hideLoading() {
       isLoading = false;
       const loadingElement = document.getElementById('postsContainer').querySelector('.loading');
       if (loadingElement && document.getElementById('postsContainer').children.length === 1) {
         document.getElementById('postsContainer').innerHTML = '';
       }
     }
 
     // Fetch company details from RapidAPI
     async function fetchCompanyDetails(company, useBackupKey = false) {
       // Skip company validation if configured to do so
       if (config.requestOptions.skipCompanyValidation) {
         console.log('Skipping company validation as configured');
         return { success: true };
       }
 
       const apiKey = useBackupKey ? config.rapidApiKeys.backup : config.rapidApiKeys.primary;
 
       const options = {
         method: 'GET',
         headers: {
           'X-RapidAPI-Key': apiKey,
           'X-RapidAPI-Host': config.endpoints.rapidApi.host
         }
       };
 
       try {
         console.log(`Fetching company details for: ${company}`);
         const response = await fetch(`${config.endpoints.rapidApi.companyDetails}?linkedin_url=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2F${encodeURIComponent(company)}`, options);
 
         if (!response.ok) {
           throw new Error(`API responded with status: ${response.status}`);
         }
 
         const data = await response.json();
         console.log('Company details response:', data);
         return data;
       } catch (error) {
         console.error('Error fetching company details:', error);
 
         // If using primary key failed, try with backup key
         if (!useBackupKey) {
           console.log('Trying with backup API key...');
           return fetchCompanyDetails(company, true);
         }
 
         // Return a success object to allow the process to continue
         return { success: true };
       }
     }
 
     // Simplified fetch with retry and fallback mechanism
     async function fetchWithRetry(url, options = {}, retryCount = 0, useBackupEndpoint = false, useBackupKey = false) {
       // Determine which URL to use
       const currentUrl = useBackupEndpoint ? config.endpoints.postsApiBackup : url;
 
       // Use backup API key if specified
       if (useBackupKey && options.headers && options.headers['X-RapidAPI-Key']) {
         options = {
           ...options,
           headers: {
             ...options.headers,
             'X-RapidAPI-Key': config.rapidApiKeys.backup
           }
         };
         console.log('Using backup API key');
       }
 
       try {
         if (config.requestOptions.debugMode) {
           console.log(`Fetching from ${currentUrl} (attempt ${retryCount + 1})`);
           console.log('Request options:', JSON.stringify(options));
         }
 
         const response = await fetch(currentUrl, options);
 
         if (!response.ok) {
           throw new Error(`API responded with status: ${response.status}`);
         }
 
         // Get the response text first to check if it's valid JSON
         const responseText = await response.text();
 
         if (config.requestOptions.debugMode) {
           console.log('API response text:', responseText.substring(0, 200) + '...');
         }
 
         // Try to parse the JSON
         let data;
         try {
           data = JSON.parse(responseText);
         } catch (jsonError) {
           console.error('JSON parsing error:', jsonError);
           throw new Error(`Invalid JSON response: ${jsonError.message}`);
         }
 
         if (config.requestOptions.debugMode) {
           console.log('API response parsed:', data);
         }
 
         // Check if the response has empty posts array
         if (data && (!data.posts || (Array.isArray(data.posts) && data.posts.length === 0))) {
           console.log('API returned empty posts array');
 
           // Try backup endpoint if primary fails and we haven't tried it yet
           if (!useBackupEndpoint && config.endpoints.postsApiBackup) {
             console.log('Trying backup endpoint...');
             return fetchWithRetry(url, options, 0, true, useBackupKey);
           }
 
           // If we've tried both endpoints and still got empty posts, use mock data
           if (config.requestOptions.useMockDataOnFailure) {
             console.log('Using mock data as fallback');
             return {
               ...config.sampleData,
               company: new URL(currentUrl).searchParams.get('company') || 'Unknown Company'
             };
           }
         }
 
         return data;
       } catch (error) {
         console.error(`Attempt ${retryCount + 1} failed:`, error);
 
         // Try backup API key if primary fails
         if (!useBackupKey && options.headers && options.headers['X-RapidAPI-Key']) {
           console.log('Trying with backup API key...');
           return fetchWithRetry(url, options, retryCount, useBackupEndpoint, true);
         }
 
         // Try backup endpoint if primary fails and we haven't tried it yet
         if (!useBackupEndpoint && config.endpoints.postsApiBackup) {
           console.log('Trying backup endpoint...');
           return fetchWithRetry(url, options, 0, true, useBackupKey);
         }
 
         // Retry if we haven't reached the maximum retry attempts
         if (retryCount < config.requestOptions.retryAttempts - 1) {
           console.log(`Retrying... (${retryCount + 1}/${config.requestOptions.retryAttempts})`);
 
           // Wait before retrying
           await new Promise(resolve => setTimeout(resolve, config.requestOptions.retryDelay));
 
           return fetchWithRetry(url, options, retryCount + 1, useBackupEndpoint, useBackupKey);
         }
 
         // If all retries failed, try the mock API
         try {
           console.log('Trying mock API as last resort...');
           const mockResponse = await fetch(config.endpoints.mockApi);
 
           if (!mockResponse.ok) {
             throw new Error(`Mock API responded with status: ${mockResponse.status}`);
           }
 
           const mockData = await mockResponse.json();
           console.log('Mock API response:', mockData);
 
           // Convert JSONPlaceholder format to our expected format
           if (Array.isArray(mockData) && mockData.length > 0 && mockData[0].title) {
             console.log('Converting JSONPlaceholder data to our format');
             return {
               posts: mockData.slice(0, 10).map(post => {
                 const date = new Date();
                 date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
 
                 return {
                   text: post.title + "\n\n" + post.body,
                   date: date.toISOString().split('T')[0],
                   author: { name: "Company Official", company_url: "#" },
                   stats: {
                     total_reactions: Math.floor(Math.random() * 500),
                     like: Math.floor(Math.random() * 300),
                     love: Math.floor(Math.random() * 50),
                     celebrate: Math.floor(Math.random() * 30),
                     insight: Math.floor(Math.random() * 20),
                     support: Math.floor(Math.random() * 20),
                     comments: Math.floor(Math.random() * 100),
                     reposts: Math.floor(Math.random() * 50)
                   },
                   post_url: "#"
                 };
               })
             };
           }
 
           return mockData;
         } catch (mockError) {
           console.error('Mock API failed:', mockError);
 
           // If even the mock API fails, use the sample data
           if (config.requestOptions.useMockDataOnFailure) {
             console.log('Using sample data as final fallback');
             return {
               ...config.sampleData,
               company: new URL(url).searchParams.get('company') || 'Unknown Company'
             };
           }
 
           throw error; // Re-throw the original error if we don't want to use mock data
         }
       }
     }
 
     // Fetch posts from API
     async function fetchPosts() {
       const company = document.getElementById('companyInput').value.trim().toLowerCase();
 
       if (!company) {
         showMessage('Please enter a company name', 'error');
         return;
       }
 
       // Prevent multiple simultaneous requests
       if (isLoading) {
         console.log('Already loading, request ignored');
         return;
       }
 
       clearMessages();
       showLoading();
       showMessage(`Fetching posts for "${company}"...`, 'info');
       currentIndex = 0;
 
       try {
         console.log(`Fetching posts for company: ${company}`);
 
         // Create options with RapidAPI key
         const options = {
           method: 'GET',
           headers: {
             'X-RapidAPI-Key': config.rapidApiKeys.primary
           }
         };
 
         // Use our simplified fetch with retry and fallback
         const result = await fetchWithRetry(`${config.endpoints.postsApi}?company=${encodeURIComponent(company)}`, options);
 
         hideLoading();
 
         if (!result.posts || !Array.isArray(result.posts) || result.posts.length === 0) {
           document.getElementById('postsContainer').innerHTML = `
             <div class="error-container">
               <h3>No posts found for "${company}"</h3>
               <p>Please try one of the following:</p>
               <ul>
                 <li>Check the company name and try again</li>
                 <li>Try a more popular company (e.g., microsoft, apple, google)</li>
                 <li>Try using the company's exact LinkedIn name</li>
               </ul>
             </div>
           `;
           document.getElementById('dateFilter').style.display = 'none';
           document.getElementById('loadMoreBtn').style.display = 'none';
           return;
         }
 
         // Store posts
         allPosts = result.posts;
         filteredPosts = [...allPosts];
 
         // Show date filter and success message
         document.getElementById('dateFilter').style.display = 'block';
         showMessage(`Found ${result.posts.length} posts for "${company}"`, 'success');
 
         // Render posts
         renderPosts();
 
       } catch (error) {
         console.error('Error fetching posts:', error);
         hideLoading();
         showMessage(`Error: ${error.message}`, 'error');
 
         document.getElementById('postsContainer').innerHTML = `
           <div class="error-container">
             <h3>Failed to fetch data</h3>
             <p>${error.message}</p>
             <p>Please try one of the following:</p>
             <ul>
               <li>Check your internet connection</li>
               <li>Try searching for a different company</li>
               <li>Try a more popular company (e.g., microsoft, apple, google)</li>
               <li>Wait a few minutes and try again</li>
             </ul>
           </div>
         `;
         document.getElementById('dateFilter').style.display = 'none';
         document.getElementById('loadMoreBtn').style.display = 'none';
       }
     }
 
     // Render posts
     function renderPosts() {
       const postsContainer = document.getElementById('postsContainer');
       const loadMoreBtn = document.getElementById('loadMoreBtn');
       const endIndex = Math.min(currentIndex + pageSize, filteredPosts.length);
       const postsToRender = filteredPosts.slice(currentIndex, endIndex);
 
       if (currentIndex === 0) {
         // Clear container for first batch
         postsContainer.innerHTML = '';
       }
 
       if (postsToRender.length === 0) {
         if (currentIndex === 0) {
           postsContainer.innerHTML = '<div class="error-container">No posts match your filter criteria</div>';
         }
         loadMoreBtn.style.display = 'none';
         return;
       }
 
       // Create posts
       postsToRender.forEach((post, index) => {
         const postElement = document.createElement('div');
         postElement.className = 'post-card';
 
         // Post content
         const postContent = document.createElement('div');
         postContent.className = 'post-content';
 
         // Post meta
         const postMeta = document.createElement('div');
         postMeta.className = 'post-meta';
 
         // Author info
         const authorName = post.author?.name || 'Unknown';
         const profileUrl = post.author?.company_url || '#';
         postMeta.innerHTML += `<p><strong>Author:</strong> <a href="${profileUrl}" target="_blank">${authorName}</a></p>`;
 
         // Language
         const lang = post.post_language_code || 'N/A';
         postMeta.innerHTML += `<p><strong>Language:</strong> ${lang}</p>`;
 
         // Date
         const date = post.date || post.posted_at?.date || 'Unknown';
         postMeta.innerHTML += `<p><strong>Date:</strong> ${date}</p>`;
 
         postContent.appendChild(postMeta);
 
         // Post text
         const postText = document.createElement('div');
         postText.className = 'post-text';
         postText.textContent = post.text || 'No text';
         postContent.appendChild(postText);
 
         // Engagement stats
         const stats = post.stats || {};
         const engagementStats = document.createElement('div');
         engagementStats.className = 'engagement-stats';
         engagementStats.innerHTML = `
           <strong>Reactions:</strong> ${stats.total_reactions || 0} |
           👍 Like: ${stats.like || 0} |
           ❤️ Love: ${stats.love || 0} |
           🎉 Celebrate: ${stats.celebrate || 0} |
           💡 Insight: ${stats.insight || 0} |
           👏 Support: ${stats.support || 0} |
           😂 Entertainment: ${stats.entertainment || 0} |
           💬 Comments: ${stats.comments || 0} |
           🔁 Reposts: ${stats.reposts || 0}
         `;
         postContent.appendChild(engagementStats);
 
         // Post link
         const postUrl = post.post_url || '#';
         const postLink = document.createElement('p');
         postLink.innerHTML = `<a href="${postUrl}" target="_blank">🔗 View original post</a>`;
         postContent.appendChild(postLink);
 
         // Media items
         if (post.media?.items?.length) {
           const mediaDiv = document.createElement('div');
           mediaDiv.className = 'post-media';
 
           post.media.items.forEach(item => {
             if (item.url) {
               const img = document.createElement('img');
               img.src = item.url;
               img.alt = 'Post image';
               img.loading = 'lazy';
               img.onerror = () => {
                 img.style.display = 'none';
               };
               mediaDiv.appendChild(img);
             }
           });
 
           postContent.appendChild(mediaDiv);
         }
 
         postElement.appendChild(postContent);
 
         // Chart
         const chartDiv = document.createElement('div');
         chartDiv.className = 'post-stats';
 
         const canvasId = `chart-${currentIndex + index}`;
         const chartCanvas = document.createElement('canvas');
         chartCanvas.id = canvasId;
         chartDiv.appendChild(chartCanvas);
 
         postElement.appendChild(chartDiv);
         postsContainer.appendChild(postElement);
 
         // Create chart
         setTimeout(() => {
           const ctx = document.getElementById(canvasId).getContext('2d');
           new Chart(ctx, {
             type: 'bar',
             data: {
               labels: ['Likes', 'Comments', 'Reposts'],
               datasets: [{
                 label: 'Engagement',
                 data: [stats.like || 0, stats.comments || 0, stats.reposts || 0],
                 backgroundColor: ['#4CAF50', '#2196F3', '#FF9800']
               }]
             },
             options: {
               responsive: true,
               maintainAspectRatio: false,
               plugins: {
                 legend: { display: false }
               },
               scales: {
                 y: { beginAtZero: true }
               }
             }
           });
         }, 0);
       });
 
       // Update current index
       currentIndex = endIndex;
 
       // Toggle load more button
       if (currentIndex < filteredPosts.length) {
         loadMoreBtn.style.display = 'block';
       } else {
         loadMoreBtn.style.display = 'none';
       }
     }
 
     // Load more posts
     function loadMorePosts() {
       renderPosts();
     }
 
     // Filter posts by date
     function filterByDate() {
       const startDate = document.getElementById('startDate').value;
       const endDate = document.getElementById('endDate').value;
 
       if (!startDate || !endDate) {
         showMessage('Please select both start and end dates', 'error');
         return;
       }
 
       const start = new Date(startDate);
       const end = new Date(endDate);
       end.setHours(23, 59, 59, 999); // Include all of end date
 
       if (isNaN(start) || isNaN(end)) {
         showMessage('Invalid date format', 'error');
         return;
       }
 
       if (start > end) {
         showMessage('Start date must be before end date', 'error');
         return;
       }
 
       // Filter posts
       filteredPosts = allPosts.filter(post => {
         const postDate = new Date(post.date || post.posted_at?.date);
         return postDate >= start && postDate <= end;
       });
 
       // Reset index and render
       currentIndex = 0;
 
       if (filteredPosts.length === 0) {
         document.getElementById('postsContainer').innerHTML = '<div class="error-container">No posts found in the selected date range</div>';
         document.getElementById('loadMoreBtn').style.display = 'none';
         showMessage('No posts found in the selected date range', 'info');
       } else {
         showMessage(`Found ${filteredPosts.length} posts in the selected date range`, 'success');
         renderPosts();
       }
     }
 
     // Reset date filter
     function resetDateFilter() {
       // Clear date inputs
       document.getElementById('startDate').value = '';
       document.getElementById('endDate').value = '';
 
       // Restore all posts
       filteredPosts = [...allPosts];
       currentIndex = 0;
 
       // Render unfiltered posts
       renderPosts();
       showMessage('Date filter reset', 'success');
     }
 
     // Sort posts
     function sortPosts(sortType) {
       if (!sortType) return;
 
       switch (sortType) {
         case 'reactions':
           filteredPosts.sort((a, b) => (b.stats?.total_reactions || 0) - (a.stats?.total_reactions || 0));
           break;
         case 'comments':
           filteredPosts.sort((a, b) => (b.stats?.comments || 0) - (a.stats?.comments || 0));
           break;
         case 'reposts':
           filteredPosts.sort((a, b) => (b.stats?.reposts || 0) - (a.stats?.reposts || 0));
           break;
         case 'date':
           filteredPosts.sort((a, b) => {
             const dateA = new Date(a.date || a.posted_at?.date);
             const dateB = new Date(b.date || b.posted_at?.date);
             return dateB - dateA;
           });
           break;
         default:
           return;
       }
 
       // Reset index and render
       currentIndex = 0;
       renderPosts();
 
       // Show sort message
       const sortMessages = {
         'reactions': 'Posts sorted by most reactions',
         'comments': 'Posts sorted by most comments',
         'reposts': 'Posts sorted by most shares',
         'date': 'Posts sorted by newest first'
       };
 
       showMessage(sortMessages[sortType] || 'Posts sorted', 'success');
     }
 
     // Export to CSV
     function downloadCSV() {
       if (filteredPosts.length === 0) {
         showMessage('No data to export', 'error');
         return;
       }
 
       // Create CSV header row
       let csvContent = 'Date,Author,Text,Total Reactions,Likes,Comments,Reposts,Post URL\n';
 
       // Add each post as a CSV row
       filteredPosts.forEach(post => {
         const date = post.date || post.posted_at?.date || '';
         const author = (post.author?.name || 'Unknown').replace(/,/g, ' ');
         const text = (post.text || '').replace(/,/g, ' ').replace(/\n/g, ' ');
         const totalReactions = post.stats?.total_reactions || 0;
         const likes = post.stats?.like || 0;
         const comments = post.stats?.comments || 0;
         const reposts = post.stats?.reposts || 0;
         const postUrl = post.post_url || '';
 
         csvContent += `"${date}","${author}","${text}",${totalReactions},${likes},${comments},${reposts},"${postUrl}"\n`;
       });
 
       // Create download link and trigger click
       const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
       const link = document.createElement('a');
       link.setAttribute('href', encodedUri);
       link.setAttribute('download', 'linkedin_posts.csv');
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
 
       showMessage('CSV file downloaded', 'success');
     }
 
     // Initialize
     document.addEventListener('DOMContentLoaded', function() {
       // Auto-focus the input field
       setTimeout(() => {
         document.getElementById('companyInput').focus();
       }, 500);
 
       // Add enter key press to search
       document.getElementById('companyInput').addEventListener('keypress', (e) => {
         if (e.key === 'Enter') {
           fetchPosts();
         }
       });
     });
// Add this to your GitHub Pages site
    window.addEventListener('message', function(event) {
    // Check if the message is asking for height
    if (event.data === 'getHeight') {
    // Calculate the full height of the document
    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    ) + 50; // Add padding
    
    // Send height back to parent
    window.parent.postMessage({height: height}, '*');
  }
});

  // Also send height whenever content changes
  const observer = new MutationObserver(function() {
  const height = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight
  ) + 50;
  
  window.parent.postMessage({height: height}, '*');
});

// Start observing the document for content changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});
