 //how to involve the player / user more

console.log("text");
window.onload = function() {
	console.log("window loaded");
	let app;
	let scenes = {
		yourFirstBattle: {

			url: "media/yourFirstBattle.mp4",
			bpm: 140,
			startPhase: 1,
			nextSceneKey: "yourFirstBattle",
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
				scene: scenes.yourFirstBattle,
				ticks: [],
				bpm: 140,
				blings: [],
				speed: 300,
				record: false,
				startPhase: 7.2,
				offset: 100,
				video: null,
				notes: [],
				characters,
				x:100,
				y: 100,
				t: 0,
				fps: 60,
				tolerance: 0.2,
			}
		},
		created: function() {
			$(document).keydown(this.handleKeyPress);
		},
		computed: {
			videoUrl: function() {
				return this.scene? scene.video : false;
			}
		},
		methods: {
			handleKeyPress(e) {

				if (this.video) {
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
					this.x = 100 + Math.sin(this.t) * 100;
					this.y = 100 + Math.cos(this.t) * 100;
					if (this.t >= duration) {
						this.scene = scenes[this.scene.nextSceneKey];
						video.currentTime = 0;
						console.log("done");
					}
					setTimeout(this.tick, 1000/ this.fps);
				}
			},
			saveNotes: function() {
				this.localStorage.notes = this.notes;
			},
			onVideoLoad: function(e) {
				let video = e.target;
				this.video = video;
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
				this.tick();
			},
		},
		created: function() {
			this.tick();
		}
	});



}