import { tweetsData as seedTweets } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const tweetInput = document.getElementById("tweet-input");

// Load from localStorage or seed data
let tweetsData =
  JSON.parse(localStorage.getItem("chirperTweets")) || seedTweets;

function saveToLocalStorage() {
  localStorage.setItem("chirperTweets", JSON.stringify(tweetsData));
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("emoji-btn")) {
    const emoji = e.target.dataset.emoji;
    const textarea = e.target
      .closest(".tweet-input-area")
      ?.querySelector("textarea");
    if (textarea) {
      textarea.value += emoji;
      textarea.focus();
    }
  } else if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.classList.contains("reply-btn")) {
    e.preventDefault();
    handleAddReplyClick(e.target.dataset.replyTo);
  } else if (e.target.dataset.deleteTweet) {
    handleDeleteTweet(e.target.dataset.deleteTweet);
  } else if (e.target.dataset.deleteReply) {
    handleDeleteReply(e.target.dataset.deleteReply);
  }
});

//Keydown listener
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (e.target.id === "tweet-input") {
      e.preventDefault();
      handleTweetBtnClick();
    } else if (e.target.id.startsWith("reply-input-")) {
      e.preventDefault();
      const tweetUUID = e.target.id.substring(12);
      handleAddReplyClick(tweetUUID);
    }
  }
});

//Tweet Btn handle
function handleTweetBtnClick() {
  if (tweetInput.value.trim()) {
    tweetsData.unshift({
      handle: `@NinjaCat`,
      profilePic: `images/ninja-cat.jpg`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value.trim(),
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });

    saveToLocalStorage();
    tweetInput.value = "";
    render();
  }
}

//Like handle
function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.find((tweet) => tweet.uuid === tweetId);
  if (!targetTweetObj) return;

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  saveToLocalStorage();
  render();
}

//Retweet handle
function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.find((tweet) => tweet.uuid === tweetId);
  if (!targetTweetObj) return;

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  saveToLocalStorage();
  render();
}

// Reply handle
function handleReplyClick(replyId) {
  const repliesContainer = document.getElementById(`replies-${replyId}`);
  if (!repliesContainer) return;

  repliesContainer.classList.toggle("hidden");

  // Inject reply input only once
  if (!repliesContainer.querySelector(".reply-input-area")) {
    const replyHtml = `<div class="tweet-input-area reply-input-area">
                <img src="images/chirper-logo.jpg" class="profile-pic" />

                    <!-- Emoji toolbar for replies -->
                <div class="emoji-toolbar">
                  <button type="button" class="emoji-btn" data-emoji="😂">😂</button>
                  <button type="button" class="emoji-btn" data-emoji="❤️">❤️</button>
                  <button type="button" class="emoji-btn" data-emoji="🔥">🔥</button>
                  <button type="button" class="emoji-btn" data-emoji="🚀">🚀</button>
                  <button type="button" class="emoji-btn" data-emoji="👍">👍</button>
                  <button type="button" class="emoji-btn" data-emoji="💯">💯</button>
                </div>
                <textarea
                    id="reply-input-${replyId}"
                    placeholder="Chirp your reply!"
                ></textarea>
            </div>
            <button class="reply-btn" type="button" data-reply-to="${replyId}">Reply</button>`;

    repliesContainer.innerHTML += replyHtml;
  }
}

function handleAddReplyClick(tweetId) {
  const replyInput = document.getElementById(`reply-input-${tweetId}`);
  if (!replyInput) return;
  const replyContent = replyInput.value.trim();

  if (replyContent.length > 0) {
    const targetTweetObj = tweetsData.find((tweet) => tweet.uuid === tweetId);
    if (!targetTweetObj) return;

    targetTweetObj.replies.unshift({
      handle: `@NinjaCat`,
      profilePic: `images/ninja-cat.jpg`,
      tweetText: replyContent,
    });

    saveToLocalStorage();
    replyInput.value = "";

    document
      .getElementById(`replies-${tweetId}`)
      .scrollIntoView({ behavior: "smooth" });

    render();
    document.getElementById(`replies-${tweetId}`).classList.remove("hidden");
  }
}

//Delete
function handleDeleteTweet(tweetId) {
  tweetsData = tweetsData.filter((t) => t.uuid !== tweetId);
  saveToLocalStorage();
  render();
}

function handleDeleteReply(payload) {
  const [tweetId, replyIndexStr] = payload.split("|");
  const replyIndex = parseInt(replyIndexStr, 10);
  const targetTweet = tweetsData.find((t) => t.uuid === tweetId);
  if (!targetTweet) return;
  if (replyIndex >= 0 && replyIndex < targetTweet.replies.length) {
    targetTweet.replies.splice(replyIndex, 1);
    saveToLocalStorage();
    render();
  }
}

//Html
function getFeedHtml() {
  const renderReplies = (replies, tweetUuid) =>
    replies
      .map(
        (reply, idx) => `
      <div class="tweet-reply">
        <div class="tweet-inner">
          <img src="${reply.profilePic}" class="profile-pic">
          <div>
            <p class="handle">${reply.handle} <i class="fa-solid fa-trash" data-delete-reply="${tweetUuid}|${idx}" title="Delete reply" style="cursor:pointer;font-size:0.9rem;color:#999;margin-left:8px;"></i></p>
            <p class="tweet-text">${reply.tweetText}</p>
          </div>
        </div>
      </div>
    `
      )
      .join("");

  const renderTweet = (tweet) => {
    const heartClass = tweet.isLiked ? "liked" : "";
    const retweetClass = tweet.isRetweeted ? "retweeted" : "";
    const repliesHtml = renderReplies(tweet.replies, tweet.uuid);

    return `
      <div class="tweet">
        <div class="tweet-inner">
          <img src="${tweet.profilePic}" class="profile-pic">
          <div>
            <p class="handle">${tweet.handle} <i class="fa-solid fa-trash" data-delete-tweet="${tweet.uuid}" title="Delete tweet" style="cursor:pointer;font-size:0.9rem;color:#999;margin-left:8px;"></i></p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
              <span class="tweet-detail">
                <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                ${tweet.replies.length}
              </span>
              <span class="tweet-detail">
                <i class="fa-solid fa-heart ${heartClass}" data-like="${tweet.uuid}"></i>
                ${tweet.likes}
              </span>
              <span class="tweet-detail">
                <i class="fa-solid fa-retweet ${retweetClass}" data-retweet="${tweet.uuid}"></i>
                ${tweet.retweets}
              </span>
            </div>
          </div>
        </div>
        <div class="hidden" id="replies-${tweet.uuid}">
          ${repliesHtml}
        </div>
      </div>
    `;
  };

  return tweetsData.map(renderTweet).join("");
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();
