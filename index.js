import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const tweetInput = document.getElementById("tweet-input");

document.addEventListener("click", (e) => {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
    isLiked = !isLiked;
    render();
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
    isRetweeted = !isRetweeted;
    render();
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.classList.contains("reply-btn")) {
    e.preventDefault();
    handleAddReplyClick(e.target.dataset.replyTo);
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
  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@NinjaCat`,
      profilePic: `images/ninja-cat.jpg`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
  }

  render();
  tweetInput.value = "";
}

//Like handle

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter((tweet) => {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
}

//Retweet handle
function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter((tweet) => {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

// Reply handle

function handleReplyClick(replyId) {
  const repliesContainer = document.getElementById(`replies-${replyId}`);

  repliesContainer.classList.toggle("hidden");

  //Check if the reply input has or not has been injected
  if (!repliesContainer.querySelector(".reply-input-area")) {
    const replyHtml = `<div class="tweet-input-area reply-input-area">
                <img src="images/chirper-logo.jpg" class="profile-pic" />
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
  const replyContent = replyInput.value.trim();

  if (replyContent.length > 0) {
    const targetTweetObj = tweetsData.find((tweet) => tweet.uuid === tweetId);

    targetTweetObj.replies.unshift({
      handle: `@NinjaCat`,
      profilePic: `images/ninja-cat.jpg`,
      tweetText: replyContent,
    });

    replyInput.value = "";

    document
      .getElementById(`replies-${tweetId}`)
      .scrollIntoView({ behavior: "smooth" });

    render();

    document.getElementById(`replies-${tweetId}`).classList.remove("hidden");
  }
}

//Html
function getFeedHtml() {
  let feedHtml = "";

  tweetsData.forEach(function (tweet) {
    let heartClass = "";

    let retweetClass = "";

    if (tweet.isLiked) {
      heartClass = "liked";
    }

    if (tweet.isRetweeted) {
      retweetClass = "retweeted";
    }

    let repliesHtml = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`;
      });
    }

    feedHtml += `<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                   ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-heart ${heartClass} " data-like="${tweet.uuid}"></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-retweet ${retweetClass}" data-retweet="${tweet.uuid}"></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden"  id="replies-${tweet.uuid}">
          ${repliesHtml}
    </div>   
</div>`;
  });

  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();
