class EcoQuest {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.isPlaying = false;
        this.currentMission = null;
        this.selectedTool = null;
        this.trees = [];
        this.waterSources = [];
        this.recyclables = [];
        this.recyclingBin = null;
        this.solarSpots = [];
        this.energyGenerated = 0;
        this.soundEnabled = true;
        this.soundManager = new SoundManager();
        
        // Combo system properties
        this.combo = 0;
        this.lastActionTime = 0;
        this.comboTimeout = 2000; // 2 seconds
        this.comboMultiplier = 1;
        
        // Tutorial system properties
        this.tutorialStep = 0;
        this.tutorialActive = false;
        this.tutorialSteps = [
            {
                message: "Welcome to EcoQuest! Let's learn how to save the planet!",
                highlight: null,
                action: null
            },
            {
                message: "First, select the Tree Planter tool to plant trees and restore forests.",
                highlight: '[data-tool="0"]',
                action: () => this.selectTool(0)
            },
            {
                message: "Click anywhere on the game world to plant a tree. Trees help clean the air!",
                highlight: '#game-world',
                action: null
            },
            {
                message: "Great! Now let's clean up polluted water sources. Select the Water Cleaner tool.",
                highlight: '[data-tool="1"]',
                action: () => this.selectTool(1)
            },
            {
                message: "Click on a polluted water source to clean it. Clean water is essential for life!",
                highlight: '.water-source.polluted',
                action: null
            },
            {
                message: "Next, let's recycle waste materials. Select the Recycler tool.",
                highlight: '[data-tool="2"]',
                action: () => this.selectTool(2)
            },
            {
                message: "Click on recyclable items to send them to the recycling bin. Recycling helps reduce waste!",
                highlight: '.recyclable',
                action: null
            },
            {
                message: "Finally, let's install solar panels. Select the Solar Panel tool.",
                highlight: '[data-tool="3"]',
                action: () => this.selectTool(3)
            },
            {
                message: "Click on a solar spot to install a panel. Solar energy is clean and renewable!",
                highlight: '.solar-spot',
                action: null
            },
            {
                message: "Pro tip: Perform actions quickly to build combos and earn bonus points!",
                highlight: null,
                action: null
            },
            {
                message: "You're ready to save the planet! Good luck!",
                highlight: null,
                action: null
            }
        ];
        
        this.tools = [
            { name: 'Tree Planter', icon: '🌱', description: 'Plant trees to restore forests' },
            { name: 'Water Cleaner', icon: '💧', description: 'Clean polluted water sources' },
            { name: 'Recycler', icon: '♻️', description: 'Recycle waste materials' },
            { name: 'Solar Panel', icon: '☀️', description: 'Install renewable energy sources' }
        ];
        
        // Music settings
        this.musicEnabled = true;
        this.currentMusicTrack = 'ambient';
        
