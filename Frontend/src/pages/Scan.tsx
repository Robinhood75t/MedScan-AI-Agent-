import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Upload, FileImage, X, ScanLine } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth, ScanRecord } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Scan = () => {
  const [mode, setMode] = useState<"choose" | "camera" | "upload">("choose");
  const [file, setFile] = useState<File | null>(null);
  const { addScanRecord } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user, incrementScans } = useAuth();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setCameraStream(stream);
      setMode("camera");
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch {
      toast.error("Camera access denied. Please allow camera permissions.");
    }
  };

  const stopCamera = useCallback(() => {
    cameraStream?.getTracks().forEach((t) => t.stop());
    setCameraStream(null);
  }, [cameraStream]);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setPreview(dataUrl);
    stopCamera();
    setMode("upload");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/") && f.type !== "application/pdf") {
      toast.error("Please upload an image or PDF file.");
      return;
    }
    setFile(f);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
    setMode("upload");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) {
      setFile(f);
      if (f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(f);
      }
      setMode("upload");
    }
  };

  const handleScan = () => {
    if (!file && !preview) {
      toast.error("Please upload or capture a report first.");
      return;
    }
    // Check paywall
    if (user && user.scansUsed >= 1) {
      navigate("/pricing");
      return;
    }
    incrementScans();
    const record: ScanRecord = {
      id: Date.now().toString(),
      fileName: file?.name || "Camera Capture",
      date: new Date().toLocaleDateString(),
      overview: "CBC report analysis — mostly normal values with minor observations.",
      status: "completed",
    };
    addScanRecord(record);
    navigate("/results");
  };

  const reset = () => {
    stopCamera();
    setFile(null);
    setPreview(null);
    setMode("choose");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground text-center mb-2">
            Scan Your Report
          </h1>
          <p className="text-muted-foreground text-center mb-10">
            Upload or capture your medical report for AI analysis
          </p>

          {mode === "choose" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={startCamera}
                className="hover-lift bg-card rounded-2xl p-10 text-center flex flex-col items-center gap-4 border-2 border-transparent hover:border-primary/30 transition-colors"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center">
                  <Camera className="w-7 h-7 text-accent-foreground" />
                </div>
                <span className="font-heading font-semibold text-lg text-foreground">Use Camera</span>
                <span className="text-sm text-muted-foreground">Capture your report live</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="hover-lift bg-card rounded-2xl p-10 text-center flex flex-col items-center gap-4 border-2 border-dashed border-border hover:border-primary/30 transition-colors"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center">
                  <Upload className="w-7 h-7 text-accent-foreground" />
                </div>
                <span className="font-heading font-semibold text-lg text-foreground">Upload File</span>
                <span className="text-sm text-muted-foreground">PDF or Image file</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
            </div>
          )}

          {mode === "camera" && (
            <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: "var(--card-shadow)" }}>
              <div className="relative aspect-[4/3] bg-foreground/5">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-3/4 h-3/4 border-2 border-primary/40 rounded-2xl" />
                </div>
              </div>
              <div className="p-4 flex gap-3 justify-center">
                <Button variant="outline" className="rounded-xl" onClick={() => { stopCamera(); setMode("choose"); }}>
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button className="rounded-xl" onClick={capturePhoto}>
                  <Camera className="w-4 h-4 mr-2" /> Capture
                </Button>
              </div>
            </div>
          )}

          {mode === "upload" && (preview || file) && (
            <div className="bg-card rounded-2xl p-6" style={{ boxShadow: "var(--card-shadow)" }}>
              {preview ? (
                <div className="rounded-xl overflow-hidden mb-6 bg-muted aspect-[4/3] flex items-center justify-center">
                  <img src={preview} alt="Report preview" className="max-h-full max-w-full object-contain" />
                </div>
              ) : file ? (
                <div className="rounded-xl bg-muted p-8 mb-6 flex flex-col items-center gap-3">
                  <FileImage className="w-12 h-12 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium">{file.name}</span>
                </div>
              ) : null}

              <div className="flex gap-3 justify-center">
                <Button variant="outline" className="rounded-xl" onClick={reset}>
                  Choose Again
                </Button>
                <Button className="rounded-xl gap-2" onClick={handleScan}>
                  <ScanLine className="w-4 h-4" /> Scan Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scan;
