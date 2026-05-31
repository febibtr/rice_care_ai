import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { analyzeLeafImage, DISEASE_INFO } from '../services/aiService';
import { createScan } from '../services/scanService';

const MODE = { UPLOAD: 'upload', CAMERA: 'camera' };

export default function Scan() {
  const fileInputRef = useRef(null);
  const videoRef    = useRef(null);
  const canvasRef   = useRef(null);

  const [mode, setMode]           = useState(MODE.UPLOAD);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState('');
  const [fileName, setFileName]   = useState('');

  const [camStream, setCamStream]     = useState(null);
  const [camReady, setCamReady]       = useState(false);
  const [camError, setCamError]       = useState('');
  const [facingMode, setFacingMode]   = useState('environment');
  const [hasMultiCam, setHasMultiCam] = useState(false);

  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState('');
  const [saved, setSaved]       = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices?.().then(devices => {
      const cams = devices.filter(d => d.kind === 'videoinput');
      setHasMultiCam(cams.length > 1);
    }).catch(() => {});
  }, []);

  const stopStream = useCallback((stream) => {
    if (stream) stream.getTracks().forEach(t => t.stop());
  }, []);

  useEffect(() => {
    return () => stopStream(camStream);
  }, [camStream, stopStream]);

  const startCamera = useCallback(async (facing = facingMode) => {
    setCamError(''); setCamReady(false);
    stopStream(camStream);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamError('Browser Anda tidak mendukung akses kamera. Gunakan Chrome/Firefox terbaru.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCamStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCamReady(true);
        };
      }
    } catch (err) {
      const msgs = {
        NotAllowedError:  'Izin kamera ditolak. Aktifkan izin kamera di pengaturan browser.',
        NotFoundError:    'Kamera tidak ditemukan di perangkat ini.',
        NotReadableError: 'Kamera sedang digunakan oleh aplikasi lain.',
        OverconstrainedError: 'Konfigurasi kamera tidak didukung.',
      };
      setCamError(msgs[err.name] || `Gagal membuka kamera: ${err.message}`);
    }
  }, [camStream, facingMode, stopStream]);

  const switchCamera = async () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    await startCamera(next);
  };

  const capturePhoto = () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width  = video.videoWidth  || 1280;
    canvas.height = video.videoHeight || 720;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      if (!blob) return;
      const file = new File([blob], `kamera_${Date.now()}.jpg`, { type: 'image/jpeg' });
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setFileName(file.name);
      setResult(null); setError(''); setSaved(false);
      stopStream(camStream);
      setCamStream(null);
      setCamReady(false);
    }, 'image/jpeg', 0.92);
  };

  const switchMode = (m) => {
    if (m === mode) return;
    stopStream(camStream);
    setCamStream(null); setCamReady(false); setCamError('');
    setMode(m);
    if (m === MODE.CAMERA) {
      setImageFile(null); setPreview(''); setFileName('');
      setResult(null); setError('');
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
    setResult(null); setError(''); setSaved(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
    setResult(null); setError(''); setSaved(false);
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;
    setLoading(true); setError(''); setResult(null); setSaved(false);
    try {
      const aiResult = await analyzeLeafImage(imageFile);
      setResult(aiResult);
      setActiveTab('info');
      try {
        await createScan(imageFile, aiResult);
        setSaved(true);
      } catch (saveErr) {
        console.warn('Scan tidak tersimpan ke backend:', saveErr.message);
      }
    } catch (err) {
      setError('Analisis gagal: ' + (err.message || 'Coba lagi.'));
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    stopStream(camStream);
    setCamStream(null); setCamReady(false); setCamError('');
    setImageFile(null); setPreview(''); setFileName('');
    setResult(null); setError(''); setSaved(false);
    setMode(MODE.UPLOAD);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const info = result ? (DISEASE_INFO[result.diagnosis] || DISEASE_INFO.sehat) : null;

  return (
    <div className="page-shell">
      <Navbar />
      <main className="scan-main">

        {/* ── HEADER ── */}
        <div className="scan-header">
          <div>
            <h1>Deteksi Penyakit Padi</h1>
            <p>Analisis cerdas berbasis AI untuk mendeteksi penyakit pada daun padi secara akurat.</p>
          </div>
        </div>

        {/* ── MAIN SCAN BOX ── */}
        <div className="scan-box-v2">

          {/* ── MODE SELECTOR: modern pill tabs ── */}
          <div className="scan-mode-selector">
            <button
              type="button"
              className={`scan-mode-btn ${mode === MODE.UPLOAD ? 'active' : ''}`}
              onClick={() => switchMode(MODE.UPLOAD)}
            >
              <span className="scan-mode-icon"><i className="ph ph-image-square"></i></span>
              <span className="scan-mode-label">
                <span className="scan-mode-title">Unggah Gambar</span>
                <span className="scan-mode-sub">jpg, png, webp</span>
              </span>
            </button>
            <button
              type="button"
              className={`scan-mode-btn ${mode === MODE.CAMERA ? 'active' : ''}`}
              onClick={() => switchMode(MODE.CAMERA)}
            >
              <span className="scan-mode-icon"><i className="ph ph-camera"></i></span>
              <span className="scan-mode-label">
                <span className="scan-mode-title">Kamera Langsung</span>
                <span className="scan-mode-sub">foto real-time</span>
              </span>
            </button>
          </div>

          {/* ════════ UPLOAD PANEL ════════ */}
          {mode === MODE.UPLOAD && (
            <div className="scan-upload-area">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFile}
                hidden
              />
              {preview ? (
                <div className="scan-preview-container">
                  <div className="scan-preview-img-wrap">
                    <img src={preview} alt="Preview daun padi" className="scan-preview-img" />
                    <div className="scan-preview-badge">
                      <i className="ph ph-check-circle"></i> Siap dianalisis
                    </div>
                  </div>
                  <div className="scan-preview-info">
                    <i className="ph ph-file-image"></i>
                    <span>{fileName}</span>
                    <button
                      className="scan-change-btn"
                      onClick={() => { setPreview(''); setImageFile(null); setFileName(''); setResult(null); }}
                    >
                      <i className="ph ph-pencil"></i> Ganti
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="scan-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <div className="scan-dropzone-inner">
                    <div className="scan-drop-icon">
                      <i className="ph ph-cloud-arrow-up"></i>
                    </div>
                    <h4>Drag & drop foto daun padi</h4>
                    <p>atau pilih file dari perangkat Anda</p>
                    <button
                      className="scan-file-btn"
                      type="button"
                      onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    >
                      <i className="ph ph-folder-open"></i>
                      Pilih File
                    </button>
                    <span className="scan-format-hint">Mendukung *.jpeg · *.png · *.webp</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════ CAMERA PANEL ════════ */}
          {mode === MODE.CAMERA && (
            <div className="scan-camera-area">
              {/* After capture preview */}
              {preview && !camReady ? (
                <div className="scan-cam-captured">
                  <img src={preview} alt="Foto dari kamera" />
                  <div className="scan-cam-captured-info">
                    <i className="ph ph-camera-fill"></i>
                    <span>{fileName}</span>
                    <button
                      className="scan-change-btn"
                      type="button"
                      onClick={() => { setPreview(''); setFileName(''); setImageFile(null); startCamera(); }}
                    >
                      <i className="ph ph-arrow-clockwise"></i> Ulangi
                    </button>
                  </div>
                </div>
              ) : !camStream ? (
                /* Camera start screen */
                <div className="scan-cam-start">
                  <div className="scan-cam-start-icon">
                    <i className="ph ph-camera"></i>
                  </div>
                  <h4>Kamera Real-Time</h4>
                  <p>Arahkan kamera langsung ke daun padi untuk mendeteksi penyakit secara instan</p>
                  {camError && (
                    <div className="scan-cam-error">
                      <i className="ph ph-warning"></i> {camError}
                    </div>
                  )}
                  <button
                    className="scan-cam-activate-btn"
                    type="button"
                    onClick={() => startCamera()}
                  >
                    <i className="ph ph-camera-fill"></i>
                    Aktifkan Kamera
                  </button>
                </div>
              ) : (
                /* Live viewfinder — modern style */
                <div className="scan-viewfinder-wrap">
                  {/* Video feed */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="scan-video"
                  />

                  {/* Corner frame overlay */}
                  <div className="scan-frame-overlay">
                    <div className="scan-frame-box">
                      <span className="scan-frame-corner tl"></span>
                      <span className="scan-frame-corner tr"></span>
                      <span className="scan-frame-corner bl"></span>
                      <span className="scan-frame-corner br"></span>
                      {camReady && <div className="scan-frame-scan-line"></div>}
                    </div>
                    <div className="scan-frame-hint">
                      <i className="ph ph-leaf"></i>
                      {camReady ? 'Posisikan daun di dalam bingkai' : 'Memuat kamera...'}
                    </div>
                  </div>

                  {/* Camera controls — bottom row */}
                  <div className="scan-cam-controls">
                    {/* Switch camera */}
                    {hasMultiCam ? (
                      <button className="scan-cam-ctrl" type="button" onClick={switchCamera} title="Balik kamera">
                        <i className="ph ph-camera-rotate"></i>
                      </button>
                    ) : <span />}

                    {/* Shutter — center */}
                    <button
                      className="scan-shutter"
                      type="button"
                      onClick={capturePhoto}
                      disabled={!camReady}
                      title="Ambil foto"
                    >
                      <span className="scan-shutter-ring">
                        <span className="scan-shutter-dot"></span>
                      </span>
                    </button>

                    {/* Close camera */}
                    <button
                      className="scan-cam-ctrl scan-cam-ctrl-close"
                      type="button"
                      onClick={() => { stopStream(camStream); setCamStream(null); setCamReady(false); }}
                      title="Tutup kamera"
                    >
                      <i className="ph ph-x"></i>
                    </button>
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} hidden />
            </div>
          )}

          {/* ── ERROR ── */}
          {error && (
            <div className="scan-error-msg">
              <i className="ph ph-warning-circle"></i> {error}
            </div>
          )}

          {/* ── ANALYZE BUTTON & RESET ── */}
          <div className="scan-action-row">
            {(imageFile || preview) && (
              <button className="scan-reset-btn" type="button" onClick={resetAll}>
                <i className="ph ph-trash"></i>
                Hapus
              </button>
            )}
            <button
              className="scan-analyze-btn"
              type="button"
              disabled={!imageFile || loading}
              onClick={handleAnalyze}
              style={{ flex: 1 }}
            >
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Menganalisis AI...</>
                : <><i className="ph ph-magnifying-glass me-2"></i>Mulai Analisa</>
              }
            </button>
          </div>
        </div>

        {/* ════════════ HASIL DETEKSI ════════════ */}
        {result && info && (
          <div className="result-panel mt-4">
            <div className="result-header">
              <div className="result-signal" style={{ background: info.iconBg || 'rgba(34,181,58,.08)' }}>
                <i className={`ph ${info.icon}`} style={{ color: info.iconColor || info.severityColor, fontSize: 28 }}></i>
              </div>
              <div>
                <div className="result-title">{info.label}</div>
                <div className="result-subtitle">{info.severityLabel}</div>
              </div>
              {saved && <span className="badge bg-success" style={{ fontSize:'11px' }}>✓ Tersimpan</span>}
            </div>

            <div className="result-stats-grid">
              <div className="result-stat-card">
                <div className="result-stat-label">Prediksi</div>
                <div className="result-stat-value" style={{ color: info.severityColor }}>{info.label}</div>
              </div>
              <div className="result-stat-card">
                <div className="result-stat-label">Confidence</div>
                <div className="result-stat-value">{Math.round(result.topConfidence)}%</div>
              </div>
              <div className="result-stat-card result-stat-card-full">
                <div className="result-stat-label">Keterangan singkat</div>
                <div className="result-stat-note">{result.aiNotes || info.description}</div>
              </div>
            </div>

            <div className="result-footer">
              <span className="infer-time text-muted small">⏱ Inferensi: {result.inferenceTimeMs}ms</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-outline-secondary btn-sm result-reset-btn" onClick={resetAll}>
                  <i className="bi bi-arrow-repeat me-1"></i>Analisis Gambar Lain
                </button>
                <Link to="/penanganan" className="btn btn-success btn-sm" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <i className="ph ph-shield-check me-1"></i>Penanganan
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className="footer-box" style={{ textAlign: 'center' }}>
        <p className="footer-copy">© 2026 RiceCare AI</p>
      </footer>
    </div>
  );
}
