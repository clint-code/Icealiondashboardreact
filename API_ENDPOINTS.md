# API Endpoints Reference

This document outlines all the API endpoints that need to be implemented for the MFS Tech E-KYC dashboard application.

## Authentication

### POST /api/auth/login
Authenticate user credentials and return user information.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "super_admin" | "general_insurance" | "asset_management"
  },
  "token": "string"
}
```

## Dashboard

### GET /api/dashboard/{userRole}
Fetch dashboard statistics based on user role.

**Path Parameters:**
- `userRole`: super_admin | general_insurance | asset_management

**Response:**
```json
{
  "accountBalance": number,
  "utilisedAmount": number,
  "totalRequests": number,
  "completedRequests": number,
  "pendingRequests": number,
  "division": "general_insurance" | "asset_management" | "both"
}
```

**Implementation Location:** `src/app/components/DashboardView.tsx` (line 39-88)

### GET /api/transactions
Fetch transaction history.

**Query Parameters:**
- `role`: User role to filter transactions
- `division`: (Optional) Division filter for super admin
- `startDate`: (Optional) Filter by start date
- `endDate`: (Optional) Filter by end date
- `search`: (Optional) Search by reference

**Response:**
```json
{
  "transactions": [
    {
      "id": "string",
      "type": "top_up" | "usage",
      "division": "General Insurance" | "Asset Management",
      "amount": number,
      "date": "string (YYYY-MM-DD)",
      "status": "completed" | "pending",
      "reference": "string"
    }
  ]
}
```

**Implementation Location:** `src/app/components/DashboardView.tsx` (currently using mock data, needs API integration)

### POST /api/top-up
Submit a top-up request.

**Request Body:**
```json
{
  "division": "General Insurance" | "Asset Management",
  "amount": number,
  "notes": "string"
}
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "id": "string",
    "reference": "string",
    "status": "pending"
  }
}
```

**Implementation Location:** `src/app/components/DashboardView.tsx` (handleTopUpRequest function)

## E-KYC Requests

### GET /api/ekyc-requests
Fetch all E-KYC verification requests.

**Query Parameters:**
- `role`: User role to filter requests
- `division`: (Optional) Division filter
- `status`: (Optional) Filter by status
- `startDate`: (Optional) Filter by start date
- `endDate`: (Optional) Filter by end date
- `search`: (Optional) Search by ID, reference, or search data

**Response:**
```json
{
  "requests": [
    {
      "id": "string",
      "createdAt": "string (DD/MM/YYYY HH:mm:ss)",
      "requestSource": "string",
      "searchData": "string",
      "reference": "string",
      "status": "completed" | "pending" | "failed",
      "division": "general_insurance" | "asset_management"
    }
  ]
}
```

**Implementation Location:** `src/app/components/EKYCRequestsTable.tsx` (line 24-112)

### GET /api/ekyc-requests/{requestId}
Fetch detailed information for a specific E-KYC request.

**Path Parameters:**
- `requestId`: The unique request ID

**Response:**
```json
{
  "request": {
    "id": "string",
    "createdAt": "string",
    "requestSource": "string",
    "searchData": "string",
    "reference": "string",
    "status": "completed" | "pending" | "failed",
    "division": "general_insurance" | "asset_management"
  },
  "parameters": {
    "idType": "string",
    "number": "string"
  },
  "results": {
    "status": "string"
  },
  "response": {
    "StatusCode": "string",
    "Status": "string",
    "ResponseCode": "string",
    "Response": "string",
    "UniqueNumber": "string",
    "IdNumber": "string",
    "Surname": "string",
    "OtherNames": "string",
    "DateOfBirth": "string",
    "Gender": "string",
    "District": "string",
    "PlaceOfBirth": "string",
    "Citizenship": "string",
    "Clan": "string",
    "FamilyID": "string",
    "DateOfDeath": "string",
    "SerialNumber": "string",
    "Fingerprint": "string",
    "Photo": "string",
    "Signature": "string",
    "DateOfIssue": "string",
    "PlaceOfIssue": "string",
    "Timestamp": "string",
    "RequestID": "string",
    "QueryTimestamp": "string"
  }
}
```

**Implementation Location:** `src/app/components/EKYCRequestDetail.tsx` (currently using mock data)

## Charges

### GET /api/charges/{requestId}/entries
Fetch account entries for a specific request's charges.

**Path Parameters:**
- `requestId`: The unique request ID

**Response:**
```json
{
  "chargeDetails": {
    "channelReference": "string",
    "walletReference": "string",
    "idNo": "string"
  },
  "accountEntries": [
    {
      "account": "string",
      "entryType": "CREDIT" | "DEBIT",
      "chargeType": "string",
      "amount": number
    }
  ],
  "accountBalances": {
    "openingBalance": number,
    "closingBalance": number,
    "cost": number
  }
}
```

**Implementation Location:** `src/app/components/ViewCharges.tsx` (line 25-80)

## Users Management

### GET /api/users
Fetch all users (Super Admin only).

**Response:**
```json
{
  "users": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "super_admin" | "general_insurance" | "asset_management",
      "division": "General Insurance" | "Asset Management" | "Both",
      "status": "active" | "inactive",
      "lastLogin": "string"
    }
  ]
}
```

**Implementation Location:** `src/app/components/UsersManagement.tsx` (currently using mock data, needs API integration)

### POST /api/users
Create a new user.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "role": "super_admin" | "general_insurance" | "asset_management",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Implementation Location:** `src/app/components/UsersManagement.tsx` (handleAddUser function)

### PUT /api/users/{userId}
Update an existing user.

**Path Parameters:**
- `userId`: The unique user ID

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "role": "super_admin" | "general_insurance" | "asset_management"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Implementation Location:** `src/app/components/UsersManagement.tsx` (handleEditUser function)

### DELETE /api/users/{userId}
Delete a user.

**Path Parameters:**
- `userId`: The unique user ID

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Implementation Location:** `src/app/components/UsersManagement.tsx` (handleDeleteUser function)

### POST /api/users/{userId}/send-activation
Send activation email to a user.

**Path Parameters:**
- `userId`: The unique user ID

**Request Body:**
```json
{
  "emails": "string (comma-separated email addresses)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Activation email sent successfully"
}
```

**Implementation Location:** `src/app/components/UsersManagement.tsx` (handleSendActivation function)

## Password Reset

### POST /api/users/reset-password
Initiate password reset for a user (Super Admin only).

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "success": true,
  "resetToken": "string",
  "message": "Password reset email sent successfully"
}
```

