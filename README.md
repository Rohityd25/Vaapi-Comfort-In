# 🏨 Vaapi Comfort Inn - Beginner's Guide & Documentation

Welcome to the **Vaapi Comfort Inn** website project! 

This guide is specifically written for beginners. It will explain exactly how the website works, how the files are organized, and how you can easily make changes to it yourself as you learn web development.

> **What does this project do?** It's a complete, modern hotel website. It has a beautiful homepage, a secure contact form to receive booking requests directly in your email, a gallery, and room listings.

---

## 🚀 1. How to Start the Project on Your Computer

To see the website on your own computer, you need to "run the local server". 

1. Open your terminal or command prompt.
2. Make sure you are inside the `Vaapi-Hotel-main` folder.
3. Type the following command and press Enter:
   ```bash
   npm run dev
   ```
4. Open your web browser (like Google Chrome).
5. In the internet address bar, type: **http://localhost:5000** 

*That's it! You should now see the website running.*

---

## 📁 2. Understanding the Folder Structure

When you open the project in your code editor (like VS Code), you will see several folders and files. Here is a simple breakdown of what everything does:

```text
Vaapi-Comfort-In/
│
├── public/                 # 🌐 THE FRONTEND (What the user sees in the browser)
│   ├── index.html          # The main homepage (Hero, Amenities, Contact form)
│   ├── rooms.html          # The page that lists all the specific room details
│   ├── css/                
│   │   └── style.css       # The styling file (Colors, Fonts, Layouts, Animations)
│   ├── js/                 
│   │   ├── main.js         # JavaScript for the homepage (Slideshow, Menus)
│   │   ├── rooms.js        # JavaScript for filtering rooms
│   │   └── api.js          # Helper code for sending the contact form
│   ├── [Images...]         # All the .jpg, .png, and .jpeg files live here!
│
├── api/
│   └── index.js            # ⚙️ THE BACKEND (The server that runs the website)
│
├── package.json            # 📦 The "Menu" of your project (lists dependencies/commands)
└── package-lock.json       # Exact versions of the tools used
```

---

## 🛠️ 3. How to Modify the Website Yourself (A Step-by-Step Guide)

You can easily change the website by editing the code. Whenever you save a file, just refresh your browser to see the changes!

### 📝 A. How to Change Text (Headings, Paragraphs)
1. Open `public/index.html` in your code editor.
2. Scroll to find the text you want to change. For example, to change the main title:
   *Find this:*
   ```html
   <h1 class="hero-title hero-name">
     Vaapi Comfort Inn
   </h1>
   ```
   *Change it to:*
   ```html
   <h1 class="hero-title hero-name">
     My Custom Hotel name!
   </h1>
   ```
3. Save the file and refresh your browser.

### 🖼️ B. How to Change Images
There are two ways images are used in this project:
1. **HTML Images (`<img>` tags):** 
   - Example: The gallery or the amenities section in `public/index.html`. 
   - To change it, replace the URL in `src="..."`. You can put your own image inside the `public/` folder (e.g., `my-photo.jpg`) and change the code to `<img src="my-photo.jpg" />`.
2. **CSS Background Images:**
   - Example: The large hero slideshow images at the top of the homepage.
   - Look inside `public/index.html` for `<div class="hero-slide" style="... background-image:url('hotel-day.jpg'); ...">` 
   - Change `hotel-day.jpg` to the name of your new image file located in the `public/` folder.

### 🎨 C. How to Change Colors and Branding
All the colors for the website are conveniently located at the very top of `public/css/style.css` using "CSS Variables". 

1. Open `public/css/style.css`.
2. Look at the top for the `:root` section:
   ```css
   :root {
     --gold:       #c9a96e;      /* The main gold color */
     --dark-bg:    #0d0d1a;      /* The darkest background color */
     --text-primary: #f0ece4;    /* The color of main text */
     /* ... */
   }
   ```
3. Change the Hex Code (e.g., `#c9a96e`) to any color you like (e.g., `#ff0000` for bright red). 
4. Because variables are used, changing it here will **magically update the color everywhere** across the entire website!

### 🛏️ D. How to Change Room Pricing or Room Types
Since this website specifically avoids confusing databases to be beginner-friendly, you change the rooms directly in the HTML.
1. To change the homepage room cards: open `public/index.html` and look for the `<!-- ROOM CATEGORIES -->` section. Edit the text like `From ₹2,200/night`.
2. To change the detailed rooms page: open `public/rooms.html`.

---

## 📩 4. How the Contact Form Works

If you scroll to the bottom, there is a "Contact Us" / Booking Request form. 
- The form does **not** need a complicated database! 
- It uses a free tool called **Web3Forms** to grab the information users type in and emails it straight to your inbox.
- If you want to connect it to your own email:
  1. Go to [Web3Forms Website](https://web3forms.com/).
  2. Create a free Access Key for your email address.
  3. You will add this key inside the `api.js` or `main.js` files where forms are handled.

---

## 🚀 5. Saving Your Learning Progress to GitHub

Whenever you make changes and are happy with them, you should back them up to GitHub. Run these three commands in your terminal:

```bash
git add .
git commit -m "update: learning how to change text and colors"
git push origin main
```

---
*Happy Coding! Don't be afraid to break things — changing code and seeing what happens is the absolute best way to learn!*
