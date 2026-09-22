# Automotive Conversational AI Agent

An end-to-end conversational AI agent for an automotive OEM that handles customer interactions across the complete vehicle lifecycle — from new lead generation to post-purchase service.

The application combines **React, Node.js, Gemini function calling, and Zoho CRM** to provide a conversational interface that can dynamically identify customer intent and execute CRM operations through controlled backend tools.

---

## 1. Overview

The agent supports four primary automotive customer journeys:

| Journey             | Example Customer Request                      | AI Action                       |
| ------------------- | --------------------------------------------- | ------------------------------- |
| 🚗 New Lead         | "Tell me about Thar variants and pricing"     | Retrieve vehicle information    |
| 📅 Ongoing Pipeline | "Check my XUV700 test drive status"           | Search/update Deal in Zoho CRM  |
| 🚘 Booked Vehicle   | "What's the delivery status of my Scorpio-N?" | Retrieve booking information    |
| 🔧 Post-Purchase    | "My AC isn't cooling. I need service."        | Create service Case in Zoho CRM |

The agent uses **LLM tool/function calling** to determine which backend operation should be executed.

The LLM never directly accesses Zoho CRM credentials. All CRM operations are executed securely by the Node.js backend.

---

# 2. Architecture


                         ┌─────────────────────┐
                         │      React UI       │
                         │    Chat Interface   │
                         └──────────┬──────────┘
                                    │
                                    │ POST /api/chat
                                    ▼
                         ┌─────────────────────┐
                         │   Node.js Backend   │
                         │   Express + TS      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Gemini LLM       │
                         │ Function Calling    │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
                    ▼               ▼                ▼
             get_vehicle_info   create_lead    get_deal_status
                    │               │                │
                    │               │                │
                    └───────────────┼────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Tool Executor    │
                         │  Backend-controlled │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     Zoho CRM        │
                         │      REST API       │
                         └─────────────────────┘
```

### Request Flow

```text
User
  ↓
React Chat UI
  ↓
POST /api/chat
  ↓
Node.js / Express
  ↓
Gemini
  ↓
Function / Tool Call
  ↓
Backend Tool Executor
  ↓
Zoho CRM REST API
  ↓
Tool Result
  ↓
Gemini
  ↓
Natural Language Response
  ↓
