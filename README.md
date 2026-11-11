
# 🌍 Wanderlust – Travel & Stay Booking Platform

Wanderlust is a full-stack web application inspired by Airbnb that allows users to explore, create, and review vacation rental listings across different destinations.

The platform provides an interactive map, user authentication, property management, image uploads, and customer reviews to make travel accommodation discovery easier.

## 🚀 Features

### 1. User Authentication
- User registration and login.
- Secure authentication using Passport.js.
- Session management.
- Authorization for listing owners.

### 2. Property Listings
- Create new property listings.
- View all available listings.
- Edit and delete owned listings.
- Display property details, prices, descriptions, and locations.
- Browse listings with property images.

### 3. Image Management
- Upload property images using Cloudinary.
- Store image URLs and filenames in MongoDB.
- Display locally stored demo property images.
- Automatically update images for 50 demo listings using a seeding script.

### 4. Reviews & Ratings
- Add reviews to property listings.
- Rate properties from 1 to 5 stars.
- View customer comments and ratings.
- Delete reviews.

### 5. Interactive Map
- Integrated Mapbox GL JS.
- Display property locations using map markers.
- Show location information through popup windows.
- Interactive map navigation.

### 6. Database Management
- MongoDB Atlas for cloud database storage.
- Mongoose for schema modeling.
- Separate models for Users, Listings, and Reviews.

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | HTML, CSS, Bootstrap, EJS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | Passport.js |
| Image Storage | Cloudinary |
| Maps | Mapbox GL JS |
| Deployment | Render |
| Version Control | Git & GitHub |

## 📁 Project Structure

```text
majorProject/
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── views/
│   ├── listings/
│   ├── users/
│   └── layouts/
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│       └── listings/
│
├── middleware.js
├── cloudConfig.js
├── app.js
├── seed.js
├── updateImages.js
├── package.json
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to Project Folder

```bash
cd majorProject
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory.

```env
ATLASDB_URL=your_mongodb_connection_string
MAP_TOKEN=your_mapbox_access_token
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
SECRET=your_session_secret
```

Never upload your `.env` file to GitHub.

### 5. Start the Application

```bash
node app.js
```

Open your browser:

```text
http://localhost:8080
```

## 🌱 Database Seeding

Wanderlust includes scripts to populate the database with sample property listings and reviews.

### Generate Demo Listings and Reviews

```bash
node seed.js
```

This script generates:
- 50 demo property listings.
- 10 travel destinations.
- 150 sample reviews.

### Update Listing Images

Place your 50 AVIF property images inside:

```text
public/images/listings/
```

Then execute:

```bash
node updateImages.js
```

This script replaces the existing image references for the 50 generated listings with the new local property images.

**Note:** The seeding scripts use your configured MongoDB Atlas database. Run them only when you intend to modify that database.

## 🌐 Deployment

The application is deployed using Render.

Deployment steps:

1. Push the project to GitHub.
2. Connect the GitHub repository to Render.
3. Configure the required environment variables.
4. Set the build command to:

```bash
npm install
```

5. Set the start command to:

```bash
node app.js
```

6. Deploy the application.

## 🔒 Security

- Environment variables are used for sensitive credentials.
- Authentication and authorization protect user actions.
- Session-based authentication.
- Server-side validation for listings and reviews.

## 🎯 Future Enhancements

- Online payment integration.
- Advanced search and filtering.
- Booking and reservation management.
- Wishlist functionality.
- User profile management.
- Email notifications.
- Advanced location-based search.

## 👩‍💻 Author

**Bhoomika**

Information Science and Engineering

Don Bosco Institute of Technology (DBIT)

---

⭐ If you like this project, consider giving it a star on GitHub!
