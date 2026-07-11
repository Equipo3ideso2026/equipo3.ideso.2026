# 📈 InvestAI — Sistema de Apoyo en Decisiones de Inversión con IA

**Ernesto Investing AI** · Sistema operacional para la exposición final de proyectos
Universidad Nacional Mayor de San Marcos (UNMSM) · Facultad de Ingeniería de Sistemas e Informática (FISI)
Introducción al Desarrollo de Software (iDeSo) · 2026-II · Grupo 10

---

## 🎯 Descripción

InvestAI es un sistema de análisis bursátil enfocado en 5 empresas mineras con presencia en el mercado
peruano. Combina cuatro enfoques de Machine Learning / NLP para generar señales de inversión (BUY/SELL)
y predicciones de precio:

| Modelo | Tarea | Librería |
|---|---|---|
| **SVC** (Support Vector Classifier) | Clasificación BUY/SELL con `GridSearchCV` + `TimeSeriesSplit` | scikit-learn |
| **RNN** (SimpleRNN, GRU, LSTM) | Clasificación BUY/SELL con redes recurrentes | TensorFlow/Keras |
| **LSTM Regressor** | Predicción de precio a 7/14/30/60 días con bandas de confianza 95% | TensorFlow/Keras |
| **VADER** | Análisis de sentimiento sobre noticias de Yahoo Finance | vaderSentiment |

### Tickers analizados

| Ticker | Empresa | Bolsa |
|---|---|---|
| `FSM` | Fortuna Silver Mines | NYSE |
| `VOLCABC1.LM` | Volcan Compañía Minera | BVL |
| `ABX.TO` | Barrick Gold | TSX |
| `BVN` | Buenaventura | NYSE |
| `BHP` | BHP Group | NYSE |

---

## 🏗️ Arquitectura

El sistema tiene **dos frentes de despliegue independientes**, ambos leen/escriben en la misma base de
datos MongoDB Atlas:

### 1. Frontend HTML + Backend FastAPI (Colab + ngrok)
```
yfinance -> MongoDB Atlas -> Notebooks (SVC/RNN/LSTM/NLP) -> MongoDB Atlas
    -> FastAPI + ngrok (API REST) -> Frontend HTML (fetch + Plotly.js)
```
Carpeta `frontend/` + notebooks en `notebooks/`. Requiere tener el notebook de la API corriendo en
Google Colab con ngrok activo mientras se usa el frontend.

### 2. App Streamlit — **100% autónoma** (sin Colab/ngrok/notebooks) ⭐
```
Streamlit Cloud (app.py) -> yfinance (descarga en vivo)
    -> indicadores técnicos -> SVC / RNN / LSTM (TensorFlow) -> VADER
    -> MongoDB Atlas (persistencia) -> Visualización (Plotly)
```
Un único archivo `app.py`, desplegado en Streamlit Community Cloud con URL permanente. Hace todo el
pipeline por sí mismo cuando el usuario lo solicita desde la interfaz — no depende de que ningún notebook
de Colab esté corriendo.

**Reglas de rendimiento** (para no exceder los límites del free tier de Streamlit Cloud):
- Ingesta OHLCV + indicadores + SVC + NLP: automáticos, ligeros, con caché por antigüedad (6h / 3h).
- RNN (SimpleRNN/GRU/LSTM) y Regresor LSTM: **solo se entrenan para el ticker seleccionado**, y **solo al
  pulsar el botón correspondiente** — nunca para los 5 tickers simultáneamente.

---

## 📂 Estructura del repositorio

```
ernesto-investing-ai/
├── README.md                          # Este archivo
├── requirements.txt                   # Dependencias de la app Streamlit
├── app.py                             # App Streamlit autónoma (bono)
│
├── frontend/                          # Interfaces web (HTML + API FastAPI)
│   ├── index.html                     # Portal de entrada
│   ├── modulo_mercado.html      
│   ├── modulo_svc.html                
│   ├── h  
│   ├── i        
│
└── notebooks/                         # Google Colab
    ├── Notebook1_Ingesta_MongoDB.ipynb
    ├── Notebook2_SVC_MongoDB.ipynb
    ├── Notebook3_RNN_MongoDB.ipynb
    ├── Notebook4_LSTM_MongoDB.ipynb
    ├── Notebook5_Sentimiento_MongoDB.ipynb
    └── Notebook6_API_FastAPI.ipynb
```

---

## 🗄️ Colecciones de MongoDB Atlas

