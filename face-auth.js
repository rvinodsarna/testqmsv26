// QMS RISE v26.0 — Secure Face Authentication
(function() {
  "use strict";

  const FACE_AUTH_CONFIG = {
    MODEL_URL: "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model",
    DETECTION_OPTIONS: { maxResults: 1, scoreThreshold: 0.5, iouThreshold: 0.3 },
    RECOGNITION_THRESHOLD: 0.6,
    LOAD_TIMEOUT: 30000,
    VIDEO_CONSTRAINTS: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }
  };

  class FaceAuthenticator {
    constructor() {
      this.modelsLoaded = false;
      this.videoElement = null;
      this.faceMatcher = null;
      this.isProcessing = false;
      this.labeledDescriptors = [];
    }

    async init() {
      try {
        console.log("[FaceAuth] 🔒 Initializing face authentication...");
        
        if (!window.QMS_READY) {
          throw new Error("QMS config not loaded");
        }
        await window.QMS_READY;

        if (!window.QMS_CONFIG || !window.supabaseClient) {
          throw new Error("Supabase client not initialized");
        }

        await this.loadModels();
        await this.loadRegisteredFaces();

        console.log("[FaceAuth] ✅ Face authentication ready");
        return true;

      } catch (error) {
        console.error("[FaceAuth] ❌ Initialization failed:", error);
        this.showError("Face authentication unavailable: " + error.message);
        return false;
      }
    }

    async loadModels() {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Model load timeout (>30s)")), FACE_AUTH_CONFIG.LOAD_TIMEOUT);
      });

      const loadPromise = (async () => {
        if (typeof faceapi === "undefined") {
          throw new Error("face-api.js not loaded");
        }

        const modelsToLoad = ["tiny_face_detector_model", "face_landmark_68_model", "face_recognition_model"];

        await Promise.all(
          modelsToLoad.map(model => faceapi.nets[model].loadFromUri(FACE_AUTH_CONFIG.MODEL_URL))
        );

        this.modelsLoaded = true;
        console.log("[FaceAuth] ✅ Models loaded");
      })();

      await Promise.race([loadPromise, timeoutPromise]);
    }

    async loadRegisteredFaces() {
      try {
        const { data: faces, error } = await window.supabaseClient
          .from("face_descriptors")
          .select("user_id, descriptor")
          .eq("active", true);

        if (error) {
          console.warn("[FaceAuth] Could not load face descriptors:", error.message);
          return;
        }

        if (!faces || faces.length === 0) {
          console.log("[FaceAuth] No registered faces found");
          return;
        }

        this.labeledDescriptors = faces.map(f => {
          const descriptor = new Float32Array(JSON.parse(f.descriptor));
          return new faceapi.LabeledFaceDescriptors(f.user_id, [descriptor]);
        });

        this.faceMatcher = new faceapi.FaceMatcher(this.labeledDescriptors, FACE_AUTH_CONFIG.RECOGNITION_THRESHOLD);
        console.log("[FaceAuth] ✅ Loaded", this.labeledDescriptors.length, "registered faces");

      } catch (error) {
        console.error("[FaceAuth] Error loading faces:", error);
      }
    }

    async startVideo(videoElementId) {
      if (this.isProcessing) {
        throw new Error("Face recognition already in progress");
      }

      this.videoElement = document.getElementById(videoElementId);
      if (!this.videoElement) {
        throw new Error("Video element not found: " + videoElementId);
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: FACE_AUTH_CONFIG.VIDEO_CONSTRAINTS
        });

        this.videoElement.srcObject = stream;
        await new Promise((resolve) => {
          this.videoElement.onloadedmetadata = () => {
            this.videoElement.play();
            resolve();
          };
        });

        console.log("[FaceAuth] ✅ Video started");
        return true;

      } catch (error) {
        console.error("[FaceAuth] Video error:", error);
        if (error.name === "NotAllowedError") {
          this.showError("Camera permission denied. Please allow camera access.");
        } else if (error.name === "NotFoundError") {
          this.showError("No camera found on this device.");
        }
        throw error;
      }
    }

    stopVideo() {
      if (this.videoElement && this.videoElement.srcObject) {
        this.videoElement.srcObject.getTracks().forEach(track => track.stop());
        this.videoElement.srcObject = null;
        console.log("[FaceAuth] Video stopped");
      }
    }

    async recognizeFace() {
      if (!this.modelsLoaded || !this.videoElement || this.isProcessing) {
        return null;
      }

      this.isProcessing = true;

      try {
        const detection = await faceapi
          .detectSingleFace(this.videoElement, FACE_AUTH_CONFIG.DETECTION_OPTIONS)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detection) {
          console.log("[FaceAuth] No face detected");
          return null;
        }

        if (!this.faceMatcher) {
          console.warn("[FaceAuth] No face matcher available");
          return null;
        }

        const match = this.faceMatcher.findBestMatch(detection.descriptor);
        const confidence = match.distance < FACE_AUTH_CONFIG.RECOGNITION_THRESHOLD;

        console.log("[FaceAuth] Recognition result:", match.label, "confidence:", confidence);

        if (confidence) {
          return { userId: match.label, confidence: confidence, distance: match.distance };
        }

        return null;

      } catch (error) {
        console.error("[FaceAuth] Recognition error:", error);
        return null;

      } finally {
        this.isProcessing = false;
      }
    }

    showError(message) {
      const container = document.getElementById("toast-container") || document.body;
      const toast = document.createElement("div");
      toast.style.cssText = 
        "position:fixed;top:24px;right:24px;max-width:400px;z-index:10000;" +
        "padding:16px;border-radius:8px;background:#fee2e2;color:#991b1b;" +
        "font:14px system-ui,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.2);" +
        "animation:slideIn .3s ease;";
      toast.textContent = "⚠️ " + message;
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 5000);
    }
  }

  window.FaceAuthenticator = FaceAuthenticator;
  window.FACE_AUTH_CONFIG = FACE_AUTH_CONFIG;

  console.log("[FaceAuth] 📦 Face authentication module loaded");
})();
