# -----------------------------------------------------------------------------
# KRISISETU (ಕೃಷಿಸೇತು) Backend Engine Dockerfile
# -----------------------------------------------------------------------------
FROM python:3.11-slim

# Prevent Python from writing .pyc and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    DATA_DIR=/app/data

WORKDIR /app

# Install system dependencies (build-essential, libpq for psycopg2/geospatial)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Copy data folder if present in build context or create fallback
RUN mkdir -p /app/data

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/ || exit 1

# Start uvicorn server
CMD python seed_db.py || true && \
    python seed_admin.py || true && \
    uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
