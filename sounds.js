class SoundManager {
    constructor() {
        this.sounds = {
            click: new Audio('sounds/click.mp3'),
            plant: new Audio('sounds/plant.mp3'),
            water: new Audio('sounds/water.mp3'),
            recycle: new Audio('sounds/recycle.mp3'),
            solar: new Audio('sounds/solar.mp3'),
            levelUp: new Audio('sounds/level-up.mp3')
        };

        // Background music tracks
        this.musicTracks = {
            ambient: new Audio('sounds/ambient.mp3'),
            nature: new Audio('sounds/nature.mp3'),
            peaceful: new Audio('sounds/peaceful.mp3')
        };

        // Music settings
        this.currentTrack = null;
        this.musicEnabled = true;
        this.musicVolume = 0.3; // 30% volume for music

        // Configure music tracks
        Object.values(this.musicTracks).forEach(track => {
            track.loop = true;
            track.volume = this.musicVolume;
        });
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(error => {
                console.log('Error playing sound:', error);
            });
        }
    }

    playMusic(trackName) {
        if (!this.musicEnabled) return;

        // Stop current track if playing
        if (this.currentTrack) {
            this.currentTrack.pause();
            this.currentTrack.currentTime = 0;
        }

        // Start new track
        if (this.musicTracks[trackName]) {
            this.currentTrack = this.musicTracks[trackName];
            this.currentTrack.play().catch(error => {
                console.log('Error playing music:', error);
            });
        }
    }

    stopMusic() {
        if (this.currentTrack) {
            this.currentTrack.pause();
            this.currentTrack.currentTime = 0;
            this.currentTrack = null;
        }
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled && this.currentTrack) {
            this.currentTrack.play();
        } else if (!this.musicEnabled && this.currentTrack) {
            this.currentTrack.pause();
        }
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        Object.values(this.musicTracks).forEach(track => {
            track.volume = this.musicVolume;
        });
        if (this.currentTrack) {
            this.currentTrack.volume = this.musicVolume;
        }
    }
} 