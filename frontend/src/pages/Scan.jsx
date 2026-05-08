import { useRef, useState, useEffect, useCallback } from 'react';
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

  /* ─── detect multiple cameras ─── */
  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices?.().then(devices => {
      const cams = devices.filter(d => d.kind === 'videoinput');
      setHasMultiCam(cams.length > 1);
    }).catch(() => {});
  }, []);

  /* ─── stop stream helper ─── */
  const stopStream = useCallback((stream) => {
    if (stream) stream.getTracks().forEach(t => t.stop());
  }, []);

  /* ─── cleanup on unmount ─── */
  useEffect(() => {
    return () => stopStream(camStream);
  }, [camStream, stopStream]);

  /* ─── start camera ─── */
  const startCamera = useCallback(async (facing = facingMode) => {
    setCamError(''); setCamReady(false);
    stopStream(camStream);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCamError('Browser Anda tidak mendukung akses kamera. Gunakan Chrome/Firefox terbaru.');
      return;
    }

    try {
      const constraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
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

  /* ─── switch facing ─── */
  const switchCamera = async () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    await startCamera(next);
  };

  /* ─── capture photo from video ─── */
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
      // stop stream & stay on camera mode to show preview
      stopStream(camStream);
      setCamStream(null);
      setCamReady(false);
    }, 'image/jpeg', 0.92);
  };

  /* ─── switch mode ─── */
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

  /* ─── file upload ─── */
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

  /* ─── analyze ─── */
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

  /* ─── reset ─── */
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
    <div className="page-shell compact-page">
      <Navbar />
      <main className="scan-main">
        <h1>Deteksi Penyakit</h1>
        <p>Unggah gambar atau gunakan kamera untuk mendeteksi penyakit pada daun padi.</p>

        <div className="scan-box">
          {/* ── MODE TABS ── */}
          <div className="scan-tabs">
            <button
              type="button"
              className={mode === MODE.UPLOAD ? 'active' : ''}
              onClick={() => switchMode(MODE.UPLOAD)}
            >
              <i className="bi bi-upload"></i> Upload Gambar
            </button>
            <button
              type="button"
              className={mode === MODE.CAMERA ? 'active' : ''}
              onClick={() => switchMode(MODE.CAMERA)}
            >
              <i className="bi bi-camera"></i> Kamera
            </button>
            {preview && (
              <button
                type="button"
                onClick={resetAll}
                style={{ marginLeft:'auto', color:'#dc2626', background:'none', border:'none', fontSize:'13px', cursor:'pointer' }}
              >
                <i className="bi bi-x-circle"></i> Hapus
              </button>
            )}
          </div>

          {/* ════════════ UPLOAD PANEL ════════════ */}
          {mode === MODE.UPLOAD && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFile}
                hidden
              />
              <button
                className={`drop-area ${preview ? 'has-preview' : ''}`}
                type="button"
                onClick={() => !preview && fileInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
              >
                {preview ? (
                  <><img src={preview} alt="Preview daun padi" /><span>{fileName}</span></>
                ) : (
                  <>
                    <div className="upload-circle"><i className="bi bi-cloud-arrow-up"></i></div>
                    <b>Drag & drop gambar di sini, atau klik untuk memilih</b>
                    <span>Mendukung *.jpeg, *.png, *.webp</span>
                    <button
                      className="btn btn-sm btn-outline-success mt-3"
                      type="button"
                      onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    >
                      <i className="bi bi-folder2-open me-1"></i>Pilih File
                    </button>
                  </>
                )}
              </button>
            </>
          )}

          {/* ════════════ CAMERA PANEL ════════════ */}
          {mode === MODE.CAMERA && (
            <div className="camera-panel">
              {/* Preview setelah capture */}
              {preview && !camReady ? (
                <div className="cam-preview-wrap">
                  <img src={preview} alt="Foto dari kamera" className="cam-captured-img" />
                  <span className="cam-captured-label"><i className="bi bi-camera-fill me-1"></i>{fileName}</span>
                  <button
                    className="btn btn-sm btn-outline-secondary mt-2"
                    type="button"
                    onClick={() => {
                      setPreview(''); setFileName(''); setImageFile(null);
                      startCamera();
                    }}
                  >
                    <i className="bi bi-arrow-repeat me-1"></i>Ambil Ulang
                  </button>
                </div>
              ) : !camStream ? (
                /* Start screen */
                <div className="cam-start-screen">
                  <div className="cam-start-icon"><i className="bi bi-camera"></i></div>
                  <p className="cam-start-title">Gunakan Kamera</p>
                  <p className="cam-start-desc">Arahkan kamera ke daun padi untuk analisis langsung</p>
                  {camError && (
                    <div className="alert alert-warning py-2 small mb-3" style={{textAlign:'left'}}>
                      <i className="bi bi-exclamation-triangle me-1"></i>{camError}
                    </div>
                  )}
                  <button className="btn btn-dark" type="button" onClick={() => startCamera()}>
                    <i className="bi bi-camera-fill me-2"></i>Aktifkan Kamera
                  </button>
                </div>
              ) : (
                /* Live viewfinder */
                <div className="cam-viewfinder">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="cam-video"
                  />
                  {/* scan frame overlay */}
                  <div className="cam-frame-overlay">
                    <div className="cam-frame-box">
                      <span className="cam-frame-hint">
                        {camReady ? 'Posisikan daun di dalam bingkai' : 'Memuat kamera...'}
                      </span>
                    </div>
                  </div>
                  <div className="cam-controls">
                    {hasMultiCam && (
                      <button className="cam-ctrl-btn" type="button" onClick={switchCamera} title="Balik kamera">
                        <i className="bi bi-arrow-repeat"></i>
                      </button>
                    )}
                    <button
                      className="cam-shutter-btn"
                      type="button"
                      onClick={capturePhoto}
                      disabled={!camReady}
                      title="Ambil foto"
                    >
                      <span className="cam-shutter-inner"></span>
                    </button>
                    <button
                      className="cam-ctrl-btn cam-ctrl-stop"
                      type="button"
                      onClick={() => { stopStream(camStream); setCamStream(null); setCamReady(false); }}
                      title="Tutup kamera"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} hidden />
            </div>
          )}

          {error && (
            <div className="alert alert-danger py-2 small mt-2">
              <i className="bi bi-exclamation-circle me-1"></i>{error}
            </div>
          )}

          <button
            className="analyze-btn"
            type="button"
            disabled={!imageFile || loading}
            onClick={handleAnalyze}
          >
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2"></span>Menganalisis...</>
              : <><i className="bi bi-search me-2"></i>Mulai Analisa</>
            }
          </button>
        </div>

        {/* ════════════ HASIL DETEKSI ════════════ */}
        {result && info && (
          <div className="result-box mt-4">
            <div className="result-diagnosis-header" style={{ borderLeft: `4px solid ${info.severityColor}` }}>
              <div>
                <span className="result-emoji">{info.emoji}</span>
                <span className="result-label" style={{ color: info.severityColor }}>{info.label}</span>
                <span className="result-severity ms-2">{info.severityLabel}</span>
              </div>
              {saved && <span className="badge bg-success" style={{ fontSize:'11px' }}>✓ Tersimpan</span>}
            </div>

            <div className="confidence-section">
              {Object.entries(result.confidence).map(([key, val]) => {
                const d = DISEASE_INFO[key];
                return (
                  <div className="conf-row" key={key}>
                    <span className="conf-label">{d?.label || key}</span>
                    <div className="conf-bar-wrap">
                      <div className="conf-bar" style={{ width:`${val}%`, background: d?.severityColor || '#16a34a' }} />
                    </div>
                    <span className="conf-pct">{Math.round(val)}%</span>
                  </div>
                );
              })}
            </div>

            <div className="result-tab-nav">
              {['info','treatment','prevention'].map(t => (
                <button
                  key={t}
                  className={`result-tab-btn${activeTab === t ? ' active' : ''}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t === 'info' ? '📋 Info' : t === 'treatment' ? '💊 Penanganan' : '🛡️ Pencegahan'}
                </button>
              ))}
            </div>

            <div className="result-tab-content">
              {activeTab === 'info' && (
                <div>
                  <p className="result-desc">{info.description}</p>
                  {result.aiNotes && (
                    <p className="ai-notes">
                      <i className="bi bi-robot me-1"></i>{result.aiNotes}
                    </p>
                  )}
                  <p className="infer-time text-muted small">⏱ Inferensi: {result.inferenceTimeMs}ms</p>
                </div>
              )}
              {activeTab === 'treatment' && (
                <ol className="result-list">{info.treatments.map((t, i) => <li key={i}>{t}</li>)}</ol>
              )}
              {activeTab === 'prevention' && (
                <ul className="result-list">{info.preventions.map((p, i) => <li key={i}>{p}</li>)}</ul>
              )}
            </div>

            <button className="btn btn-outline-secondary btn-sm mt-3 w-100" onClick={resetAll}>
              <i className="bi bi-arrow-repeat me-1"></i>Analisis Gambar Lain
            </button>
          </div>
        )}
      </main>
      <footer className="footer-box">
        <p><b>© RiceCareAi</b> - Powered by MobileNetV2 &amp; Claude AI</p>
      </footer>
    </div>
  );
}
