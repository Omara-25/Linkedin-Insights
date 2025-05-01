/**
  * LinkedIn Insights Tool Configuration
  *
  * This file contains configuration settings for the LinkedIn Insights Tool,
  * including API keys and endpoints.
  */
 
 const config = {
   // RapidAPI Keys
   rapidApiKeys: {
     primary: '4f87a77f12msh615c9318ae3c588p182355jsne45ac9881da5',
     backup: '9e189ebd0bmsh5b2f5ae32f3db59p150ff3jsn325131d694bf'
   },
 
   // API Endpoints
   endpoints: {
     // Primary LinkedIn Posts API
     postsApi: 'https://linkedin-api-production-8bd8.up.railway.app/fetch-posts',
 
     // Backup LinkedIn Posts API (same as primary for now)
     postsApiBackup: 'https://linkedin-api-production-8bd8.up.railway.app/fetch-posts',
 
     // Mock API for testing (returns sample data)
     mockApi: 'https://jsonplaceholder.typicode.com/posts'
   },
 
   // Sample data for fallback when all APIs fail
   sampleData: {
     posts: [
       {
         text: "We're excited to announce our latest product launch! Stay tuned for more updates.",
         date: new Date().toISOString().split('T')[0],
         author: { name: "Company Official", company_url: "#" },
         stats: {
           total_reactions: 245,
           like: 200,
           love: 25,
           celebrate: 10,
           insight: 5,
           support: 5,
           comments: 42,
           reposts: 18
         },
         post_url: "#"
       },
       {
         text: "Join us for our upcoming webinar on industry trends and insights. Register now!",
         date: new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0],
         author: { name: "Marketing Team", company_url: "#" },
         stats: {
           total_reactions: 189,
           like: 150,
           love: 15,
           celebrate: 8,
           insight: 10,
           support: 6,
           comments: 35,
           reposts: 22
         },
         post_url: "#"
       },
       {
         text: "We're proud to be recognized as a leader in our industry for the third consecutive year.",
         date: new Date(Date.now() - 14*24*60*60*1000).toISOString().split('T')[0],
         author: { name: "CEO", company_url: "#" },
         stats: {
           total_reactions: 320,
           like: 250,
           love: 40,
           celebrate: 20,
           insight: 5,
           support: 5,
           comments: 28,
           reposts: 45
         },
         post_url: "#"
       }
     ]
   },
 
   // Request options
   requestOptions: {
     retryAttempts: 2,  // Number of retry attempts if a request fails
     retryDelay: 1000,  // Delay between retry attempts in milliseconds
     useMockDataOnFailure: true,  // Use mock data if all APIs fail
     debugMode: true  // Enable detailed logging
   }
 };
