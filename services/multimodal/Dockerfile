FROM python:3.12-slim
ARG ENABLE_VISION=0
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 INJESSUS_VISION_ENABLED=0
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends libglib2.0-0 libgl1 libgomp1 && rm -rf /var/lib/apt/lists/*
COPY requirements*.txt ./
RUN pip install --no-cache-dir -r requirements.txt -r requirements-ocr.txt
RUN if [ "$ENABLE_VISION" = "1" ]; then pip install --no-cache-dir torch==2.7.1 torchvision==0.22.1 --index-url https://download.pytorch.org/whl/cpu && pip install --no-cache-dir -r requirements-vision.txt; fi
COPY app.py ./app.py
RUN useradd --create-home --uid 10001 inference && chown -R inference:inference /app
USER inference
ENV HF_HOME=/home/inference/.cache/huggingface PADDLE_PDX_CACHE_HOME=/home/inference/.cache/paddlex
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1", "--no-access-log"]
