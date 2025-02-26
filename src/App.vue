<script>
export default {
	name: "App",
	data() {
		return {
			// Subreddit filter
			subreddits: [],
			newSubreddit: "",
			subFilterEnabled: true,

			// Keywords
			keywords: [],
			newKeyword: "",
			keywordFilterEnabled: true,

			// Default subs
			defaultList: [
				"50501",
				"amioverreacting",
				"agedlikemilk",
				"antiwork",
				"atheism",
				"BlackPeopleTwitter",
				"clevercomebacks",
				"conservativeterrorism",
				"DailyShow",
				"democrats",
				"economicCollapse",
				"facepalm",
				"Fauxmoi",
				"fednews",
				"FluentInFinance",
				"global_news_hub",
				"insanepeoplefacebook",
				"LateStageCapitalism",
				"law",
				"LeopardsAteMyFace",
				"MurderedByAOC",
				"MurderedByWords",
				"news",
				"nottheonion",
				"OptimistsUnite",
				"pics",
				"Political_Revolution",
				"PoliticalHumor",
				"politics",
				"PublicFreakout",
				"SandersForPresident",
				"scotus",
				"Snorkblot",
				"texas",
				"therewasanattempt",
				"TwoXChromosomes",
				"ukraine",
				"UkraineWarVideoReport",
				"Whistleblowers",
				"WhitePeopleTwitter",
				"WitchesVsPatriarchy",
				"WorkReform",
				"worldnews",
			],
			navigation: "home",
		};
	},
	mounted() {
		// Retrieve the stored blocked subreddits when the component mounts.
		chrome.storage.sync.get(
			{
				blockedSubreddits: [],
				subFilterEnabled: true,
				blockedKeywords: [],
				keywordFilterEnabled: true,
				navigation: "home",
			},
			(data) => {
				// Firefox compatibility
				data = data || {
					blockedSubreddits: [],
					subFilterEnabled: true,
					blockedKeywords: [],
					keywordFilterEnabled: true,
					navigation: "home",
				};

				// Save
				this.subreddits = Object.values(data.blockedSubreddits);
				this.subFilterEnabled = data.subFilterEnabled;
				this.keywords = Object.values(data.blockedKeywords);
				this.keywordFilterEnabled = data.keywordFilterEnabled;
				this.navigation = data.navigation;
			}
		);
	},
	computed: {
		// sortedSubreddits() {
		// 	// Create a shallow copy and sort alphabetically.
		// 	return this.subreddits.slice().sort((a, b) => a.localeCompare(b));
		// },
		// datatableSubreddits() {
		// 	return this.subreddits.map((id) => ({name: id}));
		// },
	},
	methods: {
		changeNav(page) {
			this.navigation = page;
			chrome.storage.sync.set({
				navigation: this.navigation,
			});
		},
		saveSubreddits() {
			chrome.storage.sync.set({
				blockedSubreddits: this.subreddits,
				subFilterEnabled: this.subFilterEnabled,
				blockedKeywords: this.keywords,
				keywordFilterEnabled: this.keywordFilterEnabled,
			});
		},
		saveKeywords() {
			this.saveSubreddits();
		},
		addSubreddit() {
			const trimmed = this.newSubreddit.trim().toLowerCase();
			if (trimmed && !this.subreddits.includes(trimmed)) {
				this.subreddits.push(trimmed);
				this.orderSubReddits();
				this.saveSubreddits();
			}
			this.newSubreddit = "";
		},
		addKeyword() {
			const trimmed = this.newKeyword.trim().toLowerCase();
			if (trimmed && !this.keywords.includes(trimmed)) {
				this.keywords.push(trimmed);
				this.orderKeywords();
				this.saveKeywords();
			}
			this.newKeyword = "";
		},
		removeSubreddit(index) {
			this.subreddits.splice(index, 1);
			this.saveSubreddits();
		},
		removeKeyword(index) {
			this.keywords.splice(index, 1);
			this.saveSubreddits();
		},
		removeAll() {
			this.subreddits = [];
			this.saveSubreddits();
		},
		removeAllKeywords() {
			this.keywords = [];
			this.saveSubreddits();
		},
		orderKeywords() {
			this.keywords = this.keywords.slice().sort((a, b) => a.localeCompare(b));
		},
		orderSubReddits() {
			this.subreddits = this.subreddits.slice().sort((a, b) => a.localeCompare(b));
		},
		loadDefault() {
			// Add each default item if not already present.
			this.defaultList.forEach((item) => {
				const normalized = item.trim().toLowerCase();
				if (!this.subreddits.includes(normalized)) {
					this.subreddits.push(normalized);
				}
			});
			this.saveSubreddits();
		},
		updateFilterToggle() {
			// Update storage when the toggle is switched.
			this.saveSubreddits();
		},
		updateKeywordFilterToggle() {
			// Update storage when the toggle is switched.
			this.saveSubreddits();
		},
	},
};
</script>