        this.initializeGame();
    }

    initializeGame() {
        // Initialize game elements
        this.gameWorld = document.getElementById('game-world');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.missionText = document.getElementById('mission-text');
        this.toolButtons = document.getElementById('tool-buttons');
        
        // Set up event listeners
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        document.getElementById('pause-game').addEventListener('click', () => this.togglePause());
        document.getElementById('sound-toggle').addEventListener('click', () => this.toggleSound());
        
        // Initialize tools
        this.initializeTools();
        
        // Set up initial mission
        this.setMission('Welcome to EcoQuest! Your mission is to help save the planet by solving environmental challenges.');
        
        // Set up game world click handler
        this.gameWorld.addEventListener('click', (e) => this.handleGameWorldClick(e));
        
        // Add tutorial button
        const tutorialButton = document.createElement('button');
        tutorialButton.id = 'tutorial-button';
        tutorialButton.textContent = '📚 Tutorial';
        tutorialButton.addEventListener('click', () => this.startTutorial());
        document.querySelector('.controls').appendChild(tutorialButton);
        
        // Add music controls
        const musicButton = document.createElement('button');
        musicButton.id = 'music-toggle';
        musicButton.textContent = '🎵';
        musicButton.addEventListener('click', () => this.toggleMusic());
        document.querySelector('.controls').appendChild(musicButton);
        
        // Add music volume slider
        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.id = 'music-volume';
        volumeSlider.min = '0';
        volumeSlider.max = '100';
        volumeSlider.value = '30';
        volumeSlider.addEventListener('input', (e) => this.setMusicVolume(e.target.value / 100));
        document.querySelector('.controls').appendChild(volumeSlider);
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundButton = document.getElementById('sound-toggle');
        soundButton.textContent = this.soundEnabled ? '🔊' : '🔈';
    }

    playSound(soundName) {
        if (this.soundEnabled) {
            this.soundManager.play(soundName);
        }
    }

    initializeTools() {
        this.toolButtons.innerHTML = this.tools.map((tool, index) => `
            <button class="tool-button" title="${tool.description}" data-tool="${index}">
                ${tool.icon}
            </button>
        `).join('');

        // Add click handlers to tool buttons
        this.toolButtons.querySelectorAll('.tool-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const toolIndex = parseInt(e.currentTarget.dataset.tool);
                this.selectTool(toolIndex);
            });
        });
    }

    selectTool(toolIndex) {
        this.selectedTool = this.tools[toolIndex];
        // Update UI to show selected tool
        this.toolButtons.querySelectorAll('.tool-button').forEach(button => {
            button.classList.remove('selected');
        });
        this.toolButtons.querySelector(`[data-tool="${toolIndex}"]`).classList.add('selected');
        this.playSound('click');
    }

    handleGameWorldClick(e) {
        if (!this.isPlaying || !this.selectedTool) return;

        const rect = this.gameWorld.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.selectedTool.name === 'Tree Planter') {
            this.plantTree(x, y);
        } else if (this.selectedTool.name === 'Water Cleaner') {
            this.cleanWater(x, y);
        } else if (this.selectedTool.name === 'Recycler') {
            this.recycleItem(x, y);
        } else if (this.selectedTool.name === 'Solar Panel') {
            this.installSolarPanel(x, y);
        }
    }

    updateCombo() {
        const currentTime = performance.now();
        if (currentTime - this.lastActionTime < this.comboTimeout) {
            this.combo++;
            this.comboMultiplier = Math.min(1 + (this.combo * 0.2), 3); // Max 3x multiplier
            this.showComboText();
        } else {
            this.combo = 1;
            this.comboMultiplier = 1;
        }
        this.lastActionTime = currentTime;
    }

    showComboText() {
        if (this.combo > 1) {
            const comboText = document.createElement('div');
            comboText.className = 'combo-text';
            comboText.textContent = `${this.combo}x Combo!`;
            this.gameWorld.appendChild(comboText);

            // Position the combo text near the last action
            const rect = this.gameWorld.getBoundingClientRect();
            comboText.style.left = `${rect.width / 2}px`;
            comboText.style.top = `${rect.height / 2}px`;

            // Remove the combo text after animation
            setTimeout(() => {
                comboText.remove();
            }, 1000);
        }
    }

    plantTree(x, y) {
        const tree = document.createElement('div');
        tree.className = 'tree';
        tree.style.left = `${x}px`;
        tree.style.top = `${y}px`;
        
        this.gameWorld.appendChild(tree);
        
        this.trees.push({
            element: tree,
            x: x,
            y: y,
            growth: 0
        });

        this.playSound('plant');
        this.updateCombo();

        // Update score with combo multiplier
        const baseScore = 10;
        this.score += Math.round(baseScore * this.comboMultiplier);
        this.updateScore();

        // Check if level should increase
        if (this.trees.length % 5 === 0) {
            this.level++;
            this.updateLevel();
            this.setMission(`Great job! You've planted ${this.trees.length} trees. Keep going!`);
            this.playSound('levelUp');
        }
    }

    startGame() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.score = 0;
            this.level = 1;
            this.energyGenerated = 0;
            this.trees = [];
            this.waterSources = [];
            this.recyclables = [];
            this.solarSpots = [];
            this.gameWorld.innerHTML = ''; // Clear existing elements
            this.updateScore();
            this.updateLevel();
            this.setMission('First mission: Plant trees, clean water, recycle waste, and install solar panels to restore the ecosystem!');
            this.startGameLoop();
            this.generateWaterSources();
            this.createRecyclingBin();
            this.generateRecyclables();
            this.generateSolarSpots();
            
            // Start background music
            this.soundManager.playMusic(this.currentMusicTrack);
        }
    }

    togglePause() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.startGameLoop();
        }
    }

    setMission(text) {
        this.currentMission = text;
        this.missionText.textContent = text;
    }

    updateScore() {
        this.scoreElement.textContent = `Score: ${this.score}`;
    }

    updateLevel() {
        this.levelElement.textContent = `Level: ${this.level}`;
    }

    generateWaterSources() {
        // Generate 3-5 water sources at random positions
        const numSources = Math.floor(Math.random() * 3) + 3; // 3-5 sources
        for (let i = 0; i < numSources; i++) {
            const x = Math.random() * (this.gameWorld.offsetWidth - 60);
            const y = Math.random() * (this.gameWorld.offsetHeight - 60);
            this.createWaterSource(x, y);
        }
    }

    createWaterSource(x, y) {
        const waterSource = document.createElement('div');
        waterSource.className = 'water-source polluted';
        waterSource.style.left = `${x}px`;
        waterSource.style.top = `${y}px`;
        
        this.gameWorld.appendChild(waterSource);
        
        this.waterSources.push({
            element: waterSource,
            x: x,
            y: y,
            pollution: 100,
            isBeingCleaned: false
        });
    }

    cleanWater(x, y) {
        const closestSource = this.findClosestWaterSource(x, y);
        if (closestSource && closestSource.pollution > 0) {
            closestSource.isBeingCleaned = true;
            this.updateCombo();
            const baseScore = 5;
            this.score += Math.round(baseScore * this.comboMultiplier);
            this.updateScore();
            this.playSound('water');
        }
    }

    findClosestWaterSource(x, y) {
        let closest = null;
        let minDistance = Infinity;

        this.waterSources.forEach(source => {
            const distance = Math.sqrt(
                Math.pow(x - source.x, 2) + 
                Math.pow(y - source.y, 2)
            );
            if (distance < minDistance && distance < 50) {
                minDistance = distance;
                closest = source;
            }
        });

        return closest;
    }

    createRecyclingBin() {
        const bin = document.createElement('div');
        bin.className = 'recycling-bin';
        bin.style.left = '20px';
        bin.style.top = '20px';
        this.gameWorld.appendChild(bin);
        this.recyclingBin = {
            element: bin,
            x: 20,
            y: 20
        };
    }

    generateRecyclables() {
        const recyclableTypes = [
            { icon: '🥤', name: 'Plastic Bottle' },
            { icon: '📦', name: 'Cardboard Box' },
            { icon: '🥫', name: 'Metal Can' },
            { icon: '📰', name: 'Newspaper' }
        ];

        // Generate 5-8 recyclable items
        const numItems = Math.floor(Math.random() * 4) + 5;
        for (let i = 0; i < numItems; i++) {
            const type = recyclableTypes[Math.floor(Math.random() * recyclableTypes.length)];
            const x = Math.random() * (this.gameWorld.offsetWidth - 40);
            const y = Math.random() * (this.gameWorld.offsetHeight - 40);
            this.createRecyclable(x, y, type);
        }
    }

    createRecyclable(x, y, type) {
        const recyclable = document.createElement('div');
        recyclable.className = 'recyclable';
        recyclable.style.left = `${x}px`;
        recyclable.style.top = `${y}px`;
        recyclable.innerHTML = type.icon;
        recyclable.title = type.name;
        
        this.gameWorld.appendChild(recyclable);
        
        this.recyclables.push({
            element: recyclable,
            x: x,
            y: y,
            type: type,
            isBeingRecycled: false
        });
    }

    recycleItem(x, y) {
        const closestItem = this.findClosestRecyclable(x, y);
        if (closestItem && !closestItem.isBeingRecycled) {
            closestItem.isBeingRecycled = true;
            this.moveToRecyclingBin(closestItem);
            this.updateCombo();
            this.playSound('recycle');
        }
    }

    findClosestRecyclable(x, y) {
        let closest = null;
        let minDistance = Infinity;

        this.recyclables.forEach(item => {
            const distance = Math.sqrt(
                Math.pow(x - item.x, 2) + 
                Math.pow(y - item.y, 2)
            );
            if (distance < minDistance && distance < 50) {
                minDistance = distance;
                closest = item;
            }
        });

        return closest;
    }

    moveToRecyclingBin(item) {
        const duration = 1000; // 1 second
        const startX = item.x;
        const startY = item.y;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth movement
            const easeProgress = 1 - Math.pow(1 - progress, 2);

            item.x = startX + (this.recyclingBin.x - startX) * easeProgress;
            item.y = startY + (this.recyclingBin.y - startY) * easeProgress;
            item.element.style.left = `${item.x}px`;
            item.element.style.top = `${item.y}px`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Recycling complete
                const baseScore = 15;
                this.score += Math.round(baseScore * this.comboMultiplier);
                this.updateScore();
                item.element.remove();
                this.recyclables = this.recyclables.filter(r => r !== item);

                // Check if all items are recycled
                if (this.recyclables.length === 0) {
                    this.setMission('Great job! All recyclable items have been collected! Keep up the good work!');
                }
            }
        };

        requestAnimationFrame(animate);
    }

    generateSolarSpots() {
        // Generate 3-4 solar panel installation spots
        const numSpots = Math.floor(Math.random() * 2) + 3;
        for (let i = 0; i < numSpots; i++) {
            const x = Math.random() * (this.gameWorld.offsetWidth - 80);
            const y = Math.random() * (this.gameWorld.offsetHeight - 80);
            this.createSolarSpot(x, y);
        }
    }

    createSolarSpot(x, y) {
        const spot = document.createElement('div');
        spot.className = 'solar-spot';
        spot.style.left = `${x}px`;
        spot.style.top = `${y}px`;
        
        this.gameWorld.appendChild(spot);
        
        this.solarSpots.push({
            element: spot,
            x: x,
            y: y,
            hasPanel: false,
            energyLevel: 0
        });
    }

    installSolarPanel(x, y) {
        const closestSpot = this.findClosestSolarSpot(x, y);
        if (closestSpot && !closestSpot.hasPanel) {
            closestSpot.hasPanel = true;
            closestSpot.element.classList.add('has-panel');
            this.updateCombo();
            const baseScore = 20;
            this.score += Math.round(baseScore * this.comboMultiplier);
            this.updateScore();
            this.playSound('solar');
            
            // Check if all spots have panels
            if (this.solarSpots.every(spot => spot.hasPanel)) {
                this.setMission('Excellent! All solar panels are installed! Keep up the great work!');
            }
        }
    }

    findClosestSolarSpot(x, y) {
        let closest = null;
        let minDistance = Infinity;

        this.solarSpots.forEach(spot => {
            const distance = Math.sqrt(
                Math.pow(x - spot.x, 2) + 
                Math.pow(y - spot.y, 2)
            );
            if (distance < minDistance && distance < 50) {
                minDistance = distance;
                closest = spot;
            }
        });

        return closest;
    }

    startGameLoop() {
        if (this.isPlaying) {
            // Update tree growth
            this.trees.forEach(tree => {
                if (tree.growth < 100) {
                    tree.growth += 0.1;
                    tree.element.style.transform = `scale(${0.5 + (tree.growth / 100) * 0.5})`;
                }
            });

            // Update water sources
            this.waterSources.forEach(source => {
                if (source.isBeingCleaned && source.pollution > 0) {
                    source.pollution -= 0.5;
                    source.element.style.filter = `brightness(${1 + (source.pollution / 100)})`;
                    
                    if (source.pollution <= 0) {
                        source.element.classList.remove('polluted');
                        source.element.classList.add('clean');
                        source.isBeingCleaned = false;
                        
                        // Check if all water sources are clean
                        if (this.waterSources.every(s => s.pollution <= 0)) {
                            this.setMission('Great job! All water sources are clean! Keep planting trees, recycling, and installing solar panels!');
                        }
                    }
                }
            });

            // Update solar panels
            this.solarSpots.forEach(spot => {
                if (spot.hasPanel && spot.energyLevel < 100) {
                    spot.energyLevel += 0.1;
                    spot.element.style.setProperty('--energy-level', `${spot.energyLevel}%`);
                    this.energyGenerated += 0.1;
                }
            });

            requestAnimationFrame(() => this.startGameLoop());
        }
    }

    startTutorial() {
        if (this.tutorialActive) return;
        
        this.tutorialActive = true;
        this.tutorialStep = 0;
        this.showTutorialStep();
        
        // Add tutorial overlay
        const overlay = document.createElement('div');
        overlay.id = 'tutorial-overlay';
        document.body.appendChild(overlay);
        
        // Add tutorial message box
        const messageBox = document.createElement('div');
        messageBox.id = 'tutorial-message';
        document.body.appendChild(messageBox);
        
        // Add tutorial controls
        const controls = document.createElement('div');
        controls.id = 'tutorial-controls';
        controls.innerHTML = `
            <button id="tutorial-next">Next</button>
            <button id="tutorial-skip">Skip Tutorial</button>
        `;
        document.body.appendChild(controls);
        
        // Add event listeners
        document.getElementById('tutorial-next').addEventListener('click', () => this.nextTutorialStep());
        document.getElementById('tutorial-skip').addEventListener('click', () => this.endTutorial());
    }

    showTutorialStep() {
        const step = this.tutorialSteps[this.tutorialStep];
        const messageBox = document.getElementById('tutorial-message');
        const overlay = document.getElementById('tutorial-overlay');
        
        // Update message
        messageBox.textContent = step.message;
        
        // Update highlight
        if (step.highlight) {
            const element = document.querySelector(step.highlight);
            if (element) {
                element.classList.add('tutorial-highlight');
            }
        } else {
            document.querySelectorAll('.tutorial-highlight').forEach(el => {
                el.classList.remove('tutorial-highlight');
            });
        }
        
        // Execute action if any
        if (step.action) {
            step.action();
        }
        
        // Update button state
        document.getElementById('tutorial-next').textContent = 
            this.tutorialStep === this.tutorialSteps.length - 1 ? 'Finish' : 'Next';
    }

    nextTutorialStep() {
        if (this.tutorialStep < this.tutorialSteps.length - 1) {
            this.tutorialStep++;
            this.showTutorialStep();
        } else {
            this.endTutorial();
        }
    }

    endTutorial() {
        this.tutorialActive = false;
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
        document.getElementById('tutorial-overlay').remove();
        document.getElementById('tutorial-message').remove();
        document.getElementById('tutorial-controls').remove();
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        const musicButton = document.getElementById('music-toggle');
        musicButton.textContent = this.musicEnabled ? '🎵' : '🔇';
        
        if (this.musicEnabled) {
            this.soundManager.playMusic(this.currentMusicTrack);
        } else {
            this.soundManager.stopMusic();
        }
    }

    setMusicVolume(volume) {
        this.soundManager.setMusicVolume(volume);
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    const game = new EcoQuest();
}); 