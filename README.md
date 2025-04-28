<div align="center">
  <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge"/>
  <h1>LinkedIn Insights Tool</h1>
  <p>
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript Badge"/>
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 Badge"/>
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3 Badge"/>
    <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white" alt="Chart.js Badge"/>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status Badge"/>
    <img src="https://img.shields.io/badge/Version-1.0-blue?style=for-the-badge" alt="Version Badge"/>
    <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License Badge"/>
  </p>
</div>

## 📋 Overview

A powerful web application that allows users to analyze company posts and engagement metrics from LinkedIn. This tool fetches and displays LinkedIn posts for any company, providing valuable insights into their social media performance.

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔍 **Company Post Analysis** | Search for any company to view their recent LinkedIn posts |
| 📊 **Engagement Metrics** | View detailed engagement statistics including likes, comments, and reposts |
| 📈 **Data Visualization** | Interactive charts to visualize engagement metrics |
| 📅 **Date Filtering** | Filter posts by date range |
| 🔄 **Sorting Options** | Sort posts by various engagement metrics |
| 📁 **CSV Export** | Export post data to CSV for further analysis |
| 📱 **Responsive Design** | Works on desktop and mobile devices |
| 🔄 **Fallback Mechanisms** | Multiple API endpoints and fallback data to ensure reliability |

## �️ Project Structure

```
LinkedIn-Insights/
├── css/
│   └── styles.css          # Main stylesheet with responsive design
├── js/
│   ├── config.js           # Configuration settings and API keys
│   └── main.js             # Main application logic with fallback mechanisms
├── index.html              # Main HTML file with user interface
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection to fetch LinkedIn data

### Installation

1. Clone this repository
   ```bash
   git clone https://github.com/Omara-25/Linkedin-Insights.git
   ```

2. Navigate to the project directory
   ```bash
   cd LinkedIn-Insights
   ```

3. Open `index.html` in your web browser

4. Start analyzing LinkedIn company posts!

## 💻 Usage Guide

<div align="center">
  <table>
    <tr>
      <td align="center"><b>Step 1</b></td>
      <td align="center"><b>Step 2</b></td>
      <td align="center"><b>Step 3</b></td>
    </tr>
    <tr>
      <td>Enter a company name in the search box and click "Fetch Posts"</td>
      <td>Use date filters and sorting options to analyze the data</td>
      <td>Export to CSV for further analysis or load more posts</td>
    </tr>
  </table>
</div>

### Detailed Instructions:

1. **Search for a Company**:
   - Enter a company name (e.g., "google", "microsoft", "apple")
   - Press Enter or click "Fetch Posts"

2. **Filter and Sort**:
   - Use the date range selector to filter posts by date
   - Sort posts by reactions, comments, reposts, or date using the dropdown

3. **Analyze and Export**:
   - View engagement metrics and visualizations for each post
   - Click "Export CSV" to download the data
   - Use "Load More" to view additional posts

## 🔧 Technical Details

The LinkedIn Insights Tool is built with:

- **Vanilla JavaScript**: No frameworks required for lightweight performance
- **Chart.js**: Powerful, clean visualizations for engagement metrics
- **RapidAPI Integration**: Secure API connections to LinkedIn data sources
- **Fallback Architecture**: Multiple API endpoints and sample data ensure reliability
- **Responsive CSS**: Flexbox layout for all device sizes

## 📊 Data Sources

The application uses a multi-tiered approach to data retrieval:

- **Primary API**: Custom LinkedIn data endpoint for post retrieval
- **Backup APIs**: Secondary endpoints for redundancy
- **Sample Data**: Fallback data ensures the application works even when APIs fail

## 🔒 Security Notes

- API keys are stored in the `config.js` file
- For production deployment, consider:
  - Moving API keys to environment variables
  - Implementing rate limiting
  - Adding user authentication if needed

## 📝 License

This project is available under the MIT License. See the LICENSE file for more details.

## 👨‍💻 Author

Created with ❤️ by Critical Future Team for efficient LinkedIn data analysis.

---

<div align="center">
  <p>If you find this tool useful, please consider giving it a ⭐ on GitHub!</p>
  <p>
    <a href="https://github.com/Omara-25/Linkedin-Insights">
      <img src="https://img.shields.io/github/stars/yourusername/LinkedIn-Insights?style=social" alt="GitHub stars"/>
    </a>
  </p>
</div>
#🚀 Getting Started
Prerequisites
A modern web browser (Chrome, Firefox, Safari, Edge)

Internet connection to fetch live LinkedIn data

Installation
bash
Copy
Edit
# Clone the repository
git clone https://github.com/Omara-25/Linkedin-Insights.git

# Navigate to the project folder
cd LinkedIn-Insights
Open index.html in your preferred web browser.

Start analyzing LinkedIn company posts instantly!

📖 Usage Guide
<div align="center"> <table> <thead> <tr> <th>Step 1</th> <th>Step 2</th> <th>Step 3</th> </tr> </thead> <tbody> <tr> <td>Enter a company name and click <br>"Fetch Posts"</td> <td>Apply filters & sort options to explore engagement</td> <td>Export the data as CSV or load more posts</td> </tr> </tbody> </table> </div>
Detailed Instructions
🔎 Search for a Company

Enter a company name like "google", "microsoft", or "apple".

Press Enter or click Fetch Posts.

🛠️ Filter and Sort

Apply a date range filter.

Sort by most liked, commented, reposted, or newest posts.

📈 Analyze and Export

View beautiful visualizations.

Download CSV files for external analysis.

Use Load More to fetch additional posts.

🔧 Technical Details
Built with a lightweight stack for performance and scalability:

Vanilla JavaScript — No external frameworks.

Chart.js — For dynamic and clean visualizations.

RapidAPI Integration — Secure and efficient LinkedIn data fetching.

Resilient Architecture — API fallbacks and sample data.

Responsive CSS — Optimized for all device sizes using Flexbox.

📊 Data Sources
Multi-tiered approach to guarantee data availability:

Primary API: LinkedIn custom endpoints.

Backup APIs: Secondary sources for redundancy.

Sample Data: Ensures demo functionality when APIs are unavailable.

🔒 Security Notes
API keys are stored locally in config.js.

For production:

Move keys to server-side environment variables.

Implement rate limiting & IP protection.

Optional: Add user authentication for enhanced security.

📝 License
This project is licensed under the MIT License.

👨‍💻 About
Built with ❤️ by the Critical Future Team — empowering efficient LinkedIn data analysis.

<div align="center"> <p>If you found this project helpful, consider leaving a ⭐ on GitHub!</p> <a href="https://github.com/yourusername/LinkedIn-Insights"> <img src="https://img.shields.io/github/stars/Omara-25/LinkedIn-Insights?style=social" alt="GitHub Stars"/> </a> </div>
