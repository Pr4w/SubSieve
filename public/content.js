chrome.storage.sync.get(
	{
		blockedSubreddits: [],
		subFilterEnabled: true,
		blockedKeywords: [],
		keywordFilterEnabled: true,
	},
	(data) => {
		// Firefox compatibility
		// Ensure data is defined
		data = data || {
			blockedSubreddits: [],
			subFilterEnabled: true,
			blockedKeywords: [],
			keywordFilterEnabled: true,
		};

		// Get data from storage
		let blockedSubreddits = Object.values(data.blockedSubreddits).map((s) => s.toLowerCase());
		let subFilterEnabled = data.subFilterEnabled;
		let blockedKeywords = Object.values(data.blockedKeywords).map((s) => s.toLowerCase());
		let keywordFilterEnabled = data.keywordFilterEnabled;

		// Check if we're on /r/all
		function isRAllPage() {
			return /^\/r\/all/.test(window.location.pathname);
		}

		// Function to filter posts on the page.
		function filterPosts() {
			// Are we on /r/all
			if (!isRAllPage()) return;

			// Get all the posts
			const posts = document.querySelectorAll("shreddit-post[subreddit-prefixed-name]");

			// Loop through the posts
			posts.forEach((post) => {
				// Get the subreddit name & content
				let subredditName = post.getAttribute("subreddit-prefixed-name");
				let postTitle = post.getAttribute("post-title");

				// Check if we actually have a subreddit name
				if (!subredditName) return;

				// Clean up the subreddit name
				subredditName = subredditName.toLowerCase().replace(/^r\//, "");

				// Get the corresponding article
				const article = post.closest("article");
				if (!article) return;

				// Filter out if subRedditFIlter is enabled
				// if (blockedSubreddits.includes(subredditName) && subFilterEnabled) {
				// 	article.style.display = "none";
				// } else {
				// 	article.style.display = "";
				// }
				const hideBySubreddit =
					blockedSubreddits.includes(subredditName) && subFilterEnabled;
				const hideByKeyword =
					keywordFilterEnabled &&
					postTitle &&
					blockedKeywords.some((keyword) => postTitle.toLowerCase().includes(keyword));

				if (hideBySubreddit || hideByKeyword) {
					article.style.display = "none";
				} else {
					article.style.display = "";
				}
			});
		}

		// Run initial filtering.
		filterPosts();

		// Observe dynamic content changes.
		const observer = new MutationObserver(filterPosts);
		observer.observe(document.body, {childList: true, subtree: true});

		// Update blockedSubreddits when settings change.
		chrome.storage.onChanged.addListener((changes, areaName) => {
			if (areaName === "sync") {
				if (changes.blockedSubreddits) {
					blockedSubreddits = Object.values(changes.blockedSubreddits.newValue).map((s) =>
						s.toLowerCase()
					);
					filterPosts();
				}
				if (changes.subFilterEnabled) {
					subFilterEnabled = changes.subFilterEnabled.newValue;
					filterPosts();
				}
				if (changes.blockedKeywords) {
					blockedKeywords = Object.values(changes.blockedKeywords.newValue).map((s) =>
						s.toLowerCase()
					);
					filterPosts();
				}
				if (changes.keywordFilterEnabled) {
					keywordFilterEnabled = changes.keywordFilterEnabled.newValue;
					filterPosts();
				}
			}
		});

		// Poll for URL changes (workaround for SPA navigation)
		let currentUrl = location.href;
		setInterval(() => {
			if (location.href !== currentUrl) {
				currentUrl = location.href;
				filterPosts();
			}
		}, 500);
	}
);
