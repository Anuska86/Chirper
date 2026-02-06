# Chirper

A Twitter/X-like social media app built with vanilla JavaScript. Create tweets, reply to tweets, like, retweet, and manage your posts with persistent localStorage.

![Logo](/images/chirper-logo.jpg)
![Main View](/images/main.png)
![Reply](/images/reply.png)

## Features

- ✍️ **Tweet creation** — Write and post tweets instantly
- 💬 **Replies** — Add replies to any tweet
- ❤️ **Like & Retweet** — Engage with tweets (with counters)
- 🗑️ **Delete tweets & replies** — Remove your posts anytime
- 💾 **Persistent storage** — All data saved to localStorage
- 😂 **Emoji toolbar** — Quick emoji insertion (😂, ❤️, 🔥, 🚀, 👍, 💯)
- 📱 **Responsive design** — Works on desktop and mobile

## Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Modern styling with transitions & gradients
- **JavaScript (ES6+)** — Modular code with UUIDs for tweet tracking
- **Font Awesome 7** — Icons for interactions
- **Google Fonts** — Roboto typeface

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/yourusername/Chirper.git
   cd Chirper
   ```

2. Open `index.html` in your browser (or use Live Server in VS Code)

3. Start chirping! 🐦

### File Structure

```
Chirper/
├── index.html       # Main HTML
├── index.css        # Styling
├── index.js         # App logic
├── data.js          # Seed tweet data
└── images/          # Assets (profile pics, logo)
```

## Usage

- **Write a tweet** — Type in the textarea and click "Chirp" (or press Enter)
- **Add emoji** — Click emoji buttons above the textarea
- **Reply** — Click the comment icon, type your reply, click "Reply"
- **Like/Retweet** — Click the heart or retweet icons to engage
- **Delete** — Click the trash icon on any tweet or reply
- **Data persists** — Close and reopen the app; your tweets stay saved

## Demo Data

The app ships with 3 seed tweets from @TrollBot66756542, @Elon, and @NoobCoder12. Delete them to start fresh.

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

**Copyright © 2025 Ana Sappia Rey**

## Author

**Ana Sappia Rey** — [GitHub](https://github.com/anuska86)

---

Made with ❤️ during Scrimba's JavaScript course.
