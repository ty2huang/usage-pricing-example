FROM python:3.12-slim
WORKDIR /backend

COPY . .

RUN apt-get update

RUN pip install --no-cache-dir -r requirements.lock

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
