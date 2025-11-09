# Week 02 - Secret Sharing App

A photo + secret sharing web app with poem display using Express and Multer.

## Features

- Submit a secret with "with/for/from" preposition
- Upload a photo (optional)
- Photo displays as background with text overlay and blend modes
- Only the most recent secret is shown
- Old photos are automatically deleted when new ones are uploaded

## Local Development

### Install dependencies

```bash
npm install
```

### Run the server

```bash
node server.js
```

Then visit: `http://localhost:8080`

---

## 🚀 Deploy to DigitalOcean

### 1️⃣ Push changes to GitHub

```bash
# From your local Week_02 folder
git add .
git commit -m "Update Week_02 with photo upload and poem styling"
git push origin main
```

### 2️⃣ SSH into your droplet

```bash
ssh root@143.198.29.234
```

### 3️⃣ Pull the latest changes

```bash
cd ~/DWD/Week_02
git pull
```

### 4️⃣ Install dependencies (first time or if package.json changed)

```bash
npm install
```

### 5️⃣ Create uploads directory (first time only)

```bash
mkdir -p public/uploads
```

### 6️⃣ Restart the server

```bash
# If you changed server.js, restart pm2
pm2 restart week02

# Or if this is the first time, start it:
# pm2 start server.js --name week02

# If you only changed HTML/CSS/client files, no restart needed!
```

### 7️⃣ Check your site

Visit: `http://143.198.29.234:8080` (or whatever port you configured)

### 8️⃣ Optional: View logs if something goes wrong

```bash
pm2 logs week02
```

---

## 📝 Quick Deploy Checklist

- [ ] `git add . && git commit -m "your message" && git push origin main`
- [ ] `ssh root@143.198.29.234`
- [ ] `cd ~/DWD/Week_02 && git pull`
- [ ] `npm install` (if dependencies changed)
- [ ] `pm2 restart week02` (if server.js changed)
- [ ] Test at `http://143.198.29.234:8080`

---

## Troubleshooting

**Port already in use locally?**

```bash
lsof -ti :8080 | xargs kill -9
node server.js
```

**PM2 process doesn't exist?**

```bash
pm2 list
pm2 start server.js --name week02
pm2 save
```

**Uploads directory missing on server?**

```bash
mkdir -p public/uploads
chmod 755 public/uploads
```
