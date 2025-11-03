🔄 Update Checklist for DigitalOcean Node Server
1️⃣ Make changes locally & push to GitHub

# from your local project folder

git add .
git commit -m "Describe your changes"
git push origin main

2️⃣ SSH into your droplet

ssh root@143.198.29.234

3️⃣ Pull the latest changes

cd ~/DWD
git pull
cd Week_01

4️⃣ Restart server if needed

- If you only changed HTML/CSS/JS → no restart needed (pm2 serves the new files automatically).
- If you changed server.js → restart:

pm2 restart week01

5️⃣ Check your site
Open in browser:

http://143.198.29.234:8080

6️⃣ Optional: view logs if something goes wrong

pm2 logs week01

That’s it! ✅
Basically:

- Edit locally → push → pull → restart only if server code changed → refresh browser.
