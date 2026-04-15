#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  ONE-TIME SETUP: Run this in Git Bash to connect to GitHub
#  After this, Antigravity can auto-push with /push-to-github
# ─────────────────────────────────────────────────────────────

echo "Setting up Git for Vaapi Comfort Inn..."

# Go to project directory
cd "/c/Users/hp/Desktop/Vapi-Hotel-main"

# Set global identity
git config --global user.name "Rohityd25"
git config --global user.email "rohityd25@users.noreply.github.com"

# Store credentials so you don't need to type password every time
git config --global credential.helper manager-core

# Initialize git if not already done
if [ ! -d ".git" ]; then
  git init
  echo "Git initialized!"
fi

# ── EDIT THIS LINE: paste your new GitHub repo URL below ──
REPO_URL="https://github.com/Rohityd25/Vaapi-Comfort-In.git"
# ──────────────────────────────────────────────────────────

# Set up remote
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"
echo "Remote set to: $REPO_URL"

# Create .gitignore if missing
cat > .gitignore << 'EOF'
node_modules/
.env
*.log
.DS_Store
Thumbs.db
EOF

# Initial push
git add .
git commit -m "feat: initial push - Vaapi Comfort Inn redesign"
git branch -M main
git push -u origin main

echo ""
echo "✅ DONE! You can now use /push-to-github in Antigravity to push anytime!"
