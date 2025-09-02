# OAuth2 Authorization Server

A standalone Spring Boot OAuth2 Authorization Server implementation.

## Features

- OAuth2 Authorization Code Grant
- OAuth2 Password Grant (Resource Owner Password Credentials)
- OAuth2 Client Credentials Grant
- Refresh Token support
- OpenID Connect (OIDC) support
- JWT tokens with RSA signing
- In-memory client and user storage

## Getting Started

### Prerequisites

- Java 21+
- Maven 3.6+

### Running the Server

```bash
cd OAuthserver
mvn spring-boot:run
```

The server will start on `http://localhost:8080`

### Configuration

#### Registered Client
- **Client ID:** `demo-client`
- **Client Secret:** `demo-secret`
- **Supported Grants:** Authorization Code, Password, Refresh Token
- **Scopes:** `openid`, `profile`, `email`, `read`, `write`
- **Redirect URIs:** 
  - `http://localhost:8081/callback`
  - `https://oauth.pstmn.io/v1/callback`

#### Test Users
- **Username:** `admin`, **Password:** `admin` (ADMIN, USER roles - all scopes)
- **Username:** `manager`, **Password:** `manager123` (MANAGER, USER roles - read, write, manage scopes)
- **Username:** `editor`, **Password:** `editor123` (EDITOR, USER roles - read, write, edit scopes)
- **Username:** `testuser`, **Password:** `testpassword` (USER role - read scope)
- **Username:** `viewer`, **Password:** `viewer123` (VIEWER role - read scope only)

## Endpoints

### Authorization Endpoints
- **Authorization:** `GET /oauth2/authorize`
- **Token:** `POST /oauth2/token`
- **UserInfo:** `GET /userinfo`
- **JWK Set:** `GET /oauth2/jwks`
- **OpenID Configuration:** `GET /.well-known/openid_configuration`

### Authorization Code Flow

1. **Get Authorization Code:**
   ```
   GET /oauth2/authorize?response_type=code&client_id=demo-client&redirect_uri=https://oauth.pstmn.io/v1/callback&scope=openid profile&state=xyz
   ```

2. **Exchange Code for Token:**
   ```
   POST /oauth2/token
   Content-Type: application/x-www-form-urlencoded
   
   grant_type=authorization_code&code={code}&redirect_uri=https://oauth.pstmn.io/v1/callback&client_id=demo-client&client_secret=demo-secret
   ```

### Password Flow

```
POST /oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=password&username=testuser&password=testpassword&client_id=demo-client&client_secret=demo-secret&scope=read write
```

### Client Credentials Flow

```
POST /oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=demo-client&client_secret=demo-secret&scope=read write
```

## Testing

Use the provided Postman collections:
- `OAuthRequest.json` - Authorization Code Flow
- `PasswordFlow.json` - Password Grant Flow

## Security Notes

- This is a development/demo server
- Uses in-memory storage (not suitable for production)
- Client secret is stored in plain text with `{noop}` prefix
- For production, use proper client secret encoding and external storage
