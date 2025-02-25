chrome.storage.sync.get({blockedSubreddits: []}, (data) => {
	let blockedSubreddits = Object.values(data.blockedSubreddits).map((s) => s.toLowerCase());

	function isRAllPage() {
		return /^\/r\/all/.test(window.location.pathname);
	}

	// Function to filter posts on the page.
	function filterPosts() {
		if (!isRAllPage()) return;
		const posts = document.querySelectorAll("shreddit-post[subreddit-prefixed-name]");
		posts.forEach((post) => {
			let subredditName = post.getAttribute("subreddit-prefixed-name");
			if (!subredditName) return;
			subredditName = subredditName.toLowerCase().replace(/^r\//, "");
			const article = post.closest("article");
			if (!article) return;
			if (blockedSubreddits.includes(subredditName)) {
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
		if (areaName === "sync" && changes.blockedSubreddits) {
			blockedSubreddits = Object.values(changes.blockedSubreddits.newValue).map((s) =>
				s.toLowerCase()
			);
			filterPosts();
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
});