**Email Content:**
The API should send an email to the user with:
- Subject: "Reset Your Password - MFS Tech E-KYC"
- Body containing a reset link: `https://your-app.com/reset-password?token={resetToken}`
- Reset token should expire in 1 hour
- Token should be one-time use only

**Implementation Location:** `src/app/components/UsersManagement.tsx` (handleResetPassword function)

### POST /api/users/validate-reset-token
Validate a password reset token.

**Request Body:**
```json
{
  "token": "string"
}
```

**Response:**
```json
{
  "valid": true,
  "email": "string",
  "expiresAt": "string (ISO date)"
}
```

**Implementation Location:** `src/app/components/ResetPasswordPage.tsx` (called on page load)

### POST /api/users/reset-password/verify
Submit new password and request OTP verification.

**Request Body:**
```json
{
  "token": "string",
  "newPassword": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to user's email"
}
```

**Email Content:**
The API should send an OTP email with:
- Subject: "Your Password Reset Verification Code"
- Body containing the 5-digit OTP
- OTP should expire in 10 minutes

**Implementation Location:** `src/app/components/ResetPasswordPage.tsx` (handlePasswordSubmit function)

### POST /api/users/reset-password/confirm
Verify OTP and complete password reset.

**Request Body:**
```json
{
  "token": "string",
  "otp": "string",
  "newPassword": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Implementation Location:** `src/app/components/ResetPasswordPage.tsx` (handleOtpSubmit function)

## Support

### POST /api/support
Submit a support request.

**Request Body:**
```json
{
  "subject": "string",
  "message": "string",
  "priority": "low" | "medium" | "high",
  "userName": "string",
  "userRole": "string"
}
```

**Response:**
```json
{
  "success": true,
  "ticketId": "string",
  "message": "Support request submitted successfully"
}
```

**Implementation Location:** `src/app/components/Sidebar.tsx` (handleSupportRequest function)

---

## Implementation Notes

1. All components currently use mock data with simulated API delays (800ms)
2. Look for comments starting with `// In production, replace this with actual API call:` in the codebase
3. Each mock fetch includes error handling that should be maintained in the actual implementation
4. Authentication tokens should be stored securely and included in API request headers
5. All date formats should match the specified formats in the response examples
6. Pagination should be handled server-side for large datasets
7. Search and filter parameters should be implemented as query parameters for optimal performance

## Next Steps

1. Set up your backend API server
2. Replace mock API calls in the components with actual fetch/axios calls
3. Update the endpoint URLs to match your backend configuration
4. Implement proper authentication token management
5. Add request interceptors for authentication headers
6. Implement proper error handling and user feedback
7. Test all endpoints thoroughly before deployment
