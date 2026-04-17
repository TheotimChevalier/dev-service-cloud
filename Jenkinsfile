pipeline {
    agent any

    environment {
        PROJECT_ID = credentials('gcp-project-id') // Jenkins credentials
        REGION = 'europe-west1'
        IMAGE_NAME = "gcr.io/${PROJECT_ID}/cloud-app:latest"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Pas de SCM, code déjà présent sur l’agent Jenkins.'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t $IMAGE_NAME .'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    sh 'gcloud auth configure-docker'
                    sh 'docker push $IMAGE_NAME'
                }
            }
        }

        stage('Terraform Init & Plan') {
            steps {
                dir('terraform') {
                    sh 'terraform init'
                    sh 'terraform plan -var="project_id=$PROJECT_ID" -var="region=$REGION" -var="image_url=$IMAGE_NAME"'
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                dir('terraform') {
                    sh 'terraform apply -auto-approve -var="project_id=$PROJECT_ID" -var="region=$REGION" -var="image_url=$IMAGE_NAME"'
                }
            }
        }
    }
}
