console.log("text");
const url = 'https://spreadsheets.google.com/feeds/cells/1G_W2VwxkauhjoE3akiS6VK_2NNZG02wBsrp2KiQ4_gM/1/public/full?alt=json';
window.onload = function() {
	console.log("window loaded");
	let app;
	let scenes = {
		lv1sg1cap: {
			url: "media/level1/LV1SG1CAP_BLACKBG.mp4",
			sceneType: "skill",
			nextScene: "",
		},
		lv1sg1nurse: {
			url: "media/level1/LV1SG1NURSE_BLACKBG.mp4",
			sceneType: "skill",
			nextScene: "",
		},
		lvl1sg1buff: {
			url: "media/level1/LV1SG1BUFF_BLACKBG.mp4",
			sceneType: "skill",
			nextScene: "",
		},
		yourFirstBattle: {

			url: "media/yourFirstBattle.mp4",
			bpm: 140,
			sceneType: "battle",
			startPhase: 7.2,
			decisions: [
				{text: "Captain", targetScene: "lv1sg1cap" },
				{text: "Nurse", targetScene: "lv1sg1nurse" },
				{text: "Buff Wizard", targetScene: "lvl1sg1buff" },

			],
		}
	}

	let characters = [
   {
			name: "captain", 
			skills: ["Trolley Problem"],
			portrait: "media/captain.jpg",
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet risus sed libero dapibus consectetur sit amet ac ante. Sed faucibus sem in eros hendrerit, vel varius quam luctus. Curabitur semper, metus id auctor accumsan, sem nisi molestie magna, et eleifend turpis sapien sit amet tellus. Fusce volutpat interdum massa, vitae posuere felis blandit non. Duis velit enim, aliquam a mi in, rutrum gravida lectus. Nulla imperdiet magna enim, eget euismod magna blandit ac. Donec vel mi et nisl ultrices ornare. Cras elementum pharetra commodo. Vivamus ut lorem vestibulum mauris dapibus egestas sed id tortor. In hac habitasse platea dictumst. Quisque sed massa nec mauris molestie finibus. Donec posuere feugiat elementum.",
		},		
		{
			name: "nurse", 
			portrait: "media/nurse.png",
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet risus sed libero dapibus consectetur sit amet ac ante. Sed faucibus sem in eros hendrerit, vel varius quam luctus. Curabitur semper, metus id auctor accumsan, sem nisi molestie magna, et eleifend turpis sapien sit amet tellus. Fusce volutpat interdum massa, vitae posuere felis blandit non. Duis velit enim, aliquam a mi in, rutrum gravida lectus. Nulla imperdiet magna enim, eget euismod magna blandit ac. Donec vel mi et nisl ultrices ornare. Cras elementum pharetra commodo. Vivamus ut lorem vestibulum mauris dapibus egestas sed id tortor. In hac habitasse platea dictumst. Quisque sed massa nec mauris molestie finibus. Donec posuere feugiat elementum.",
			skills: ["Map-Reading"],
		},	
 	 {
			name: "buff wizard", 
			skills: [],
			portrait: "media/buffWizard.jpg",
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet risus sed libero dapibus consectetur sit amet ac ante. Sed faucibus sem in eros hendrerit, vel varius quam luctus. Curabitur semper, metus id auctor accumsan, sem nisi molestie magna, et eleifend turpis sapien sit amet tellus. Fusce volutpat interdum massa, vitae posuere felis blandit non. Duis velit enim, aliquam a mi in, rutrum gravida lectus. Nulla imperdiet magna enim, eget euismod magna blandit ac. Donec vel mi et nisl ultrices ornare. Cras elementum pharetra commodo. Vivamus ut lorem vestibulum mauris dapibus egestas sed id tortor. In hac habitasse platea dictumst. Quisque sed massa nec mauris molestie finibus. Donec posuere feugiat elementum.",
		},		
	];

$(document).keydown(function(e) {
	if(app) app.handleKeyPress(e);
});


	let track = {
		events: []
	};
	app = new Vue({
		el: "#app",
		vuetify: new Vuetify(),
		data () {
			return {
				sheetCode: '1G_W2VwxkauhjoE3akiS6VK_2NNZG02wBsrp2KiQ4_gM',
				scenes: scenes,
				scene: scenes.yourFirstBattle,
				ticks: [],
				bpm: 140,
				blings: [],
				staffColor: "rgba(177,245,157,1)",
				strokeColor: "rgba(177,245,157, 0.5)",
				speed: 300,
				record: false,
				decisions: null,
				startPhase: 7.2,
				offset: 100,
				video: null,
				mainStyle: "background:radial-gradient(circle, rgba(18,74,2,1) 0%, rgba(114,170,99,1) 100%)",
				insideBoxStyle:"background: rgba(0,0,0,1)",
				notes: [],
				characters,
				x:100,
				y: 100,
				t: 0,
				fps: 60,
				tolerance: 0.2,
			}
		},
		 created: async function() {
			let jsonData = await this.loadJson(1);
			let baseSheet = this.parseSheet(jsonData);
			this.startScene();

		},
		computed: {
			videoUrl: function() {
				return this.scene? scene.video : false;
			}
		},
		methods: {
			startScene: function() {
				this.decisions = null;
				this.bpm = this.scene.bpm;
				this.startPhase = this.scene.startPhase;
				this.tick();

			},
			parseSheet(sheetJson) {
				let entries = sheetJson.feed.entry;
				let colCount = sheetJson.feed.gs$colCount.$t;
				let rowCount = sheetJson.feed.gs$rowCount.$t;
				let rows = [];
				let out = [];
				let headers = [];
				let rowMax = 0;
				for(let row = 0; row < rowCount; row++) {
					rows[row] = {cols: []};
				}
				for (entry of entries) {
					let col = entry['gs$cell'].col - 1;
					let row =  entry['gs$cell'].row - 1;
					rowMax = Math.max(row, rowMax);
					console.log(row, rowMax)
					let cell = { col , row, content: entry.content['$t']};
					console.log(cell);
					if(row == 0) {
						headers[col] = cell.content;
					} else if(cell.content) {
						rows[cell.row].cols[cell.col] = cell;
					}
				}
				for (let i = 1; i <= rowMax; i++) {
					let row = rows[i];
					let object = {};
					for(let keyIndex in headers) {
						let key = headers[keyIndex];
						object[key] = row.cols[keyIndex]? row.cols[keyIndex].content : null;
					}
					out.push(object);
				}
				console.log(out);
				return rows;
			},
			async loadJson(sheetNumber) {
				console.log("Loading scene...");
				let response =  await fetch(`https://spreadsheets.google.com/feeds/cells/${this.sheetCode}/${sheetNumber}/public/full?alt=json`);
				return response.json();
			},
			async makeDecision(decision) {
				this.scene = decision.targetScene;
				this.startScene();

			},
			handleKeyPress(e) {

				if (this.video) {
					console.log(e.keyCode);
					if(e.keyCode == 49) {
						this.video.playbackRate = 1;

					}else if (e.keyCode == 50) {
						this.video.playbackRate = 0.5;
					}else if (e.keyCode == 51) {
						this.video.playbackRate = 0.25;
					}
					console.log(this.video.playbackRate);
					if(this.record) {
						let closestTime = null;
						for(let tick of this.ticks) {
							closestTime = Math.abs(tick.t - this.t) < Math.abs(closestTime - this.t) ?  tick.t : closestTime;
						}
						this.notes.push({t: closestTime});
					} else {
						this.checkHit();
					}

				}				

			},
			checkHit:function() {
				let notes = this.notes;
				for(note of notes) {
					let distance = Math.abs(this.t - note.t);
					if ((distance) < this.tolerance) {
						note.success = true;
					} else if (distance < this.tolerance * 2) {
						note.success = false;
					}
				}
			},
			tick: function() {
				let video = this.$refs.video;
				if (video) {
					let duration = video.duration;

					this.t = video? video.currentTime : 0;
				
					if (this.t >= duration) {
						this.endScene(this.scene);
					} else {
						setTimeout(this.tick, 1000/ this.fps);
					}
				}
			},
			endScene: function(scene) {
				if(scene.decisions) {
					this.decisions = scene.decisions;
				}
			},
			makeDecision: function(decisionMade) {
				console.log(decisionMade);
				this.scene = this.scenes[decisionMade.targetScene];
			},
			saveNotes: function() {
				this.localStorage.notes = this.notes;
			},
			onVideoLoad: function(e) {
				let video = e.target;
				this.video = video;
				if(this.scene.bpm) {
					this.bpm = this.scene.bpm;
					let bpm = this.bpm;
					let startPhase = this.startPhase;
					let videoDuration = video.duration;
					let songDuration = videoDuration - startPhase; 
					let tickDistance = 60 / bpm;
					console.log("onload", startPhase, videoDuration, tickDistance);
					let storedNotes = window.localStorage.notes;
					if(window.localStorage.notes) {
						this.notes = storedNotes;
					}
					for(let i = startPhase; i < videoDuration ; i+=tickDistance) {					
							this.ticks.push({t: i, size: 40, stroke: 3});
							this.ticks.push({t: i + tickDistance / 2, size: 20, stroke: 2});
							this.ticks.push({t: i + tickDistance / 3, size: 10, stroke: 1});
							this.ticks.push({t: i + 2* tickDistance / 3, size: 10, stroke: 1});
							//this.notes.push({t: i });
					}					
				}
				this.tick();
			},
		},
	});



}