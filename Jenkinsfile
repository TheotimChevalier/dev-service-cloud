pipeline {
    agent any

    environment {
        PROJECT_ID = credentials('gcp-project-id') // Jenkins credentials
        REGION = 'europe-west1'
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
                    def imageName = "gcr.io/${env.PROJECT_ID}/cloud-app:latest"
                    env.IMAGE_NAME = imageName
                    bat "docker build -t ${imageName} ."
                }
            }
        }


        stage('Push Docker Image') {
            steps {
                script {
                    def imageName = env.IMAGE_NAME ?: "gcr.io/${env.PROJECT_ID}/cloud-app:latest"
                    bat "gcloud auth configure-docker"
                    bat "docker push ${imageName}"
                }
            }
        }


        stage('Terraform Init & Plan') {
            steps {
                dir('terraform') {
                    script {
                        def imageName = env.IMAGE_NAME ?: "gcr.io/${env.PROJECT_ID}/cloud-app:latest"
                        bat "terraform init"
                        bat "terraform plan -var=\"project_id=${env.PROJECT_ID}\" -var=\"region=${env.REGION}\" -var=\"image_url=${imageName}\""
                    }
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                dir('terraform') {
                    script {
                        def imageName = env.IMAGE_NAME ?: "gcr.io/${env.PROJECT_ID}/cloud-app:latest"
                        bat "terraform apply -auto-approve -var=\"project_id=${env.PROJECT_ID}\" -var=\"region=${env.REGION}\" -var=\"image_url=${imageName}\""
                    }
                }
            }
        }
    }
}