React UI
```

---

# 3. Technology Stack

### Frontend

* React
* TypeScript
* Vite
* CSS / responsive UI

### Backend

* Node.js
* Express.js
* TypeScript
* Zod
* Axios

### AI

* Google Gemini
* Gemini function/tool calling
* `@google/genai`

### CRM

* Zoho CRM REST API
* Zoho OAuth 2.0

### Development

* Git / GitHub
* npm
* Postman

---

# 4. Project Structure

```text
.
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── .env.example
│
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   │
│   │   ├── routes/
│   │   │   └── chat.ts
│   │   │
│   │   ├── ai/
│   │   │   ├── agent.ts
│   │   │   ├── prompt.ts
│   │   │   └── tools.ts
│   │   │
│   │   ├── zoho/
│   │   │   ├── auth.ts
│   │   │   ├── client.ts
│   │   │   ├── leads.ts
│   │   │   ├── deals.ts
│   │   │   ├── bookings.ts
│   │   │   └── cases.ts
│   │   │
│   │   └── state/
│   │       └── conversation.ts
│   │
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
└── .gitignore
```

---

# 5. AI Tools

The LLM does not directly interact with Zoho CRM.

Instead, it can request predefined backend tools.

## `get_vehicle_info`

Retrieves vehicle information such as:

* variants
* features
* demo pricing
* availability information

Example:

```json
{
  "vehicle": "Thar"
}
```

---

## `create_lead`

Creates a new customer Lead in Zoho CRM.

```json
{
  "firstName": "Rajesh",
  "lastName": "Sharma",
  "phone": "9876543210",
  "email": "rajesh@example.com",
  "city": "Mumbai",
  "interestedVehicle": "Thar"
}
```

---

## `get_deal_status`

Searches an existing Deal using the customer's phone number.

```json
{
  "phone": "9876543210"
}
```

The Deal contains information such as:

* customer
* vehicle
* Deal stage
* test drive status
* test drive date
* dealer information

---

## `get_booking_status`

Retrieves vehicle booking information.

```json
{
  "bookingId": "MAH-9921"
}
```

Example information:

```json
{
  "bookingId": "MAH-9921",
  "vehicle": "Scorpio-N Z8L",
  "status": "In Transit"
}
```

---

## `create_service_case`

Creates a service Case in Zoho CRM.

```json
{
  "registrationNumber": "MH12AB1234",
  "odometer": 24500,
  "issue": "AC is not cooling properly",
  "serviceCenter": "Pune Wakad",
  "phone": "9876543210"
}
```

---

# 6. Zoho CRM Configuration

Create a free Zoho CRM Developer account.

Create a Zoho OAuth Self Client from the Zoho API Console.

Required scopes:

```text
ZohoCRM.modules.ALL
ZohoCRM.settings.ALL
```

The application requires:

```text
Client ID
Client Secret
Refresh Token
```

For the India Zoho region, the API domain is:

```text
https://www.zohoapis.in
```

OAuth token endpoint:

```text
https://accounts.zoho.in/oauth/v2/token
```

---

# 7. Zoho CRM Data Model

## Leads

The Lead contains:

```text
First Name
Last Name
Phone
Email
City
Interested Vehicle
```

Example:

```text
Rajesh Sharma
9876543210
rajesh@example.com
Mumbai
Thar
```

---

## Deals

The Deal uses the standard Zoho `Stage` field for the overall sales lifecycle.

Example:

```text
Stage: Proposal/Price Quote
```

Automotive-specific information is represented using custom fields.

### Customer Phone

```text
Type: Phone
Example: 9876543210
```

### Test Drive Status

```text
Type: Picklist

Values:
- Not Scheduled
- Scheduled
- Completed
- Cancelled
```

### Test Drive Date

```text
Type: Date/Time
```

Example Deal:

```text
Customer: Priya Patel
Vehicle: XUV700
Stage: Proposal/Price Quote
Customer Phone: 9876543210
Test Drive Status: Scheduled
Test Drive Date: 25 Sep 2026, 11:00 AM
```

> `Stage` represents the overall CRM sales lifecycle, while `Test Drive Status` represents the automotive-specific test-drive workflow.

---

## Bookings

The booking flow can be represented using a custom Zoho module or custom fields on Deals.

Example:

```text
Booking ID: MAH-9921
Vehicle: Scorpio-N Z8L
Status: In Transit
```

Supported delivery states:

```text
In Transit
Dispatch Pending
Delivered
```

---

## Cases

Service requests are represented using Zoho CRM Cases.

Example fields:

```text
Registration Number
Odometer
Issue
Preferred Service Center
Customer Phone
```

---

# 8. Environment Variables

Create:

```text
backend/.env
```

Example:

```env
PORT=5000

GEMINI_API_KEY=your_gemini_api_key

ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REFRESH_TOKEN=your_refresh_token

