# Dashboard

A simple, responsive static dashboard for GitHub Pages.

## Deployment to GitHub Pages

### Option 1: Deploy to username.github.io

1. Create a new repository named `username.github.io` (replace `username` with your GitHub username)
2. Push this code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/username.github.io.git
   git push -u origin main
   ```
3. Visit `https://username.github.io` (may take a few minutes)

### Option 2: Deploy as a project site

1. Create a new repository (any name)
2. Push this code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/repo-name.git
   git push -u origin main
   ```
3. Go to repository Settings → Pages
4. Under "Source", select `main` branch and `/ (root)` folder
5. Click Save
6. Visit `https://username.github.io/repo-name`

## Customization

- Edit `index.html` to change content
- Modify `style.css` to update styling
- Add functionality in `script.js`

## Local Testing

Simply open `index.html` in your browser to preview locally.
