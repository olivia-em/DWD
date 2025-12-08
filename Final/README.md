# Poetry Scroll Project

## Local Development

### Backend

```bash
cd server
node server.js
```

### Frontend

```bash
cd client
npm run dev
```

- Frontend runs at http://localhost:5173
- Backend runs at http://localhost:3001
- Vite proxy is set up for /api requests

## Project Structure

- `client/` — React + Vite frontend
- `server/` — Node.js + Express backend

---

## 🚀 Deploy to DigitalOcean (New Workflow)

### 1️⃣ Build React app locally

```bash
# From your local client folder
npm run build
```

### 2️⃣ Upload the dist folder to your droplet

```bash
# Run this from your local machine (not SSH)
scp -r /path/to/your/client/dist root@143.198.29.234:/root/DWD/Final/Client
```

### 3️⃣ SSH into your droplet

```bash
ssh root@143.198.29.234
```

### 4️⃣ Restart the server

```bash
pm2 restart <your-app-name>
# Example:
pm2 restart final-server
```

### 5️⃣ Check your site

Visit: `http://143.198.29.234:8080` (or your configured port)

---

## 📝 Quick Deploy Checklist

- [ ] Build React app locally: `npm run build`
- [ ] Upload dist folder: `scp -r /path/to/client/dist root@143.198.29.234:/root/DWD/Final/Client`
- [ ] SSH into droplet: `ssh root@143.198.29.234`
- [ ] Restart server: `pm2 restart <your-app-name>`
- [ ] Test at `http://143.198.29.234:8080`

---

## Troubleshooting

**React changes not showing?**

- Make sure you built locally and uploaded the latest dist folder.
- Restart the server after uploading.

**PM2 process doesn't exist?**

```bash
pm2 list
pm2 start server.js --name final-server
pm2 save
```

**Uploads directory missing on server?**

```bash
mkdir -p uploads
chmod 755 uploads
```