ZOHO_ACCOUNTS_URL=https://accounts.zoho.in
ZOHO_API_DOMAIN=https://www.zohoapis.in
```

### Security

Never commit `.env` to Git.

The following credentials must remain backend-only:

```text
GEMINI_API_KEY
ZOHO_CLIENT_ID
ZOHO_CLIENT_SECRET
ZOHO_REFRESH_TOKEN
```

The React frontend must never receive Zoho OAuth credentials.

---

# 9. Installation

Clone the repository:

```bash
git clone <your-private-repository-url>
cd <repository-name>
```

---

## Backend

```bash
cd backend
npm install
```

Create `.env`:

```bash
cp .env.example .env
```

Fill in the required credentials.

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

## Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 10. API

## POST `/api/chat`

Main conversational API.

### Request

```http
POST http://localhost:5000/api/chat
Content-Type: application/json
```

```json
{
  "sessionId": "demo-session-1",
  "message": "I am interested in the Thar."
}
```

### Response

```json
{
  "success": true,
  "response": "The Thar is available in multiple variants..."
}
```

---

# 11. Testing the Four Scenarios

## Scenario 1 — New Lead

Request:

```json
{
  "sessionId": "lead-demo-1",
  "message": "I am interested in the Thar. Tell me about its variants, features and pricing."
}
```

Expected tool:

```text
get_vehicle_info
```

The conversation can then collect:

```text
Full Name
Phone
Email
Preferred City
Vehicle
```

The agent subsequently creates the Lead in Zoho CRM.

---

# Scenario 2 — Ongoing Pipeline

Request:

```json
{
  "sessionId": "deal-demo-1",
  "message": "I want to check my test drive status. My phone number is 9876543210."
}
```

Expected tool:

```text
get_deal_status
```

Expected information:

```text
Customer
Vehicle
Deal Stage
Test Drive Status
Test Drive Date
Dealer Information
```

Example:

```text
Priya Patel
XUV700
Proposal/Price Quote
Test Drive Scheduled
25 Sep 2026, 11:00 AM
```

---

# Scenario 3 — Booked Vehicle

Request:

```json
{
  "sessionId": "booking-demo-1",
  "message": "I have booked a Scorpio-N. My booking ID is MAH-9921. Can you check my delivery status?"
}
```

Expected tool:

```text
get_booking_status
```

Example response:

```text
Booking: MAH-9921
Vehicle: Scorpio-N Z8L
Status: In Transit
```

---

# Scenario 4 — Post-Purchase Service

Request:

```json
{
  "sessionId": "service-demo-1",
  "message": "I want to report a problem with my car. My registration number is MH12AB1234, odometer is 24500 km, the AC is not cooling properly, and I want service at the Pune Wakad service center."
}
```

Expected tool:

```text
create_service_case
```

The backend creates a Case in Zoho CRM.

---

# 12. Error Handling

The backend handles errors across multiple layers:

```text
React
  ↓
API validation
  ↓
Gemini
  ↓
Tool execution
  ↓
Zoho OAuth
  ↓
Zoho REST API
```

Typical errors include:

### Invalid request

```text
400 Bad Request
```

### AI failure

```text
500 Internal Server Error
```

### Zoho authentication failure

```text
401 Unauthorized
```

### Zoho CRM API failure

The backend logs the Zoho response while returning a safe error message to the client.

---

# 13. Security Considerations

### Backend-only credentials

Zoho credentials and Gemini API keys are stored exclusively in the backend.

### Controlled tool execution

The LLM can only request tools explicitly defined by the application.

```text
LLM
 ↓
Tool definition
 ↓
Backend validation
 ↓
Tool executor
 ↓
Zoho
```

The LLM cannot arbitrarily call external URLs or access credentials.

### Input validation

User-provided tool arguments should be validated using Zod before executing CRM operations.

### OAuth

Zoho access tokens are generated using the OAuth refresh token and are kept server-side.

---

# 14. Conversation State

Each conversation uses a `sessionId`.

Example:

```json
{
  "sessionId": "demo-session-1",
  "message": "I am interested in the Thar."
}
```

The session allows the backend to maintain conversational context across multiple messages.

For this technical assessment, conversation state is maintained in memory.

For production, this can be replaced with:

```text
Redis
    or
