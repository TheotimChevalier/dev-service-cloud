pipeline {
    agent any

    parameters {
        string(name: 'GCP_PROJECT_ID', defaultValue: 'test-jenkis', description: 'Google Cloud Project ID (ex: my-project-123456)')
    }

    environment {
        GCP_SA_KEY = credentials('gcp-service-account') // Secret file : clé JSON
        REGION = 'europe-west1'
    }

    stages {
        stage('Validate Inputs') {
            steps {
                script {
                    if (!params.GCP_PROJECT_ID?.trim()) {
                        error('Missing required parameter: GCP_PROJECT_ID. Set it in Build with Parameters or give a non-empty default value in Jenkinsfile.')
                    }
                }
            }
        }

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
