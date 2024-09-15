# MERN Stack QR Inventory Management System

## Project Description
A comprehensive MERN (MongoDB, Express.js, React, Node.js) stack project as part of a job interview process. This project aims to develop an efficient inventory management system that utilizes QR codes for tracking and managing items with seven columns (S.No., Name, Part Number, Date Received/Number, Date Dispatch/Number, Balance Items).

## Technology Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB 
- **Frontend:** React.js
- **QR Code Generation:** `jsQR` 
- **QR Code Scanning:** `react-qr-reader`/ `jsqr`
- **Authentication:** JWT (JSON Web Tokens)
- 
## Backend setup
Change the Directory
```javaScript
cd backend
```

Install the Dependencies
```bash 
npm i
```

Run the server
```
npm run start
```
or
```
node server.js
```
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file
`MONGODB_URI = "Replace it with your DB URL"`

## Frontend Setup
Change the Directory back to Qr-Based-Inventry-System folder
```javaScript
cd ..
```
Install the Dependencies
```bash 
npm i
```

Run Start Project
```
npm start
```

## Running the Application
Backend Server runs on: `http://localhost:5000`
Frontend App runs on: `http://localhost:3000`
