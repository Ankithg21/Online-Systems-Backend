# Image Selling Platform – Backend Service

This project is the backend service for an Image Selling Application, designed to support secure user authentication, optimized image uploads, and seamless payment processing. The application leverages modern technologies and third-party services to handle media, authentication, and transactions efficiently.

## Tech Stack
1. Node.js & Typescript – Core backend framework for handling routes and API logic.

2. MongoDB with Mongoose – NoSQL database for managing user data, image metadata, and order history.

3. ImageKit.io – For secure image uploads, CDN delivery, and transformation support.

4. Razorpay – Integrated as the payment gateway to manage purchases and webhook validation.

5. NextAuth.js (Credential Flow) – Used for secure session-based authentication 

6. crypto – For validating Razorpay webhooks with HMAC signatures.

7. nodemailer – For sending email confirmations and order notifications.

## 🔐 Key Backend Features
### Authentication API
1. Supports JWT session management via NextAuth (credentials provider).
2. Login & registration logic using email and password (extendable to OAuth).

### Image Upload Handling
1. Generates secure ImageKit signed upload tokens from backend.
2. Stores metadata (filename, URL, uploader, price) in MongoDB.

### Payment Integration
1. Razorpay checkout session creation (amount, currency, user info).
2. Webhook handler to validate payments using HMAC and Razorpay signature.
3. Order creation and storage after successful payment.

### Email Notifications
1. Sends confirmation emails to buyers with image details.

# Razorpay Gateway

### Create order

```js
instance.orders.create({
  "amount": 50000,
  "currency": "INR",
  "receipt": "receipt#1",
  "partial_payment": false,
  "notes": {
    "key1": "value3",
    "key2": "value2"
  }
})
```

**Parameters:**

| Name            | Type    | Description                                                                  |
|-----------------|---------|------------------------------------------------------------------------------|
| amount*          | integer | Amount of the order to be paid                                               |
| currency*        | string  | Currency of the order. Currently only `INR` is supported.                      |
| receipt         | string  | Your system order reference id.                                              |
| notes           | object  | A key-value pair  |
|partial_payment | boolean  | Indicates whether customers can make partial payments on the invoice . Possible values: true - Customer can make partial payments. false (default) - Customer cannot make partial payments. |

**Response:**

```json
{
  "id": "order_EKwxwAgItmmXdp",
  "entity": "order",
  "amount": 50000,
  "amount_paid": 0,
  "amount_due": 50000,
  "currency": "INR",
  "receipt": "receipt#1",
  "offer_id": null,
  "status": "created",
  "attempts": 0,
  "notes": [],
  "created_at": 1582628071
}
```