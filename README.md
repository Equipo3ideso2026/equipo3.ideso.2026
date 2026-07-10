[README.md](https://github.com/user-attachments/files/29870342/README.md)
# InvestAI — Sistema Web de Apoyo en Decisiones de Inversión con IA

> **iDeSo · FISI · UNMSM · Grupo 10 · 2026-II**
> Profesor: Mg. Ing. Ernesto D. Cancho-Rodríguez, MBA (GWU)

---

## 🌐 Prototipo en vivo (GitHub Pages)

**URL:** `https://JoseJamirSanchezHinostroza.github.io/PrediccionBursatilG3/`

---

## 📋 Descripción del Proyecto

**InvestAI** es un Sistema Web de Apoyo en Decisiones de Inversión Bursátil (DSS) desarrollado íntegramente con asistencia de Inteligencia Artificial (Claude Sonnet 4.6). El sistema analiza cinco activos mineros con operaciones en Perú:

| Ticker | Empresa |
|--------|---------|
| BVN | Buenaventura (NYSE) |
| FSM | Fortuna Silver Mines |
| ABX.TO | Barrick Gold (TSX) |
| BHP | BHP Group (NYSE) |
| VOLCABC1.LM | Volcán Compañía Minera (BVL) |

---

## 🏗️ Estructura del Repositorio

```
investai/
├── index.html                          ← Entrada: redirige al login
├── README.md
├── HTML/
│   ├── 1.-Autenticacion/
│   │   └── 01_autenticacion_v2.html   ← GUI-01: Login
│   ├── 2.-Visualizacion/
│   │   └── Html_2.html                ← GUI-02: Mercado (OHLCV + indicadores)
│   ├── 3.-PrediccionSVC/
│   │   └── 3_svc_clasificador_tendencia_html.html  ← GUI-03: Clasificador SVC
│   ├── 4.-PrediccionLSTM/
│   │   └── 4_lstm_regressor_prediccion_html.html   ← GUI-04: Regresor LSTM
│   ├── 5.-AnalisisNLP/
│   │   └── Html_5.html                ← GUI-05: Sentimiento NLP
│   ├── 6.-GeneracionEstrategias/
│   │   └── 6__Generacion_de_estrategias.html       ← GUI-06: Estrategias IA
│   ├── 7.-GestionPortafolio/
│   │   └── 7__Gestion_de_portafolio.html           ← GUI-07: Portafolio
│   ├── 8.-EnvioSenalesBroker/
│   │   └── 8_señales_broker.html      ← GUI-08: Señales & Broker
│   ├── 9.-DashboardCompleto/
│   │   └── 09_dashboard_completo_v2.html           ← GUI-09: Dashboard
│   ├── 10.-ConsolaModelosIA/
│   │   └── 10_consola_modelos_ia.html ← GUI-10: Consola Modelos IA
│   └── 11.-ReportesBacktesting/
│       └── 11_reporte_backtesting.html ← GUI-11: Backtesting
├── COLABS/
│   ├── 1_Ingesta_de_Datos_Reales_con_yfinance.ipynb
│   ├── 2_Clasificador_SVC.ipynb
│   ├── 3_Clasificadores_RNN.ipynb
│   ├── 4_Regresor_LSTM.ipynb
│   ├── 5_Análisis_de_Sentimiento_NLP_con_VADER.ipynb
│   └── InvestAI_API_FastAPI_Colab_ngrok_v2.ipynb  ← API FastAPI + ngrok
└── docs/
    └── Articulo_Cientifico_InvestAI_Grupo10.docx
```

---

## 🚀 Cómo correr el Backend

1. Abrir `notebooks/InvestAI_API_FastAPI_Colab_ngrok_v2.ipynb` en Google Colab
2. Ejecutar **todas las celdas en orden**
3. Copiar la URL pública que aparece:
   ```
   🌐 API pública disponible en: https://xxxx.ngrok-free.app
   ```
4. Ir al sitio en GitHub Pages → campo **"URL del Backend ngrok"** → pegar URL → **Iniciar Sesión**

### Endpoints de la API

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/salud` | Health check |
| `GET /api/mercado/{ticker}` | OHLCV + indicadores técnicos |
| `GET /api/svc/{ticker}` | Señales SVC (BUY/SELL/HOLD) |
| `GET /api/rnns/{ticker}` | 4 clasificadores RNN comparativos |
| `GET /api/lstm/{ticker}?horizonte=N` | Pronóstico de precio LSTM |
| `GET /api/nlp/{ticker}` | Análisis de sentimiento NLP-VADER |

Documentación Swagger UI: `https://xxxx.ngrok-free.app/docs`

---

## 🛠️ Stack Tecnológico

**Frontend:** HTML5 · CSS3 · JavaScript ES2022 · Chart.js · Plotly.js · Google Fonts (Sora/Inter)

**Backend:** Python 3.10 · FastAPI · TensorFlow/Keras · scikit-learn · yfinance · NLTK/VADER · ngrok

**Despliegue:** GitHub Pages (frontend estático) + Google Colab + ngrok (backend dinámico)

---

## 📊 Módulos del Sistema

| Código | Módulo | Descripción |
|--------|--------|-------------|
| GUI-01 | Autenticación | Login, registro, recuperación de contraseña |
| GUI-02 | Visualización | Candlesticks, SMA/EMA/Bollinger, RSI, MACD |
| GUI-03 | SVC Classifier | Señal BUY/SELL/HOLD con SVM kernel RBF |
| GUI-04 | LSTM Regressor | Pronóstico de precios con bandas de confianza |
| GUI-05 | NLP Sentimiento | VADER sobre noticias de Yahoo Finance |
| GUI-06 | Estrategias IA | Recomendaciones basadas en modelos combinados |
| GUI-07 | Portafolio | Distribución de activos, P&L, equity curve |
| GUI-08 | Señales Broker | Envío de órdenes a Interactive Brokers |
| GUI-09 | Dashboard | Panel consolidado de todos los módulos |
| GUI-10 | Consola IA | Configuración de los 16 modelos predictivos |
| GUI-11 | Backtesting | Métricas históricas con VectorBT |

---

*Trabajo Grupal Semana 12 · Prof. E. D. Cancho-Rodríguez, MBA (GWU) · DAISW · FISI · UNMSM · Lima, Perú 2026*
