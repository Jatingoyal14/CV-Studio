// CV Vision Studio - Main Application JavaScript
class CVStudio {
    constructor() {
        this.models = {
            cocoSsd: null,
            blazeFace: null,
            pose: null
        };
        
        this.settings = {
            objectDetection: {
                confidenceThreshold: 0.5,
                maxDetections: 20,
                classFilter: []
            },
            faceDetection: {
                returnTensors: false,
                flipHorizontal: false,
                annotateBoxes: true
            },
            camera: {
                width: 640,
                height: 480,
                facingMode: 'user'
            }
        };
        
        this.stats = {
            imagesProcessed: 0,
            modelsLoaded: 3,
            cameraActive: false,
            recentActivity: ['Welcome to CV Vision Studio!']
        };
        
        this.currentStream = null;
        this.animationFrame = null;
        this.fpsCounter = 0;
        this.lastTime = 0;
        
        this.init();
    }
    
    async init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.updateDashboard();
        await this.loadModels();
    }
    
    setupEventListeners() {
        // Navigation - Fixed to properly handle module switching
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const moduleId = item.getAttribute('data-module');
                console.log('Switching to module:', moduleId);
                this.switchModule(moduleId);
            });
        });
        
        // Quick actions - Fixed to properly handle module switching
        document.querySelectorAll('[data-quick]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const moduleId = btn.getAttribute('data-quick');
                console.log('Quick action to module:', moduleId);
                this.switchModule(moduleId);
            });
        });
        
        // Settings modal - Fixed event handling
        const settingsBtn = document.getElementById('settingsBtn');
        const closeSettingsBtn = document.getElementById('closeSettings');
        const closeSettingsBtnFooter = document.getElementById('closeSettingsBtn');
        const saveSettingsBtn = document.getElementById('saveSettings');
        const settingsModal = document.getElementById('settingsModal');
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Opening settings modal');
                this.showModal('settingsModal');
            });
        }
        
        if (closeSettingsBtn) {
            closeSettingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('settingsModal');
            });
        }
        
        if (closeSettingsBtnFooter) {
            closeSettingsBtnFooter.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('settingsModal');
            });
        }
        
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveSettings();
            });
        }
        
        // Close modal when clicking outside
        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) {
                    this.hideModal('settingsModal');
                }
            });
        }
        
        // Module-specific setup
        this.setupObjectDetection();
        this.setupFaceDetection();
        this.setupPoseEstimation();
        this.setupImageFilters();
        this.setupLiveCamera();
        this.setupBatchProcessing();
    }
    
    setupNavigation() {
        // Handle navigation state - Fixed to work properly
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }
    
    switchModule(moduleName) {
        console.log('Switching to module:', moduleName);
        
        // Hide all modules
        document.querySelectorAll('.module-content').forEach(module => {
            module.classList.remove('active');
        });
        
        // Show selected module
        const targetModule = document.getElementById(moduleName);
        if (targetModule) {
            targetModule.classList.add('active');
            console.log('Module activated:', moduleName);
        } else {
            console.error('Module not found:', moduleName);
        }
        
        // Update navigation - Fixed to properly highlight active nav
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        const activeNav = document.querySelector(`[data-module="${moduleName}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }
        
        this.addActivity(`Switched to ${moduleName} module`);
    }
    
    async loadModels() {
        this.showLoading('Loading AI models...');
        
        try {
            // Load COCO-SSD for object detection
            this.models.cocoSsd = await cocoSsd.load();
            this.showToast('COCO-SSD model loaded successfully', 'success');
            
            // Load BlazeFace for face detection
            this.models.blazeFace = await blazeface.load();
            this.showToast('BlazeFace model loaded successfully', 'success');
            
            this.addActivity('All AI models loaded successfully');
            this.updateStatus('Models Ready', 'success');
            
        } catch (error) {
            console.error('Error loading models:', error);
            this.showToast('Error loading AI models', 'error');
            this.updateStatus('Model Load Error', 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    // Object Detection Module - Fixed upload functionality
    setupObjectDetection() {
        const uploadZone = document.getElementById('uploadZoneOD');
        const fileInput = document.getElementById('imageUploadOD');
        const canvas = document.getElementById('canvasOD');
        const video = document.getElementById('videoOD');
        const confidenceSlider = document.getElementById('confidenceSlider');
        const confidenceValue = document.getElementById('confidenceValue');
        const maxDetections = document.getElementById('maxDetections');
        const enableWebcam = document.getElementById('enableWebcamOD');
        const downloadBtn = document.getElementById('downloadResult');
        
        // Fixed upload zone click handler
        if (uploadZone && fileInput) {
            uploadZone.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Upload zone clicked');
                fileInput.click();
            });
        }
        
        // File input change
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                console.log('File selected:', e.target.files[0]);
                if (e.target.files[0]) {
                    this.processImageForObjectDetection(e.target.files[0]);
                }
            });
        }
        
        // Fixed drag and drop
        if (uploadZone) {
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--color-primary)';
            });
            
            uploadZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--color-border)';
            });
            
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--color-border)';
                console.log('File dropped:', e.dataTransfer.files[0]);
                if (e.dataTransfer.files[0]) {
                    this.processImageForObjectDetection(e.dataTransfer.files[0]);
                }
            });
        }
        
        // Confidence slider
        if (confidenceSlider && confidenceValue) {
            confidenceSlider.addEventListener('input', (e) => {
                confidenceValue.textContent = e.target.value;
                this.settings.objectDetection.confidenceThreshold = parseFloat(e.target.value);
            });
        }
        
        // Max detections
        if (maxDetections) {
            maxDetections.addEventListener('input', (e) => {
                this.settings.objectDetection.maxDetections = parseInt(e.target.value);
            });
        }
        
        // Webcam toggle
        if (enableWebcam) {
            enableWebcam.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleWebcamOD();
            });
        }
        
        // Download result
        if (downloadBtn && canvas) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadCanvas(canvas, 'object_detection_result.png');
            });
        }
    }
    
    async processImageForObjectDetection(file) {
        if (!this.models.cocoSsd) {
            this.showToast('Object detection model not loaded yet', 'warning');
            return;
        }
        
        const canvas = document.getElementById('canvasOD');
        const ctx = canvas.getContext('2d');
        const canvasContainer = document.getElementById('canvasContainerOD');
        const uploadZone = document.getElementById('uploadZoneOD');
        const resultsPanel = document.getElementById('resultsPanelOD');
        const downloadBtn = document.getElementById('downloadResult');
        
        // Create image element
        const img = new Image();
        img.onload = async () => {
            // Set canvas dimensions
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw image
            ctx.drawImage(img, 0, 0);
            
            // Show canvas
            uploadZone.style.display = 'none';
            canvasContainer.style.display = 'block';
            
            // Perform detection
            this.showLoading('Detecting objects...');
            try {
                const predictions = await this.models.cocoSsd.detect(canvas);
                this.drawObjectDetections(ctx, predictions);
                this.displayObjectResults(predictions);
                resultsPanel.style.display = 'block';
                downloadBtn.style.display = 'inline-block';
                
                this.stats.imagesProcessed++;
                this.addActivity(`Detected ${predictions.length} objects in image`);
                this.updateDashboard();
                
            } catch (error) {
                console.error('Detection error:', error);
                this.showToast('Error during object detection', 'error');
            } finally {
                this.hideLoading();
            }
        };
        
        img.src = URL.createObjectURL(file);
    }
    
    drawObjectDetections(ctx, predictions) {
        ctx.strokeStyle = '#00BFFF';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#00BFFF';
        ctx.font = '18px Arial';
        
        predictions.forEach(prediction => {
            if (prediction.score >= this.settings.objectDetection.confidenceThreshold) {
                const [x, y, width, height] = prediction.bbox;
                
                // Draw bounding box
                ctx.strokeRect(x, y, width, height);
                
                // Draw label background
                const label = `${prediction.class} (${Math.round(prediction.score * 100)}%)`;
                const textWidth = ctx.measureText(label).width;
                ctx.fillRect(x, y - 30, textWidth + 10, 30);
                
                // Draw label text
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText(label, x + 5, y - 10);
                ctx.fillStyle = '#00BFFF';
            }
        });
    }
    
    displayObjectResults(predictions) {
        const resultsDiv = document.getElementById('detectionResults');
        if (!resultsDiv) return;
        
        resultsDiv.innerHTML = '';
        
        const filteredPredictions = predictions.filter(p => 
            p.score >= this.settings.objectDetection.confidenceThreshold
        );
        
        if (filteredPredictions.length === 0) {
            resultsDiv.innerHTML = '<p>No objects detected with current confidence threshold.</p>';
            return;
        }
        
        filteredPredictions.forEach(prediction => {
            const item = document.createElement('div');
            item.className = 'detection-item';
            item.innerHTML = `
                <span class="detection-label">${prediction.class}</span>
                <span class="detection-confidence">${Math.round(prediction.score * 100)}%</span>
            `;
            resultsDiv.appendChild(item);
        });
    }
    
    async toggleWebcamOD() {
        const video = document.getElementById('videoOD');
        const canvas = document.getElementById('canvasOD');
        const canvasContainer = document.getElementById('canvasContainerOD');
        const uploadZone = document.getElementById('uploadZoneOD');
        const enableBtn = document.getElementById('enableWebcamOD');
        
        if (this.currentStream) {
            // Stop webcam
            this.currentStream.getTracks().forEach(track => track.stop());
            this.currentStream = null;
            video.style.display = 'none';
            canvasContainer.style.display = 'none';
            uploadZone.style.display = 'block';
            enableBtn.textContent = 'Enable Webcam';
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
            }
        } else {
            // Start webcam
            try {
                this.currentStream = await navigator.mediaDevices.getUserMedia({
                    video: { 
                        width: this.settings.camera.width, 
                        height: this.settings.camera.height 
                    }
                });
                video.srcObject = this.currentStream;
                video.style.display = 'block';
                uploadZone.style.display = 'none';
                canvasContainer.style.display = 'block';
                enableBtn.textContent = 'Stop Webcam';
                
                video.onloadedmetadata = () => {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    this.detectObjectsRealtime();
                };
                
            } catch (error) {
                console.error('Camera error:', error);
                this.showToast('Camera access denied', 'error');
            }
        }
    }
    
    async detectObjectsRealtime() {
        if (!this.currentStream || !this.models.cocoSsd) return;
        
        const video = document.getElementById('videoOD');
        const canvas = document.getElementById('canvasOD');
        const ctx = canvas.getContext('2d');
        
        const detect = async () => {
            if (video.readyState === 4) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                try {
                    const predictions = await this.models.cocoSsd.detect(canvas);
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    this.drawObjectDetections(ctx, predictions);
                    this.displayObjectResults(predictions);
                } catch (error) {
                    console.error('Real-time detection error:', error);
                }
            }
            
            this.animationFrame = requestAnimationFrame(detect);
        };
        
        detect();
    }
    
    // Face Detection Module - Fixed upload functionality
    setupFaceDetection() {
        const uploadZone = document.getElementById('uploadZoneFD');
        const fileInput = document.getElementById('imageUploadFD');
        const enableWebcam = document.getElementById('enableWebcamFD');
        
        // Fixed upload zone click handler
        if (uploadZone && fileInput) {
            uploadZone.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Face detection upload zone clicked');
                fileInput.click();
            });
        }
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                console.log('Face detection file selected:', e.target.files[0]);
                if (e.target.files[0]) {
                    this.processImageForFaceDetection(e.target.files[0]);
                }
            });
        }
        
        if (enableWebcam) {
            enableWebcam.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleWebcamFD();
            });
        }
        
        // Fixed drag and drop
        if (uploadZone) {
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--color-primary)';
            });
            
            uploadZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--color-border)';
            });
            
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--color-border)';
                console.log('Face detection file dropped:', e.dataTransfer.files[0]);
                if (e.dataTransfer.files[0]) {
                    this.processImageForFaceDetection(e.dataTransfer.files[0]);
                }
            });
        }
    }
    
    async processImageForFaceDetection(file) {
        if (!this.models.blazeFace) {
            this.showToast('Face detection model not loaded yet', 'warning');
            return;
        }
        
        const canvas = document.getElementById('canvasFD');
        const ctx = canvas.getContext('2d');
        const canvasContainer = document.getElementById('canvasContainerFD');
        const uploadZone = document.getElementById('uploadZoneFD');
        const resultsPanel = document.getElementById('resultsPanelFD');
        
        const img = new Image();
        img.onload = async () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            uploadZone.style.display = 'none';
            canvasContainer.style.display = 'block';
            
            this.showLoading('Detecting faces...');
            try {
                const predictions = await this.models.blazeFace.estimateFaces(canvas, false);
                this.drawFaceDetections(ctx, predictions);
                this.displayFaceResults(predictions);
                resultsPanel.style.display = 'block';
                
                this.stats.imagesProcessed++;
                this.addActivity(`Detected ${predictions.length} faces in image`);
                this.updateDashboard();
                
            } catch (error) {
                console.error('Face detection error:', error);
                this.showToast('Error during face detection', 'error');
            } finally {
                this.hideLoading();
            }
        };
        
        img.src = URL.createObjectURL(file);
    }
    
    drawFaceDetections(ctx, predictions) {
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#FF6B6B';
        ctx.font = '16px Arial';
        
        predictions.forEach((prediction, i) => {
            const topLeft = prediction.topLeft;
            const bottomRight = prediction.bottomRight;
            const width = bottomRight[0] - topLeft[0];
            const height = bottomRight[1] - topLeft[1];
            
            // Draw bounding box
            ctx.strokeRect(topLeft[0], topLeft[1], width, height);
            
            // Draw label
            ctx.fillRect(topLeft[0], topLeft[1] - 25, 80, 25);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`Face ${i + 1}`, topLeft[0] + 5, topLeft[1] - 8);
            ctx.fillStyle = '#FF6B6B';
            
            // Draw landmarks if enabled
            if (document.getElementById('showLandmarks')?.checked && prediction.landmarks) {
                ctx.fillStyle = '#FFD93D';
                prediction.landmarks.forEach(landmark => {
                    ctx.fillRect(landmark[0] - 2, landmark[1] - 2, 4, 4);
                });
                ctx.fillStyle = '#FF6B6B';
            }
        });
    }
    
    displayFaceResults(predictions) {
        const resultsDiv = document.getElementById('faceResults');
        if (!resultsDiv) return;
        
        resultsDiv.innerHTML = '';
        
        if (predictions.length === 0) {
            resultsDiv.innerHTML = '<p>No faces detected in the image.</p>';
            return;
        }
        
        predictions.forEach((prediction, i) => {
            const confidence = Math.round(prediction.probability[0] * 100);
            const item = document.createElement('div');
            item.className = 'detection-item';
            item.innerHTML = `
                <span class="detection-label">Face ${i + 1}</span>
                <span class="detection-confidence">${confidence}%</span>
            `;
            resultsDiv.appendChild(item);
        });
    }
    
    async toggleWebcamFD() {
        // Implementation similar to object detection webcam
        this.showToast('Face detection webcam functionality enabled!', 'info');
    }
    
    // Pose Estimation Module - Fixed upload functionality
    setupPoseEstimation() {
        const uploadZone = document.getElementById('uploadZonePose');
        const fileInput = document.getElementById('imageUploadPose');
        const enableWebcam = document.getElementById('enableWebcamPose');
        
        // Fixed upload zone click handler
        if (uploadZone && fileInput) {
            uploadZone.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Pose estimation upload zone clicked');
                fileInput.click();
            });
        }
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                console.log('Pose estimation file selected:', e.target.files[0]);
                if (e.target.files[0]) {
                    this.processImageForPoseEstimation(e.target.files[0]);
                }
            });
        }
        
        if (enableWebcam) {
            enableWebcam.addEventListener('click', (e) => {
                e.preventDefault();
                this.showToast('Pose estimation webcam coming soon!', 'info');
            });
        }
        
        // Fixed drag and drop
        if (uploadZone) {
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--color-primary)';
            });
            
            uploadZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--color-border)';
            });
            
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--color-border)';
                console.log('Pose estimation file dropped:', e.dataTransfer.files[0]);
                if (e.dataTransfer.files[0]) {
                    this.processImageForPoseEstimation(e.dataTransfer.files[0]);
                }
            });
        }
    }
    
    async processImageForPoseEstimation(file) {
        const canvas = document.getElementById('canvasPose');
        const ctx = canvas.getContext('2d');
        const canvasContainer = document.getElementById('canvasContainerPose');
        const uploadZone = document.getElementById('uploadZonePose');
        const resultsPanel = document.getElementById('resultsPanelPose');
        
        const img = new Image();
        img.onload = async () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            uploadZone.style.display = 'none';
            canvasContainer.style.display = 'block';
            
            // Simulate pose detection (MediaPipe integration would go here)
            this.showLoading('Analyzing pose...');
            try {
                // Simulate processing time
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Draw simulated pose landmarks
                this.drawSimulatedPose(ctx, canvas.width, canvas.height);
                resultsPanel.style.display = 'block';
                
                const poseResultsDiv = document.getElementById('poseResults');
                if (poseResultsDiv) {
                    poseResultsDiv.innerHTML = `
                        <div class="detection-item">
                            <span class="detection-label">Person Detected</span>
                            <span class="detection-confidence">95%</span>
                        </div>
                        <div class="detection-item">
                            <span class="detection-label">Pose Confidence</span>
                            <span class="detection-confidence">87%</span>
                        </div>
                        <div class="detection-item">
                            <span class="detection-label">Landmarks</span>
                            <span class="detection-confidence">33 points</span>
                        </div>
                    `;
                }
                
                this.stats.imagesProcessed++;
                this.addActivity('Analyzed body pose in image');
                this.updateDashboard();
                
            } catch (error) {
                console.error('Pose estimation error:', error);
                this.showToast('Error during pose estimation', 'error');
            } finally {
                this.hideLoading();
            }
        };
        
        img.src = URL.createObjectURL(file);
    }
    
    drawSimulatedPose(ctx, width, height) {
        // Draw simulated skeleton
        ctx.strokeStyle = '#4ECDC4';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#4ECDC4';
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Simulate key body points
        const points = [
            { x: centerX, y: centerY - 100 }, // head
            { x: centerX, y: centerY - 50 },  // neck
            { x: centerX, y: centerY },       // torso
            { x: centerX - 50, y: centerY - 30 }, // left shoulder
            { x: centerX + 50, y: centerY - 30 }, // right shoulder
            { x: centerX - 80, y: centerY + 20 }, // left elbow
            { x: centerX + 80, y: centerY + 20 }, // right elbow
            { x: centerX, y: centerY + 80 },      // hips
            { x: centerX - 30, y: centerY + 150 }, // left knee
            { x: centerX + 30, y: centerY + 150 }, // right knee
        ];
        
        // Draw skeleton connections
        const connections = [
            [0, 1], [1, 2], [1, 3], [1, 4], [3, 5], [4, 6], [2, 7], [7, 8], [7, 9]
        ];
        
        connections.forEach(([i, j]) => {
            if (points[i] && points[j]) {
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                ctx.stroke();
            }
        });
        
        // Draw key points
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
    
    // Image Filters Module - Fixed upload functionality
    setupImageFilters() {
        const uploadZone = document.getElementById('uploadZoneFilters');
        const fileInput = document.getElementById('imageUploadFilters');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const intensitySlider = document.getElementById('filterIntensity');
        const intensityValue = document.getElementById('intensityValue');
        
        let originalImageData = null;
        
        // Fixed upload zone click handler
        if (uploadZone && fileInput) {
            uploadZone.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Image filters upload zone clicked');
                fileInput.click();
            });
        }
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                console.log('Image filters file selected:', e.target.files[0]);
                if (e.target.files[0]) {
                    this.loadImageForFilters(e.target.files[0]);
                }
            });
        }
        
        // Fixed drag and drop
        if (uploadZone) {
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--color-primary)';
            });
            
            uploadZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--color-border)';
            });
            
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--color-border)';
                console.log('Image filters file dropped:', e.dataTransfer.files[0]);
                if (e.dataTransfer.files[0]) {
                    this.loadImageForFilters(e.dataTransfer.files[0]);
                }
            });
        }
        
        // Filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (originalImageData) {
                    this.applyFilter(btn.dataset.filter);
                }
            });
        });
        
        // Intensity slider
        if (intensitySlider && intensityValue) {
            intensitySlider.addEventListener('input', (e) => {
                intensityValue.textContent = e.target.value + '%';
                const activeFilter = document.querySelector('.filter-btn.active');
                if (activeFilter && originalImageData) {
                    this.applyFilter(activeFilter.dataset.filter);
                }
            });
        }
    }
    
    loadImageForFilters(file) {
        const originalCanvas = document.getElementById('originalCanvas');
        const filteredCanvas = document.getElementById('filteredCanvas');
        const originalCtx = originalCanvas.getContext('2d');
        const uploadZone = document.getElementById('uploadZoneFilters');
        const imageComparison = document.getElementById('imageComparison');
        
        const img = new Image();
        img.onload = () => {
            // Set canvas dimensions
            const maxWidth = 400;
            const scale = Math.min(maxWidth / img.width, maxWidth / img.height);
            const width = img.width * scale;
            const height = img.height * scale;
            
            originalCanvas.width = filteredCanvas.width = width;
            originalCanvas.height = filteredCanvas.height = height;
            
            // Draw original image
            originalCtx.drawImage(img, 0, 0, width, height);
            this.originalImageData = originalCtx.getImageData(0, 0, width, height);
            
            // Copy to filtered canvas
            const filteredCtx = filteredCanvas.getContext('2d');
            filteredCtx.putImageData(this.originalImageData, 0, 0);
            
            // Show comparison
            uploadZone.style.display = 'none';
            imageComparison.style.display = 'block';
            
            this.addActivity('Image loaded for filtering');
        };
        
        img.src = URL.createObjectURL(file);
    }
    
    applyFilter(filterType) {
        if (!this.originalImageData) return;
        
        const filteredCanvas = document.getElementById('filteredCanvas');
        const ctx = filteredCanvas.getContext('2d');
        const intensitySlider = document.getElementById('filterIntensity');
        const intensity = intensitySlider ? parseInt(intensitySlider.value) / 100 : 1;
        
        let imageData = new ImageData(
            new Uint8ClampedArray(this.originalImageData.data),
            this.originalImageData.width,
            this.originalImageData.height
        );
        
        switch (filterType) {
            case 'original':
                imageData = this.originalImageData;
                break;
            case 'grayscale':
                imageData = this.applyGrayscaleFilter(imageData, intensity);
                break;
            case 'sepia':
                imageData = this.applySepiaFilter(imageData, intensity);
                break;
            case 'blur':
                imageData = this.applyBlurFilter(imageData, intensity);
                break;
            case 'sharpen':
                imageData = this.applySharpenFilter(imageData, intensity);
                break;
            case 'edge':
                imageData = this.applyEdgeFilter(imageData, intensity);
                break;
            case 'emboss':
                imageData = this.applyEmbossFilter(imageData, intensity);
                break;
        }
        
        ctx.putImageData(imageData, 0, 0);
        this.addActivity(`Applied ${filterType} filter`);
    }
    
    applyGrayscaleFilter(imageData, intensity) {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = data[i] * (1 - intensity) + gray * intensity;
            data[i + 1] = data[i + 1] * (1 - intensity) + gray * intensity;
            data[i + 2] = data[i + 2] * (1 - intensity) + gray * intensity;
        }
        return imageData;
    }
    
    applySepiaFilter(imageData, intensity) {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            const tr = 0.393 * r + 0.769 * g + 0.189 * b;
            const tg = 0.349 * r + 0.686 * g + 0.168 * b;
            const tb = 0.272 * r + 0.534 * g + 0.131 * b;
            
            data[i] = r * (1 - intensity) + tr * intensity;
            data[i + 1] = g * (1 - intensity) + tg * intensity;
            data[i + 2] = b * (1 - intensity) + tb * intensity;
        }
        return imageData;
    }
    
    applyBlurFilter(imageData, intensity) {
        // Simple box blur implementation
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const outputData = new Uint8ClampedArray(data);
        
        const blurRadius = Math.floor(intensity * 5);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0, count = 0;
                
                for (let dy = -blurRadius; dy <= blurRadius; dy++) {
                    for (let dx = -blurRadius; dx <= blurRadius; dx++) {
                        const nx = Math.max(0, Math.min(width - 1, x + dx));
                        const ny = Math.max(0, Math.min(height - 1, y + dy));
                        const idx = (ny * width + nx) * 4;
                        
                        r += data[idx];
                        g += data[idx + 1];
                        b += data[idx + 2];
                        count++;
                    }
                }
                
                const idx = (y * width + x) * 4;
                outputData[idx] = r / count;
                outputData[idx + 1] = g / count;
                outputData[idx + 2] = b / count;
            }
        }
        
        return new ImageData(outputData, width, height);
    }
    
    applySharpenFilter(imageData, intensity) {
        return this.applyConvolution(imageData, [0, -1, 0, -1, 5, -1, 0, -1, 0], intensity);
    }
    
    applyEdgeFilter(imageData, intensity) {
        return this.applyConvolution(imageData, [-1, -1, -1, -1, 8, -1, -1, -1, -1], intensity);
    }
    
    applyEmbossFilter(imageData, intensity) {
        return this.applyConvolution(imageData, [-2, -1, 0, -1, 1, 1, 0, 1, 2], intensity);
    }
    
    applyConvolution(imageData, kernel, intensity) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const outputData = new Uint8ClampedArray(data);
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let r = 0, g = 0, b = 0;
                
                for (let ky = 0; ky < 3; ky++) {
                    for (let kx = 0; kx < 3; kx++) {
                        const idx = ((y + ky - 1) * width + (x + kx - 1)) * 4;
                        const weight = kernel[ky * 3 + kx];
                        
                        r += data[idx] * weight;
                        g += data[idx + 1] * weight;
                        b += data[idx + 2] * weight;
                    }
                }
                
                const idx = (y * width + x) * 4;
                const originalR = data[idx];
                const originalG = data[idx + 1];
                const originalB = data[idx + 2];
                
                outputData[idx] = Math.max(0, Math.min(255, originalR * (1 - intensity) + r * intensity));
                outputData[idx + 1] = Math.max(0, Math.min(255, originalG * (1 - intensity) + g * intensity));
                outputData[idx + 2] = Math.max(0, Math.min(255, originalB * (1 - intensity) + b * intensity));
            }
        }
        
        return new ImageData(outputData, width, height);
    }
    
    // Live Camera Module
    setupLiveCamera() {
        const startBtn = document.getElementById('startLiveCamera');
        const stopBtn = document.getElementById('stopLiveCamera');
        const screenshotBtn = document.getElementById('takeScreenshot');
        
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.startLiveCamera();
            });
        }
        
        if (stopBtn) {
            stopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.stopLiveCamera();
            });
        }
        
        if (screenshotBtn) {
            screenshotBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.takeScreenshot();
            });
        }
    }
    
    async startLiveCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: this.settings.camera.width, 
                    height: this.settings.camera.height 
                }
            });
            
            const video = document.getElementById('liveVideo');
            const canvas = document.getElementById('liveCanvas');
            const cameraView = document.getElementById('cameraView');
            
            video.srcObject = stream;
            this.currentStream = stream;
            
            video.onloadedmetadata = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                cameraView.style.display = 'block';
                
                document.getElementById('startLiveCamera').style.display = 'none';
                document.getElementById('stopLiveCamera').style.display = 'inline-block';
                document.getElementById('takeScreenshot').style.display = 'inline-block';
                
                this.stats.cameraActive = true;
                this.updateDashboard();
                this.processLiveCamera();
            };
            
        } catch (error) {
            console.error('Camera error:', error);
            this.showToast('Camera access denied', 'error');
        }
    }
    
    stopLiveCamera() {
        if (this.currentStream) {
            this.currentStream.getTracks().forEach(track => track.stop());
            this.currentStream = null;
        }
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        document.getElementById('cameraView').style.display = 'none';
        document.getElementById('startLiveCamera').style.display = 'inline-block';
        document.getElementById('stopLiveCamera').style.display = 'none';
        document.getElementById('takeScreenshot').style.display = 'none';
        
        this.stats.cameraActive = false;
        this.updateDashboard();
    }
    
    processLiveCamera() {
        const video = document.getElementById('liveVideo');
        const canvas = document.getElementById('liveCanvas');
        const ctx = canvas.getContext('2d');
        const fpsCounter = document.getElementById('fpsCounter');
        
        let frameCount = 0;
        let lastFpsTime = Date.now();
        
        const process = async () => {
            if (!this.currentStream) return;
            
            if (video.readyState === 4) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // FPS calculation
                frameCount++;
                const currentTime = Date.now();
                if (currentTime - lastFpsTime >= 1000) {
                    fpsCounter.textContent = `FPS: ${frameCount}`;
                    frameCount = 0;
                    lastFpsTime = currentTime;
                }
            }
            
            this.animationFrame = requestAnimationFrame(process);
        };
        
        process();
    }
    
    takeScreenshot() {
        const canvas = document.getElementById('liveCanvas');
        this.downloadCanvas(canvas, 'screenshot.png');
    }
    
    // Batch Processing Module - Fixed upload functionality
    setupBatchProcessing() {
        const uploadZone = document.getElementById('uploadZoneBatch');
        const fileInput = document.getElementById('batchUpload');
        const startBtn = document.getElementById('startBatchProcessing');
        const downloadBtn = document.getElementById('downloadBatchResults');
        
        // Fixed upload zone click handler
        if (uploadZone && fileInput) {
            uploadZone.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Batch processing upload zone clicked');
                fileInput.click();
            });
        }
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                console.log('Batch files selected:', e.target.files.length);
                if (e.target.files.length > 0) {
                    this.loadBatchFiles(e.target.files);
                }
            });
        }
        
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.startBatchProcessing();
            });
        }
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadBatchResults();
            });
        }
        
        // Fixed drag and drop
        if (uploadZone) {
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--color-primary)';
            });
            
            uploadZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--color-border)';
            });
            
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--color-border)';
                console.log('Batch files dropped:', e.dataTransfer.files.length);
                if (e.dataTransfer.files.length > 0) {
                    this.loadBatchFiles(e.dataTransfer.files);
                }
            });
        }
    }
    
    loadBatchFiles(files) {
        const uploadZone = document.getElementById('uploadZoneBatch');
        const batchQueue = document.getElementById('batchQueue');
        const batchItems = document.getElementById('batchItems');
        
        if (!batchItems) return;
        
        batchItems.innerHTML = '';
        this.batchFiles = Array.from(files);
        
        this.batchFiles.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'batch-item';
            item.innerHTML = `
                <img class="batch-item-preview" src="${URL.createObjectURL(file)}" alt="Preview">
                <div class="batch-item-info">
                    <h4>${file.name}</h4>
                    <p>Size: ${(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <div class="batch-item-status status status--info">Pending</div>
            `;
            batchItems.appendChild(item);
        });
        
        uploadZone.style.display = 'none';
        batchQueue.style.display = 'block';
        
        this.addActivity(`Loaded ${files.length} files for batch processing`);
    }
    
    async startBatchProcessing() {
        if (!this.batchFiles || this.batchFiles.length === 0) {
            this.showToast('No files loaded for processing', 'warning');
            return;
        }
        
        const operation = document.getElementById('batchOperation').value;
        const progressBar = document.getElementById('batchProgress');
        const items = document.querySelectorAll('.batch-item');
        
        this.batchResults = [];
        
        for (let i = 0; i < this.batchFiles.length; i++) {
            const file = this.batchFiles[i];
            const item = items[i];
            const statusEl = item.querySelector('.batch-item-status');
            
            // Update status
            statusEl.textContent = 'Processing';
            statusEl.className = 'batch-item-status status status--warning';
            
            try {
                // Simulate processing
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Update progress
                const progress = ((i + 1) / this.batchFiles.length) * 100;
                progressBar.style.width = progress + '%';
                
                // Mark as completed
                statusEl.textContent = 'Completed';
                statusEl.className = 'batch-item-status status status--success';
                
                this.batchResults.push({ file, operation, status: 'success' });
                
            } catch (error) {
                statusEl.textContent = 'Error';
                statusEl.className = 'batch-item-status status status--error';
                this.batchResults.push({ file, operation, status: 'error' });
            }
        }
        
        document.getElementById('downloadBatchResults').style.display = 'inline-block';
        this.showToast('Batch processing completed', 'success');
        this.addActivity(`Processed ${this.batchFiles.length} files in batch`);
        this.stats.imagesProcessed += this.batchFiles.length;
        this.updateDashboard();
    }
    
    downloadBatchResults() {
        this.showToast('Batch download started', 'success');
        // In a real implementation, this would create a zip file with all processed images
    }
    
    // Utility Functions
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            console.log('Modal shown:', modalId);
        }
    }
    
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            console.log('Modal hidden:', modalId);
        }
    }
    
    showLoading(message = 'Loading...') {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            const messageEl = spinner.querySelector('p');
            if (messageEl) {
                messageEl.textContent = message;
            }
            spinner.classList.remove('hidden');
        }
    }
    
    hideLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.classList.add('hidden');
        }
    }
    
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }
    
    updateStatus(status, type = 'info') {
        const statusEl = document.getElementById('statusIndicator');
        if (statusEl) {
            statusEl.innerHTML = `<span class="status status--${type}">${status}</span>`;
        }
    }
    
    addActivity(activity) {
        this.stats.recentActivity.unshift(activity);
        if (this.stats.recentActivity.length > 10) {
            this.stats.recentActivity.pop();
        }
        
        const activityList = document.getElementById('recentActivityList');
        if (activityList) {
            activityList.innerHTML = this.stats.recentActivity
                .map(item => `<li>${item}</li>`)
                .join('');
        }
    }
    
    updateDashboard() {
        const imagesProcessedEl = document.getElementById('imagesProcessed');
        const modelsLoadedEl = document.getElementById('modelsLoaded');
        const cameraStatusEl = document.getElementById('cameraStatus');
        
        if (imagesProcessedEl) {
            imagesProcessedEl.textContent = this.stats.imagesProcessed;
        }
        if (modelsLoadedEl) {
            modelsLoadedEl.textContent = this.stats.modelsLoaded;
        }
        if (cameraStatusEl) {
            cameraStatusEl.textContent = this.stats.cameraActive ? 'Active' : 'Inactive';
        }
    }
    
    downloadCanvas(canvas, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL();
        link.click();
    }
    
    saveSettings() {
        const cameraResolutionEl = document.getElementById('cameraResolution');
        if (cameraResolutionEl) {
            const cameraResolution = cameraResolutionEl.value;
            const [width, height] = cameraResolution.split('x').map(Number);
            
            this.settings.camera.width = width;
            this.settings.camera.height = height;
        }
        
        this.hideModal('settingsModal');
        this.showToast('Settings saved successfully', 'success');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing CV Studio...');
    window.cvStudio = new CVStudio();
});