FROM python:3.12-slim

WORKDIR /app

# Install system dependencies for pdfplumber/zlib
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_sm

COPY . .

# The container will run the main pipeline
CMD ["python", "main.py"]
