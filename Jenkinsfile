pipeline {
    agent any

    environment {
        PROJECT_ID = credentials('gcp-project-id') // Jenkins credentials
        REGION = 'europe-west1'
        IMAGE_NAME = "gcr.io/%PROJECT_ID%/cloud-app:latest"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }


        stage('Build Docker Image') {
            steps {
                script {
                    bat "docker build -t %IMAGE_NAME% ."
                }
            }
        }


        stage('Push Docker Image') {
            steps {
                script {
                    bat "gcloud auth configure-docker"
                    bat "docker push %IMAGE_NAME%"
                }
            }
        }


        stage('Terraform Init & Plan') {
            steps {
                dir('terraform') {
                    bat "terraform init"
                    bat "terraform plan -var=\"project_id=%PROJECT_ID%\" -var=\"region=%REGION%\" -var=\"image_url=%IMAGE_NAME%\""
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                dir('terraform') {
                    bat "terraform apply -auto-approve -var=\"project_id=%PROJECT_ID%\" -var=\"region=%REGION%\" -var=\"image_url=%IMAGE_NAME%\""
                }
            }
        }
    }
}
