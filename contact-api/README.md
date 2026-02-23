# Darley Abbey FC Contact Form API

A Node.js/Express API for handling contact form submissions with email notifications.

## Setup

### 1. Database Setup

Run the SQL setup on your MariaDB server:

```bash
mysql -u your_user -p dafc < setup-db.sql
```

This creates the `contact_submissions` table.

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your database credentials:

```bash
cp .env.example .env
```

Update these values:
```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=dafc
```

SMTP settings are already configured for info@darleyabbeyfc.com.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Locally

```bash
npm start
```

Server will run on `http://localhost:5000`

## Deployment to Dokku

### Create the app on your Dokku server:

```bash
ssh your-vps.com "dokku apps:create forms"
```

### Link MariaDB:

```bash
ssh your-vps.com "dokku mysql:create dafc-contact-db && dokku mysql:link dafc-contact-db forms"
```

### Add a remote and deploy:

```bash
git remote add dokku dokku@your-vps.com:forms
git push dokku main:master
```

### Set environment variables on the server:

```bash
dokku config:set forms DB_HOST=your_db_host DB_USER=your_user DB_PASSWORD=your_password DB_NAME=dafc
```

### Run the database setup:

```bash
ssh your-vps.com "dokku run forms mysql -u your_user -p your_password dafc < setup-db.sql"
```

## API Endpoint

### POST /api/contact

Accepts form submissions and sends emails.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "topic": "Joining the team",
  "message": "I'd like to join..."
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "All fields are required"
}
```

## Health Check

GET `/health` - Returns `{"status": "ok"}`

## Features

- ✅ Stores submissions in MariaDB
- ✅ Sends email to user (confirmation)
- ✅ Sends email to info@darleyabbeyfc.com (notification)
- ✅ CORS enabled
- ✅ Input validation
- ✅ Error handling
