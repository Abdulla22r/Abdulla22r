# Emotion-Based E-Learning Platform

This project is an end-to-end web application that detects a student's emotion in real-time and personalizes e-learning content recommendations based on their emotional state.

## System Architecture

- **Backend:** Django and Django REST Framework (DRF)
- **Database:** PostgreSQL (managed via Django ORM)
- **Machine Learning:** TensorFlow/Keras (Convolutional Neural Network)
- **Computer Vision:** OpenCV (for real-time webcam frame capture, face detection, and image preprocessing)
- **Frontend:** Django Templates
- **Dataset:** Kaggle FER Emotion Detection dataset, downloaded using `kagglehub`.

## Folder Structure

```
emotion_learning_platform/
├── emotion_learning_platform/  # Django project directory
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── asgi.py
│   └── wsgi.py
├── accounts/                   # Handles user authentication (login/register)
│   ├── migrations/
│   ├── __init__.py
│   ├── models.py
│   └── ...
├── emotion/                    # Handles emotion detection and webcam streaming
│   ├── migrations/
│   ├── ml/                     # Contains ML model, training, and inference code
│   │   ├── train_model.py
│   │   ├── emotion_detector.py
│   │   └── haarcascade_frontalface_default.xml
│   ├── __init__.py
│   └── ...
├── learning/                   # Manages courses, lessons, and content recommendations
│   ├── migrations/
│   ├── __init__.py
│   └── ...
├── analytics/                  # Stores and displays emotion/engagement analytics
│   ├── migrations/
│   ├── __init__.py
│   └── ...
├── manage.py
├── requirements.txt
└── README.md
```

## Step-by-Step Setup Instructions (Windows Friendly)

### 1. Prerequisites

- Python 3.8+
- PostgreSQL
- Git

### 2. Clone the Repository

```bash
git clone <repository_url>
cd emotion_learning_platform
```

### 3. Create a Virtual Environment

Create a virtual environment to isolate project dependencies.

```bash
python -m venv venv
```

### 4. Activate the Virtual Environment

You must activate the virtual environment every time you work on the project.

```bash
venv\Scripts\activate
```
_For macOS/Linux, use: `source venv/bin/activate`_

### 5. Install Dependencies

Install all the required Python packages.

```bash
pip install -r requirements.txt
```

### 6. Set Up PostgreSQL

- Start the PostgreSQL service.
- Open the `psql` shell or a GUI tool like pgAdmin.
- Create a new database for the project.
  ```sql
  CREATE DATABASE emotion_learning_db;
  ```
- Create a new user with a secure password.
  ```sql
  CREATE USER elearning_user WITH PASSWORD 'your_secure_password';
  ```
- Grant all privileges on the new database to the user.
  ```sql
  GRANT ALL PRIVILEGES ON DATABASE emotion_learning_db TO elearning_user;
  ```

### 7. Configure Environment Variables

Create a `.env` file in the root of the project directory to store your database credentials and Django secret key. The project is pre-configured to load this file.

```ini
# .env file
SECRET_KEY='your-strong-random-secret-key'
DEBUG=True
DB_NAME='emotion_learning_db'
DB_USER='elearning_user'
DB_PASSWORD='your_secure_password'
DB_HOST='localhost'
DB_PORT='5432'
```
**Note:** You can generate a new `SECRET_KEY` using an online Django key generator.

### 8. Set Up Kaggle API for Dataset Download

- Log in to your Kaggle account.
- Go to your profile, and select **Account**.
- In the API section, click **Create New API Token**. This will download a `kaggle.json` file containing your credentials.
- Create a folder named `.kaggle` in your user's home directory (e.g., `C:\Users\<Your-Username>\.kaggle\`).
- Place the downloaded `kaggle.json` file inside this `.kaggle` folder.

### 9. Download the FER Dataset

You can run this script directly in a Python shell from your activated virtual environment to download and extract the dataset.

```python
import kagglehub
import os
import zipfile

# Download the dataset zip file
print("Downloading dataset...")
path = kagglehub.dataset_download("ananthu017/emotion-detection-fer")
print(f"Zip file downloaded to: {path}")

# Unzip the dataset into a 'dataset' directory in your project root
dataset_dir = 'dataset'
os.makedirs(dataset_dir, exist_ok=True)
print(f"Extracting dataset to '{dataset_dir}' directory...")
with zipfile.ZipFile(path, 'r') as zip_ref:
    zip_ref.extractall(dataset_dir)

print(f"Dataset successfully extracted to: {os.path.abspath(dataset_dir)}")
```

### 10. Train the Emotion Detection Model (Optional)

A pre-trained model will be provided, but if you wish to train it yourself:

```bash
python emotion/ml/train_model.py
```
This script will preprocess the data from the `dataset` directory, train the CNN model, and save the trained model file.

### 11. Apply Database Migrations

Create the tables in your PostgreSQL database based on the Django models.

```bash
python manage.py makemigrations
python manage.py migrate
```

### 12. Create a Superuser

Create an admin user to access the Django admin panel.

```bash
python manage.py createsuperuser
```
Follow the prompts to set up your username, email, and password.

### 13. Run the Development Server

```bash
python manage.py runserver
```

### 14. Access the Application

Open your web browser and navigate to `http://127.0.0.1:8000`. You can log in to the admin panel at `http://127.0.0.1:8000/admin/` with your superuser credentials.
