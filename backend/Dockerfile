# Use the official Python 3.10 image from Docker Hub, based on Debian Buster
FROM python:3.10.2-alpine

USER root

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Copy the rest of the application's code into the container
COPY . /usr/src/app/


# Set the working directory inside the container
WORKDIR /usr/src/app

# Expose the port the app runs on
EXPOSE 5500

# Install the application's dependencies
RUN pip3 install --no-cache-dir --upgrade -r requirements.txt

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
