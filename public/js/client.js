console.log("text");

let PLAY_NORMAL = 49;
let SLOW_1 = 50;
let SLOW_2 = 51;


const url = 'https://spreadsheets.google.com/feeds/cells/1G_W2VwxkauhjoE3akiS6VK_2NNZG02wBsrp2KiQ4_gM/1/public/full?alt=json';
window.onload = function() {
	console.log("window loaded");
	let app;
	/*
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
			startPhase: 7.2,
			decisions: [
				{text: "Captain", targetScene: "lv1sg1cap" },
				{text: "Nurse", targetScene: "lv1sg1nurse" },
				{text: "Buff Wizard", targetScene: "lvl1sg1buff" },

			],
		}
	}*/

	function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
		console.log("keydown", e)
	});


	let track = {
		events: []
	};
	app = new Vue({
		el: "#app",
		vuetify: new Vuetify(),
		data () {
			return {
				sheetCode: '1Zb4UcljIJ6La89uh9z4cT3cAMzHAHk4X813z2VedwfA',
				scenes: [],
				scenesByName: {},
				sceneKey: "",
				scene: null,
				ticks: [],
				url: null,
				ticksActive: 0,
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
				fps: 24,
				tolerance: 0.2,
			}
		},
		 created: async function() {
			let jsonData = await this.loadJson(1);
			let baseSheet = this.parseSheet(jsonData);
			this.populateSceneInfos(baseSheet);
			this.rawSceneData = baseSheet;
			console.log(this.scenes);
			this.scene = this.scenesByName.yourFirstBattle;
			this.startScene();

		},
		computed: {
			videoUrl: function() {
				return this.scene? scene.video : false;
			},
		},
		methods: {
			getCx: function(note) {
				return (note.t - this.t) * this.speed;
			},
			tickX: function(tick) {
				return (tick.t - this.t) * this.speed;
			},
			changeScene: function(e) {

				console.log("CHANGE SCENE", this.sceneKey);
				this.scene = this.scenesByName[this.sceneKey];
				this.startScene();
			},	
			startScene: async function() {
				console.log("starting Scene");
				console.log(this.scene);
				this.decisions = null;
				if(this.scene.bpm) {
					 this.notes = await this.getNotes(this.scene);
				} else {
					this.notes = [];
				}
				this.bpm = this.scene.bpm;
				this.url = this.scene.url;
				this.startPhase = this.scene.startPhase;

			},
			getNotes: async function(scene) {
				let noteData = await this.loadJson(scene.rhythmSheet);
				let sheetJson = this.parseSheet(noteData);
				for(let note of sheetJson) {
					note.t = parseFloat(note.t);
				}
				return sheetJson;
			},
			populateSceneInfos(levelInfos){
				for(let info of levelInfos) {
					let level = {... info};
					if(level.decisions) {
						console.log(level.decisions);
					 	level.decisions = JSON.parse(level.decisions);
					}
					this.scenes.push(level);
					this.scenesByName[level.level] = level;
				}
				console.log("SCENES", this.scenes);
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
					let cell = { col , row, content: entry.content['$t']};
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
				return out;
			},
			async loadJson(sheetNumber) {
				console.log("Loading scene...");
				let response =  await fetch(`https://spreadsheets.google.com/feeds/cells/${this.sheetCode}/${sheetNumber}/public/full?alt=json`);
				return response.json();
			},

			handleKeyPress(e) {
				console.log("Handle key press...", e);
				if (this.video) {
					console.log(e.keyCode);
					if(e.keyCode == PLAY_NORMAL	) {
						this.video.playbackRate = 1;

					}else if (e.keyCode == SLOW_1) {
						this.video.playbackRate = 0.5;
					}else if (e.keyCode == SLOW_2) {
						this.video.playbackRate = 0.25;
					}
					console.log(this.video.playbackRate);
					if(this.record) {
						let closestTime = null;
						for(let tick of this.ticks) {
							closestTime = Math.abs(tick.t - this.t) < Math.abs(closestTime - this.t) ?  tick.t : closestTime;
						}
						console.log(this.notes);
						this.notes.push({t: closestTime});
					} else {
						this.checkHit();
					}

				}				

			},
			changeVideo: function() {
				this.startScene();

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
			
			startFrameUpdate: async function() {
				this.ticksActive++;
				if(this.ticksActive > 1) {
					throw "DOUBLE TICK BAD";
				}
				let video;
				while(!video) {
					video = this.$refs.video;
				}
				while(this.t <= video.duration) {		
					this.t = video? video.currentTime : 0;
					await timeout(1000/this.fps);

				}
				this.endScene(this.scene);
				this.ticksActive--;
				
			},
			endScene: function(scene) {
				if(scene.decisions) {
					this.decisions = scene.decisions;
				}
			},
			makeDecision: function(decisionMade) {
				console.log(decisionMade);
				this.scene = this.scenesByName[decisionMade.targetScene];
				this.startScene();
			},
			saveNotes: function() {
				this.localStorage.notes = this.notes;
			},
			onVideoLoad: function(e) {
				let video = e.target;
				this.video = video;
				let z = 1;
				if(this.scene.bpm) {
					this.bpm = this.scene.bpm;

					//this.bpm = this.scene.bpm;
					let bpm = parseFloat(this.bpm);
					let startPhase = parseFloat(this.startPhase ? this.startPhase : 0);
					let videoDuration = video.duration;
					let tickDistance = 60 / bpm;
					console.log(tickDistance, bpm, startPhase, videoDuration);
					console.log("onload", startPhase, videoDuration, tickDistance);
					let barCount = videoDuration / tickDistance;

					for(let i = 0; i < barCount ; i++) {
							let tickPlace = i * tickDistance + startPhase;	
							this.ticks.push({t: tickPlace, size: 40, stroke: 3});
							this.ticks.push({t: tickPlace + tickDistance / 2, size: 20, stroke: 2});
							this.ticks.push({t: tickPlace + tickDistance / 3, size: 10, stroke: 1});
							this.ticks.push({t: tickPlace + 2* tickDistance / 3, size: 10, stroke: 1});
					}
					console.log(this.ticks);
				} else {
					console.log("No bpm");
				}
				this.startFrameUpdate ();

			},
		},
	});



}