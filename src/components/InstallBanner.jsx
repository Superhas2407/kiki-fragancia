import { useState, useEffect } from 'react';

export default function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // No mostrar si ya fue instalada como PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    if (isStandalone) return;

    // No mostrar si el usuario ya la cerró
    const dismissed = localStorage.getItem('kiki-install-banner');
    if (dismissed) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    if (ios) {
      // En iOS siempre mostramos (no hay evento beforeinstallprompt)
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }

    // En Android/Chrome esperamos el evento nativo
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('kiki-install-banner', '1');
  };

  const handleInstallAndroid = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setVisible(false);
        localStorage.setItem('kiki-install-banner', '1');
      }
    }
  };

  if (!visible) return null;

  return (
    <div className="install-banner">
      <div className="install-banner-inner">
        <button className="install-banner-close" onClick={handleDismiss} aria-label="Cerrar">✕</button>

        <div className="install-banner-logo">
          <img src="/icon-192.png" alt="Kiki Fragancia" width={38} height={38} />
        </div>

        <div className="install-banner-text">
          <p className="install-banner-title">Instala nuestra App</p>

          {isIOS ? (
            <div className="install-banner-steps">
              <span className="install-step">
                <span className="install-step-icon">1</span>
                Toca <strong>Compartir</strong> <span className="install-icon-share">⬆</span>
              </span>
              <span className="install-step-arrow">→</span>
              <span className="install-step">
                <span className="install-step-icon">2</span>
                "<strong>Añadir a pantalla de inicio</strong>"
              </span>
            </div>
          ) : (
            <p className="install-banner-sub">Acceso rápido · Sin abrir el navegador</p>
          )}
        </div>

        {!isIOS && (
          <button className="install-banner-btn" onClick={handleInstallAndroid}>
            Instalar
          </button>
        )}
      </div>

      <style>{`
        .install-banner {
          position: fixed;
          bottom: 72px;
          left: 12px;
          right: 12px;
          z-index: 9999;
          animation: installSlideUp 0.45s cubic-bezier(.22,.68,0,1.2) both;
        }
        @media (min-width: 600px) {
          .install-banner {
            left: auto;
            right: 24px;
            max-width: 380px;
            bottom: 24px;
          }
        }
        @keyframes installSlideUp {
          from { transform: translateY(120%); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
        .install-banner-inner {
          background: #1A1208;
          border: 1px solid rgba(201,168,76,0.35);
          border-radius: 16px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.45);
          position: relative;
        }
        .install-banner-close {
          position: absolute;
          top: 8px;
          right: 10px;
          background: none;
          border: none;
          color: rgba(247,242,234,0.45);
          font-size: 13px;
          cursor: pointer;
          line-height: 1;
          padding: 2px 4px;
        }
        .install-banner-logo img {
          border-radius: 10px;
          display: block;
        }
        .install-banner-text {
          flex: 1;
          min-width: 0;
        }
        .install-banner-title {
          color: #C9A84C;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin: 0 0 4px;
        }
        .install-banner-sub {
          color: rgba(247,242,234,0.7);
          font-size: 12px;
          margin: 0;
        }
        .install-banner-steps {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .install-step {
          color: rgba(247,242,234,0.85);
          font-size: 11.5px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .install-step strong {
          color: #F7F2EA;
        }
        .install-step-icon {
          background: #C9A84C;
          color: #1A1208;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          font-size: 10px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .install-step-arrow {
          color: #C9A84C;
          font-size: 12px;
        }
        .install-icon-share {
          font-size: 14px;
        }
        .install-banner-btn {
          background: #C9A84C;
          color: #1A1208;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          letter-spacing: 0.02em;
        }
        .install-banner-btn:hover {
          background: #d4b660;
        }
      `}</style>
    </div>
  );
}
