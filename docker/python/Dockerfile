# BASE SECTION
FROM python:3.11-slim

# WORKDIR SECTION
WORKDIR /app

# DEPENDENCIES SECTION
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# CODE SECTION
COPY app/ ./app/

# RUN SECTION
EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000", "--reload"]