| Colección | Contenido | Escrita por |
|---|---|---|
| `precios_ohlcv` | OHLCV + SMA/EMA/RSI por ticker/fecha | Notebook 1 · `app.py` |
| `predicciones` | Señal vigente del SVC | Notebook 2 · `app.py` |
| `predicciones_rnn` | Señal vigente por arquitectura RNN | Notebook 3 · `app.py` |
| `predicciones_lstm` | Predicciones futuras + histórico de test | Notebook 4 · `app.py` |
| `sentimiento_resumen` | Score compound promedio + distribución | Notebook 5 · `app.py` |
| `sentimiento_noticias` | Noticias individuales con score VADER | Notebook 5 · `app.py` |
| `metricas_modelos` | Historial de métricas de entrenamiento | Notebooks 2-4 · `app.py` |

---

## 🚀 Despliegue de la app Streamlit (autónoma)

### 1. Requisitos previos
- Cuenta de [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) con un clúster M0 (gratuito).
- Un usuario de base de datos (Database Access) con usuario/contraseña.
- Acceso de red abierto (`0.0.0.0/0`) en Network Access, para que Streamlit Cloud pueda conectarse.
- Cuenta de [Streamlit Community Cloud](https://share.streamlit.io) vinculada a GitHub.

### 2. Obtener la cadena de conexión
En Atlas → **Connect** → **Drivers** → Python. Copia la URI (tiene el formato):
```
mongodb+srv://usuario:<password>@cluster0.xxxxxx.mongodb.net/?retryWrites=true&w=majority
```
Reemplaza `<password>` por la contraseña real del usuario de base de datos.

### 3. Configurar el secret en Streamlit Cloud
En tu app → **Settings → Secrets**:
```toml
MONGO_URI = "mongodb+srv://usuario:password@cluster0.xxxxxx.mongodb.net/?retryWrites=true&w=majority"
```

### 4. Deploy
1. Sube `app.py` y `requirements.txt` a la raíz del repo en GitHub.
2. En share.streamlit.io → **New app** → selecciona el repo, rama `main`, archivo `app.py`.
3. En **Settings → General**, fija la versión de **Python 3.11** (evita incompatibilidades de TensorFlow
   con versiones de Python muy recientes).
4. Deploy. El primer build tarda unos minutos extra por la instalación de TensorFlow.

### 5. Uso
- Al abrir la app, selecciona un ticker en la barra lateral.
- Los módulos **Dashboard**, **Mercado**, **Clasificador SVC** y **Sentimiento NLP** se actualizan
  automáticamente (con caché).
- En **Consola RNN** y **Regresor LSTM**, pulsa el botón de entrenamiento para ese ticker — el resultado
  queda guardado en MongoDB y disponible en el resto de módulos hasta que se reentrene.
- **Señales Broker** y **Portafolio simulado** agregan los 5 tickers usando lo ya calculado.

---

## 🖥️ Ejecutar localmente (opcional)

```bash
git clone <url-del-repo>
cd ernesto-investing-ai
pip install -r requirements.txt

mkdir -p .streamlit
echo 'MONGO_URI = "mongodb+srv://usuario:password@cluster0.xxxxxx.mongodb.net/"' > .streamlit/secrets.toml

streamlit run app.py
```

---

## 🛠️ Stack tecnológico

- **Datos**: Yahoo Finance vía `yfinance`
- **Persistencia**: MongoDB Atlas (`pymongo[srv]`, `dnspython`)
- **ML clásico**: scikit-learn (SVC + GridSearchCV + TimeSeriesSplit)
- **Deep Learning**: TensorFlow/Keras (SimpleRNN, GRU, LSTM)
- **NLP**: VADER (`vaderSentiment`)
- **Visualización**: Plotly / Plotly.js
- **Backend REST** (frontend HTML): FastAPI + ngrok (Google Colab)
- **App autónoma**: Streamlit Community Cloud

---

## 👥 Créditos

Proyecto grupal — Grupo 10, iDeSo 2026-II, UNMSM-FISI.
Curso a cargo del Prof. Mg. Ing. Ernesto D. Cancho-Rodríguez, MBA (The George Washington University).

## ⚠️ Disclaimer

Este sistema es un proyecto académico. Las señales BUY/SELL y predicciones de precio generadas por los
modelos **no constituyen asesoría financiera**. Los datos son reales (Yahoo Finance) pero los modelos son
de complejidad limitada y con fines educativos.
