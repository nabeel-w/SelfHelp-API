## Introduction

Welcome to the API Documentation for your application. This API serves as the backend for your chat application, providing user authentication, chatbot interaction, and scheduled cleanup of unverified users.

## Authentication Routes

### 1. User Registration

- **URL**: `/api/auth/signup`
- **Method**: POST
- **Description**: Create a new user account.
- **Request Body**:

  ```json
  {
    "email": "user@example.com",
    "phoneNumber": "+1234567890",
    "password": "password123"
  }
  ```

- **Response**:

  ```json
  {
    "token": "JWT_token"
  }
  ```

### 2. User Login

- **URL**: `/api/auth/login`
- **Method**: POST
- **Description**: Log in to an existing user account.
- **Request Body**:

  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

  or

  ```json
  {
    "phoneNumber": "+1234567890",
    "password": "password123"
  }
  ```

- **Response**:

  ```json
  {
    "token": "JWT_token"
  }
  ```

### 3. Verify OTP

- **URL**: `/api/auth/verifyOTP`
- **Method**: POST
- **Description**: Verify a user's phone number using OTP.
- **Request Body**:

  ```json
  {
    "otp": "123456"
  }
  ```

- **Response**:

  ```json
  {
    "token": "JWT_token"
  }
  ```

## Chat Routes

### 1. Send a Chat Message

- **URL**: `/api/bot/chat`
- **Method**: POST
- **Description**: Send a message to the chatbot and receive a response.
- **Request Body**:

  ```json
  {
    "userMessage": "Hello, chatbot!"
  }
  ```

- **Response**:

  ```json
  {
    "message": "Chatbot response message."
  }
  ```

## Scheduled Cleanup

- Unverified user accounts are automatically cleaned up every minute.

## Authentication

To access protected routes, include an authentication token in the request headers. Tokens are obtained during login and must be included in every authenticated request.

**Authentication Header:**

- **Key**: Authorization
- **Value**: Bearer {your-auth-token}