PostgreSQL
```

---

# 15. Production Scalability

The assessment implementation uses a lightweight architecture suitable for a take-home demonstration.

A production implementation could evolve to:

```text
                         ┌───────────────┐
                         │ Load Balancer │
                         └───────┬───────┘
                                 │
                   ┌─────────────┼─────────────┐
                   ▼             ▼             ▼
                Node API      Node API      Node API
                   │             │             │
                   └─────────────┼─────────────┘
                                 │
                           ┌─────▼─────┐
                           │   Redis   │
                           │  Session  │
                           └─────┬─────┘
                                 │
                           ┌─────▼─────┐
                           │  Zoho CRM │
                           └───────────┘
```

Potential improvements:

* Redis-based conversation state
* distributed rate limiting
* streaming LLM responses
* background jobs for CRM synchronization
* webhook-based CRM updates
* structured observability
* retries with exponential backoff
* circuit breakers for external APIs
* audit logging
* persistent conversation history

---

# 16. Design Decisions

## Why React + Node.js?

React provides a responsive conversational UI while Node.js provides a lightweight backend suitable for integrating AI APIs and Zoho's REST APIs.

## Why backend tool execution?

Keeping tool execution in the backend prevents exposing CRM credentials to the browser and provides a controlled boundary between the LLM and external systems.

## Why function calling?

Instead of relying entirely on free-form LLM responses, function calling allows the model to produce structured requests such as:

```json
{
  "name": "get_deal_status",
  "arguments": {
    "phone": "9876543210"
  }
}
```

The backend can then validate and execute the requested operation.

## Why session IDs?

A session ID allows multiple messages to belong to the same conversation and enables contextual intent handling.

---

# 17. Demo Flow

The recommended demonstration follows these four flows:

```text
1. New Customer
   ↓
Vehicle inquiry
   ↓
Vehicle information
   ↓
Test drive pitch
   ↓
Customer details
   ↓
Zoho Lead created


2. Existing Prospect
   ↓
Phone number
   ↓
Zoho Deal search
   ↓
Test drive status
   ↓
Customer receives confirmation


3. Booked Customer
   ↓
Booking ID
   ↓
Zoho booking lookup
   ↓
Delivery status
   ↓
VIN / payment information


4. Existing Owner
   ↓
Vehicle registration
   ↓
Service issue
   ↓
Service center
   ↓
Zoho Case created
```

---

# 18. Assessment Deliverables

This repository contains:

* [x] React conversational UI
* [x] Node.js backend
* [x] Gemini function calling
* [x] Zoho CRM OAuth integration
* [x] Lead creation
* [x] Deal lookup
* [x] Booking lookup
* [x] Service Case creation
* [x] Conversation/session handling
* [x] Environment configuration
* [x] Architecture documentation
* [x] API examples
* [x] Security considerations

---

# 19. Future Improvements

Given additional development time, the following improvements could be implemented:

1. **Streaming responses**

   * Stream Gemini output to the React UI.

2. **Persistent conversation state**

   * Redis/PostgreSQL instead of in-memory state.

3. **CRM webhooks**

   * Push Zoho CRM changes to the conversational UI in near real time.

4. **Voice interface**

   * Add speech-to-text and text-to-speech.

5. **Authentication**

   * Customer authentication before accessing sensitive booking/service information.

6. **Observability**

   * Add structured logging, metrics and tracing.

7. **Rate limiting**

   * Protect the conversational API from abuse.

8. **Automated tests**

   * Unit tests for tools and integration tests for CRM workflows.

9. **Retry and resilience**

   * Exponential backoff and circuit breakers for external API failures.

---

# 20. Security Notice

This project is intended for technical assessment/demo purposes.

Do not commit:

```text
.env
API keys
OAuth client secrets
OAuth refresh tokens
Customer PII
```

Use `.env.example` to document required configuration.

---

## Author

Built as an AI Solutions Engineer / AI Integration Specialist technical assessment demonstrating:

* Conversational AI
* LLM tool calling
* CRM integration
* Backend API design
* Automotive customer lifecycle workflows
* Secure API integration
* Full-stack application development
