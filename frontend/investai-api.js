/**
 * investai-api.js — Cliente centralizado para la API InvestAI
 * Sistema Ernesto Investing AI · iDeSo · UNMSM-FISI
 *
 * Centraliza toda la comunicación frontend → backend (FastAPI vía ngrok).
 * Persiste la URL de la API en sessionStorage para que index.html,
 * modulo_mercado.html y modulo_svc.html la compartan.
 */
const InvestAI = (() => {
  const KEY = 'investai_api_url';

  const TICKERS = [
    { ticker: 'FSM', nombre: 'Fortuna Silver Mines', moneda: 'USD' },
    { ticker: 'VOLCABC1.LM', nombre: 'Volcan Cía. Minera', moneda: 'PEN' },
    { ticker: 'ABX.TO', nombre: 'Barrick Gold', moneda: 'CAD' },
    { ticker: 'BVN', nombre: 'Buenaventura', moneda: 'USD' },
    { ticker: 'BHP', nombre: 'BHP Group', moneda: 'USD' },
  ];

  function getUrl() {
    return (sessionStorage.getItem(KEY) || '').replace(/\/+$/, '');
  }

  function setUrl(url) {
    sessionStorage.setItem(KEY, (url || '').trim().replace(/\/+$/, ''));
  }

  async function _get(path) {
    const base = getUrl();
    if (!base) throw new Error('SIN_API');
    const res = await fetch(base + path, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail || `HTTP ${res.status}`);
    }
    return res.json();
  }

  const salud = () => _get('/api/salud');
  const mercado = (ticker) => _get(`/api/mercado/${encodeURIComponent(ticker)}`);
  const svc = (ticker) => _get(`/api/svc/${encodeURIComponent(ticker)}`);

  // ── Datos de demostración (fallback cuando no hay API configurada o falla) ──
  function demoMercado(ticker) {
    const meta = TICKERS.find((t) => t.ticker === ticker) || TICKERS[0];
    const serie = [];
    let precio = 20 + Math.random() * 30;
    const hoy = new Date();
    for (let i = 90; i >= 0; i--) {
      precio += (Math.random() - 0.5) * precio * 0.02;
      const apertura = precio * (1 + (Math.random() - 0.5) * 0.01);
      const cierre = precio;
      const maximo = Math.max(apertura, cierre) * (1 + Math.random() * 0.01);
      const minimo = Math.min(apertura, cierre) * (1 - Math.random() * 0.01);
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - i);
      serie.push({
        fecha: fecha.toISOString(), fecha_str: fecha.toISOString().slice(0, 10),
        apertura, maximo, minimo, cierre, volumen: Math.round(1e6 * Math.random()),
        sma_20: i < 70 ? precio * (1 + (Math.random() - 0.5) * 0.03) : null,
        sma_50: i < 40 ? precio * (1 + (Math.random() - 0.5) * 0.04) : null,
        ema_12: precio * (1 + (Math.random() - 0.5) * 0.02),
        ema_26: precio * (1 + (Math.random() - 0.5) * 0.03),
        rsi_14: 30 + Math.random() * 40,
      });
    }
    const ultimo = serie[serie.length - 1];
    return {
      ticker, nombre: meta.nombre, moneda: meta.moneda, total_registros: serie.length,
      precio_actual: ultimo.cierre, fecha_actual: ultimo.fecha_str, serie, _demo: true,
    };
  }

  function demoSvc(ticker) {
    const meta = TICKERS.find((t) => t.ticker === ticker) || TICKERS[0];
    const señal = Math.random() > 0.5 ? 'BUY' : 'SELL';
    return {
      ticker, nombre: meta.nombre, modelo: 'SVC', señal,
      confianza: 0.55 + Math.random() * 0.4,
      ultimo_cierre: 20 + Math.random() * 30,
      fecha_referencia: new Date().toISOString().slice(0, 10),
      hiperparametros: { svc__kernel: 'rbf', svc__C: 10, svc__gamma: 'scale' },
      _demo: true,
    };
  }

  return { TICKERS, getUrl, setUrl, salud, mercado, svc, demoMercado, demoSvc };
})();
