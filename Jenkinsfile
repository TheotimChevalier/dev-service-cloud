pipeline {
    agent any

    environment {
        GCP_PROJECT_ID = credentials('gcp-project-id') // Secret text : ID du projet GCP
        GCP_SA_KEY = credentials('gcp-service-account') // Secret file : clé JSON
        REGION = 'europe-west1'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                bat 'docker version'
                bat 'docker build --file Dockerfile --tag "gcr.io/%GCP_PROJECT_ID%/cloud-app:latest" "%WORKSPACE%"'
            }
        }


        stage('Push Docker Image') {
            steps {
                bat 'gcloud auth activate-service-account --key-file="%GCP_SA_KEY%"'
                bat 'gcloud config set project "%GCP_PROJECT_ID%"'
                bat 'gcloud auth configure-docker --quiet'
                bat 'docker push "gcr.io/%GCP_PROJECT_ID%/cloud-app:latest"'
            }
        }


        stage('Terraform Init & Plan') {
            steps {
                dir('terraform') {
                    bat 'terraform init'
                    bat 'terraform plan -var="project_id=%GCP_PROJECT_ID%" -var="region=%REGION%" -var="image_url=gcr.io/%GCP_PROJECT_ID%/cloud-app:latest"'
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                dir('terraform') {
                    bat 'terraform apply -auto-approve -var="project_id=%GCP_PROJECT_ID%" -var="region=%REGION%" -var="image_url=gcr.io/%GCP_PROJECT_ID%/cloud-app:latest"'
                }
            }
        }
    }
}
