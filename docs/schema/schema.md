## Schema Design

This is a short documentation for the actual schema of the URL shortener project. It briefly explains the database
entities used in the application.

### Key Entities

**1. Users**

This schema is for storing details about the users who sign up in the application.

- Table name: users.
- Attributes: id, name, email, password_hash, verified_at, created_at, updated_at.
- Relationships: One user can have may shortened URLs.

**2. Email Verification Code / Token**

This schema is for storing the one time password (OTP) tokens. Relevant values will be automatically inserted when the
user signs up. While verifying the user, these records will be checked.

- Table name: email_codes.
- Attributes: id, user_id, otp_code, expires_at, created_at.
- Relationships: Belongs to a single User Email.

**3. Shortened URL**

This Schema is for storing the actual details about the URLs.

- Table name: shortened_urls.
- Attributes: id, user_id, original_url, short_code, expires_at, created_at, updated_at, deleted_at.
  - The short_code is the unique string used to redirect users (e.g. abc123 in `https://ourdomain.com/s/abc123`).
  - expires_at would define when the link expires and becomes invalid.
- Relationships: Each shortened URL is owned by a single User.

**4. Analytics Record**

This schema is for storing the various analytical records of a particular shortened URL. Each record represents one
click on a shortened URL.

- Table name: redirection_logs.
- Attributes: id, short_url_id, user_id, clicked_at, ip_address, country, user_agent, browser, device, operating_system.
  - user_agent column holds the raw user-agent information wile browser, device and operating_system store the parsed
    respective information obtained from user-agent header.
  - country column holds the [Country Codes in Alpha-2](https://www.iban.com/country-codes) format which is converted
    from ip_address.
- Relationships: Each click record is associated with exactly one shortened URL.

### Entity-Relationship Diagram

![ERD for URL shortener application](./url-shortener-erd.png)
