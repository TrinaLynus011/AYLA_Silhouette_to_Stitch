"use client";

import { useEffect, useRef, useState } from "react";
import { BodyType } from "@/types";
import { inferBodyTypeFromImage } from "@/utils/bodyTypeInference";
import { detectUndertoneFromImage } from "@/utils/undertoneFromImage";

interface ImageCaptureProps {
  onBodyTypeDetected: (bodyType: BodyType) => void;
  onSwitchToManual: () => void;
}

export default function ImageCapture({
  onBodyTypeDetected,
  onSwitchToManual,
}: ImageCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [frameLocked, setFrameLocked] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  /* ---------------- CAMERA CONTROL ---------------- */

  const startCamera = async () => {
    try {
      setError(null);
      setVideoReady(false);
      setCameraOn(false);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      
      streamRef.current = stream;
      const video = videoRef.current;
      
      if (!video) {
        setError("Video element not ready");
        return;
      }

      video.srcObject = stream;
      video.playsInline = true;
      video.muted = true;
      
      // Wait for actual video playback
      video.onloadedmetadata = () => {
        video.play().then(() => {
          setCameraOn(true);
          // Check readiness after a brief delay
          setTimeout(() => {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              setVideoReady(true);
            } else {
              // Force ready after timeout
              setTimeout(() => setVideoReady(true), 500);
            }
          }, 300);
        }).catch((playErr) => {
          console.error("Play error:", playErr);
          setError("Video playback failed. Try clicking Start again.");
        });
      };
      
    } catch (e: any) {
      console.error("Camera error:", e);
      if (e?.name === "NotAllowedError") {
        setError("Camera permission denied. Please allow access.");
      } else if (e?.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else {
        setError("Unable to start camera: " + (e.message || "Unknown error"));
      }
      setCameraOn(false);
      setVideoReady(false);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
    setVideoReady(false);
  };

  /* ---------------- CAPTURE ---------------- */

  const captureFromCamera = async () => {
    const video = videoRef.current;
    if (!video) {
      setError("No video element");
      return;
    }

    console.log("Capture: videoWidth=", video.videoWidth, "videoHeight=", video.videoHeight);

    // Always use canvas method for simplicity
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError("Canvas context failed");
      return;
    }
    
    try {
      ctx.drawImage(video, 0, 0, w, h);
      const image = canvas.toDataURL("image/jpeg", 0.95);
      
      console.log("Captured image data length:", image.length);
      
      if (image.length < 1000) {
        setError("Image capture too small. Wait for preview to stabilize.");
        return;
      }
      
      setImageSrc(image);
      setFrameLocked(true);
      stopCamera();
    } catch (e) {
      console.error("Capture error:", e);
      setError("Capture failed: " + (e as Error).message);
    }
  };

  /* ---------------- UPLOAD ---------------- */

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setFrameLocked(true);
    };
    reader.readAsDataURL(file);
  };

  /* ---------------- ANALYZE IMAGE ---------------- */

  const analyzeImage = async () => {
    if (!imageSrc) return;
    
    setProcessing(true);
    setError(null);

    try {
      // Analyze body type and undertone simultaneously
      const [bodyType, undertoneAnalysis] = await Promise.all([
        inferBodyTypeFromImage(imageSrc),
        detectUndertoneFromImage(imageSrc)
      ]);
      
      bodyType.captured_image = imageSrc;
      bodyType.image_validated = true;
      
      // Store undertone in localStorage for next step
      localStorage.setItem('ayla_detected_undertone', JSON.stringify(undertoneAnalysis));
      
      onBodyTypeDetected(bodyType);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze image. Please try again or use manual selection.");
      setProcessing(false);
    }
  };

  /* ---------------- RETAKE ---------------- */

  const retake = () => {
    setImageSrc(null);
    setFrameLocked(false);
    setProcessing(false);
    startCamera();
  };

  /* ---------------- CLEANUP ---------------- */

  useEffect(() => {
    return () => stopCamera();
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* CAMERA PREVIEW */}
      {!frameLocked && cameraOn && (
        <div className="relative rounded-xl overflow-hidden border">
          <video ref={videoRef} className="w-full" autoPlay playsInline muted />

          <button
            onClick={captureFromCamera}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-6 py-2 rounded-full"
            disabled={!videoReady}
          >
            {videoReady ? "📸 Capture" : "⏳ Initializing..."}
          </button>
        </div>
      )}

      {/* IMAGE PREVIEW */}
      {frameLocked && imageSrc && (
        <>
          <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg">
            ✅ <strong>Frame Locked</strong>
            <p className="text-sm">This frame will be analyzed for your body shape.</p>
          </div>

          <img
            src={imageSrc}
            alt="Captured"
            className="rounded-xl border w-full"
          />

          {processing ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-4 animate-spin" />
              <h3 className="font-semibold text-gray-900">Analyzing Your Body Shape</h3>
              <p className="text-gray-600 text-sm mt-2">Processing your silhouette…</p>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={retake}
                className="flex-1 border rounded-lg py-2 hover:bg-gray-50"
              >
                🔁 Retake
              </button>

              <button
                onClick={analyzeImage}
                className="flex-1 bg-orange-500 text-white rounded-lg py-2 hover:bg-orange-600"
              >
                ✅ Analyze Body Shape
              </button>
            </div>
          )}
        </>
      )}

      {/* ACTIONS */}
      {!cameraOn && !frameLocked && (
        <>
          <button
            onClick={startCamera}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
          >
            📷 Start Camera
          </button>

          <label className="block w-full border rounded-lg py-3 text-center cursor-pointer hover:bg-gray-50">
            📁 Upload Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                e.target.files && handleUpload(e.target.files[0])
              }
            />
          </label>

          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Prefer manual selection?</p>
            <button
              onClick={onSwitchToManual}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm"
            >
              Choose body shape manually →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
