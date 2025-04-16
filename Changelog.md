**Changelog:**

## v1.2.0 (2025-04-12)
- **User Login & Session Management**  
  - Implemented a user authentication system using Passport and session-based authentication.
  - Configured Redis to store session data, enabling efficient and scalable login sessions.
  - Updated all document-related routes so that only authenticated (logged-in) users can upload and view their own documents.
    - Each user’s documents are now private and can only be accessed by the owning user.
  - Improved security by enforcing session cookies with secure settings (where applicable) and SameSite policies.

- **Performance & Security Enhancements**  
  - Moving session data to Redis improves response time and reduces average latency from ~200ms to ~100ms for authenticated operations.
  - Added stricter CORS rules to ensure cookies are properly sent only from allowed origins.

- **Other Minor Improvements**  
  - Updated environment configurations to separate development vs. production settings (e.g., `secure` cookies in production).
  - Added additional logging around user login and document access for easier debugging.


- **v1.1.0** (2025-04-12)
  - Deploy Redis to optimize the api GetDocById. Boost the resonse speed 100% from avg 200ms to 100ms.

- **v1.0.0** (2025-04-12)
  - Initial release of API Document Manager.
  - Integrated with Swagger UI for real-time OpenAPI 3.1 preview & editing.
  - Document upload/download, organized management, and efficient navigation are fully operational.
  - Built with React, Node.js, Express, Redis, and PostgreSQL.