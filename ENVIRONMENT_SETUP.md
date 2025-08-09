# Environment Configuration Setup

## Required Environment Variables

Create a file `config/.env` with the following variables:

```env
# Database Configuration
DB_URL_ONLINE=mongodb://localhost:27017/socialmedia

# JWT Configuration
confirmationKey=your_super_secret_jwt_key_min_32_characters_long
confirmationKeyRefresher=your_super_secret_refresh_jwt_key_min_32_characters_long

# Password Hashing
saltRounds=10

# Email Configuration (Gmail SMTP)
sendEmail=your_email@gmail.com
emailPassword=your_gmail_app_password

# Default Profile Images
defaultProfilePic=https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/default_profile.jpg
defaultPublicPic=social_media_app/default_profile_pic

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Setup Instructions

1. **Create the config/.env file** with the above content
2. **Replace placeholder values** with your actual credentials:
   - Get MongoDB connection string (local or Atlas)
   - Generate secure JWT secrets (minimum 32 characters)
   - Set up Gmail App Password for email service
   - Configure Cloudinary account for image uploads
3. **Never commit the .env file** to version control
4. **Restart the server** after creating the .env file

## Security Notes

- Use strong, unique secrets for JWT keys
- Enable 2FA and use App Passwords for Gmail
- Keep Cloudinary credentials secure
- Use environment-specific configurations for different deployments

