# 🔐 AetherVault

> **Version 1.0.0 (Zephyr)**
>
> A personal lightweight SaaS database with complex permission management, designed for high-performance credential distribution and configuration sharing.

![Dashboard Screenshot](readmeRes/Screenshot.jpeg)

Built on the robust **Cloudflare** ecosystem: **Workers** + **KV** + **D1**.

---

## ✨ Features

- 🛡️ **Data Security**: UUID-based module-level permission control.
- 💾 **Reliable Storage**: Configuration items persisted in Cloudflare D1.
- 📦 **Batch Operations**: Supports atomic batch read/write operations to reduce network round-trips.
- 🖥️ **Lightweight Frontend**: Includes a Vue-based frontend for token management.

---

## 🚀 Deployment

### Prerequisites

- Node.js and npm installed.
- Cloudflare account.
- Wrangler CLI installed (`npm install -g wrangler`).

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/wuyilingwei/Vault.git
   cd Vault
   ```
2. **Configure Wrangler**

   Create a copy of the configuration file:

   ```bash
   cp wrangler.example.toml wrangler.toml
   ```
3. **Create Resources**

   Create the KV namespace for authentication:

   ```bash
   npx wrangler kv namespace create aethervault-access
   ```

   Create the D1 database for data storage:

   ```bash
   npx wrangler d1 create aethervault-service
   ```

   > ⚠️ **Important**: Update your `wrangler.toml` file with the `id` (for KV) and `database_id` (for D1) returned by the commands above.
   >
4. **Set Admin Password**

   Set the administrator password used for the frontend management interface:

   ```bash
   npx wrangler secret put ADMIN_PASSWORD
   ```
5. **Initialize Database**

   Initialize the D1 database schema using the provided SQL file:

   ```bash
   npx wrangler d1 execute aethervault-service --file=./init.sql
   ```
6. **Deploy**

   Deploy the worker to Cloudflare:

   ```bash
   npx wrangler deploy
   ```

## 📖 Usage

Once deployed, you can access the frontend at your worker's URL (e.g., `https://aethervault-service.<your-subdomain>.workers.dev`).

Use the `ADMIN_PASSWORD` you set to log in and manage tokens and permissions.

### API Usage Example

**Request** `POST /api/data`

```json
{
    "ops": [
        { "id": "task1", "type": "write", "module": "ip", "key": "blacklist", "value": "ip1", "separator": ", " },
        { "id": "task2", "type": "append", "module": "ip", "key": "blacklist", "value": "ip2" },
        { "id": "task3", "type": "read", "module": "ip", "key": "blacklist" },
        { "id": "task4", "type": "write", "module": "ip", "key": "whitelist", "value": "ip3"  }
    ]
}
```

**Response**

```json
[
    {
        "id": "task1",
        "status": 200,
        "data": {
            "last_update": "2025-12-23T01:56:56.653Z"
        }
    },
    {
        "id": "task2",
        "status": 200,
        "data": {
            "last_update": "2025-12-23T01:56:59.704Z"
        }
    },
    {
        "id": "task3",
        "status": 200,
        "data": {
            "content": "ip1, ip2",
            "last_update": "2025-12-23T01:56:59.704Z"
        }
    },
    {
        "id": "task4",
        "status": 403,
        "data": {
            "error": "Write Permission Denied"
        }
    }
]
```