<template>
	<div class="navbar bg-base-100 shadow-sm">
		<div class="navbar-start">
			<div class="dropdown">
				<div tabindex="0" role="button" class="btn btn-ghost btn-circle">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h7"
						/>
					</svg>
				</div>
				<ul
					tabindex="0"
					class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
				>
					<li><a @click="changeNav('home')">Filter subreddits</a></li>
					<li><a @click="changeNav('keywords')">Filter keywords</a></li>
					<li><a @click="changeNav('about')">About</a></li>
				</ul>
			</div>
		</div>
		<div class="navbar-center">
			<a class="btn btn-ghost text-xl" @click="changeNav('home')">SubSieve</a>
		</div>
		<div class="navbar-end">
			<!-- <button class="btn btn-ghost btn-circle">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</button>
			<button class="btn btn-ghost btn-circle">
				<div class="indicator">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
						/>
					</svg>
					<span class="badge badge-xs badge-primary indicator-item"></span>
				</div>
			</button> -->
		</div>
	</div>
	<div class="card card-border bg-base-100">
		<!-- NOTE - Home page -->
		<div class="card-body" v-if="navigation == 'home'">
			<h2 class="card-title">
				Filtered Subreddits
				<div class="badge badge-soft badge-sm badge-success">{{ subreddits.length }}</div>
			</h2>
			<p>Add as many subreddits as you'd like in the input below, without the "/r/".</p>
			<div class="flex">
				<form @submit.prevent="addSubreddit" class="w-full">
					<div class="join w-full">
						<div class="w-full">
							<label class="input join-item w-full">
								/r/
								<input
									type="text"
									placeholder="Enter subreddit"
									class="w-full"
									v-model="newSubreddit"
								/>
							</label>
						</div>
						<input type="submit" class="btn btn-success join-item" value="Add" />
					</div>
				</form>
			</div>
			<div class="mt-2">
				<label class="fieldset-label">
					<input
						type="checkbox"
						checked="checked"
						class="toggle toggle-success"
						v-model="subFilterEnabled"
						@change="updateFilterToggle()"
					/>
					Enable filters
				</label>
			</div>

			<template v-if="subreddits.length && subFilterEnabled">
				<div class="divider"></div>
				<ul class="list bg-base-100 rounded-box shadow-md">
					<li class="p-4 pb-2 text-xs opacity-60 tracking-wide">
						The following subreddits are currently hidden
					</li>

					<li
						class="list-row flex items-center justify-between p-4"
						v-for="(sub, index) in subreddits"
						:key="index"
					>
						<span>{{ sub }}</span>
						<button
							class="btn btn-square btn-outline btn-ghost btn-xs"
							@click="removeSubreddit(index)"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M6 18 18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</li>
				</ul>
			</template>
			<div class="card-actions justify-end mt-5">
				<div class="join">
					<button class="btn btn-soft btn-success join-item btn-sm" @click="loadDefault">
						Load Default List
					</button>
					<button class="btn btn-soft btn-error join-item btn-sm" @click="removeAll">
						Remove All
					</button>
				</div>
			</div>
		</div>

		<!-- NOTE - Home page -->
		<div class="card-body" v-if="navigation == 'keywords'">
			<h2 class="card-title">
				Filtered Keywords
				<div class="badge badge-soft badge-sm badge-success">{{ keywords.length }}</div>
			</h2>
			<p>Add as many keywords as you'd like in the input below.</p>
			<div class="flex">
				<form @submit.prevent="addKeyword" class="w-full">
					<div class="join w-full">
						<div class="w-full">
							<label class="input join-item w-full">
								<input
									type="text"
									placeholder="Enter keyword"
									class="w-full"
									v-model="newKeyword"
								/>
							</label>
						</div>
						<input type="submit" class="btn btn-success join-item" value="Add" />
					</div>
				</form>
			</div>
			<div class="mt-2">
				<label class="fieldset-label">
					<input
						type="checkbox"
						checked="checked"
						class="toggle toggle-success"
						v-model="keywordFilterEnabled"
						@change="updateKeywordFilterToggle()"
					/>
					Enable filters
				</label>
			</div>

			<template v-if="keywords.length && keywordFilterEnabled">
				<div class="divider"></div>
				<ul class="list bg-base-100 rounded-box shadow-md">
					<li class="p-4 pb-2 text-xs opacity-60 tracking-wide">
						The following keywords are filtered out
					</li>

					<li
						class="list-row flex items-center justify-between p-4"
						v-for="(sub, index) in keywords"
						:key="index"
					>
						<span>{{ sub }}</span>
						<button
							class="btn btn-square btn-outline btn-ghost btn-xs"
							@click="removeKeyword(index)"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M6 18 18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</li>
				</ul>
			</template>
			<div class="card-actions justify-end mt-5">
				<div class="join">
					<!-- <button class="btn btn-soft btn-success join-item btn-sm" @click="loadDefault">
						Load Default List
					</button> -->
					<button
						class="btn btn-soft btn-error join-item btn-sm"
						@click="removeAllKeywords"
					>
						Remove All
					</button>
				</div>
			</div>
		</div>

		<!-- NOTE - About page -->
		<div class="card-body" v-if="navigation == 'about'">
			<h2 class="card-title">About SubSieve</h2>
			<p>
				I originally turned to Reddit for its fun, quirky, and engaging content. Over time,
				however, I found that the constant influx of negativity, relentless political
				debates, doom, gloom, and apocalyptic news began to take a toll on my mental health.
				Much like watching what you eat on a diet, I decided it was time to monitor what I
				consume online.
			</p>
			<p>
				This extension isn’t about sticking my head in the sand or ignoring the world’s
				challenges—it’s about choosing when to engage with heavy news and when to enjoy
				lighthearted entertainment. By filtering out unwanted content on /r/all, I can
				curate my feed, ensuring that I stay informed on my own terms without overwhelming
				my wellbeing.
			</p>
			<p>
				I hope this tool empowers you to take control of your digital diet, so you can enjoy
				Reddit for the fun and inspiration it offers while still having the space to engage
				with the serious issues when you’re ready.
			</p>
			<p>
				<a href="https://github.com/Pr4w/SubSieve">GitHub Repo</a>
			</p>
		</div>
	</div>
</template>

<style>
html,
body {
	width: 600px; /* Fixed width for the entire popup */
	margin: 0;
	padding: 0;
	overflow-x: hidden; /* Prevent horizontal scrolling */
}
</style>
