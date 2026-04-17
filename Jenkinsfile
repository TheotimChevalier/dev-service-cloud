pipeline {
    agent any

    parameters {
        string(name: 'GCP_PROJECT_ID', defaultValue: 'test-jenkis', description: 'Google Cloud Project ID (ex: my-project-123456)')
        string(name: 'GCLOUD_PATH', defaultValue: 'C:\\Program Files\\Google\\Cloud SDK\\google-cloud-sdk\\bin\\gcloud.cmd', description: 'Absolute path to gcloud.cmd on Jenkins agent')
        string(name: 'TERRAFORM_CMD', defaultValue: 'terraform', description: 'Terraform command or absolute path to terraform.exe')
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
                bat 'if not exist "%GCLOUD_PATH%" (echo gcloud not found at %GCLOUD_PATH% & exit /b 1)'
                bat '"%GCLOUD_PATH%" --version'
                bat '%TERRAFORM_CMD% version'
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
                bat '"%GCLOUD_PATH%" auth activate-service-account --key-file="%GCP_SA_KEY%"'
                bat '"%GCLOUD_PATH%" config set project "%GCP_PROJECT_ID%"'
                bat '"%GCLOUD_PATH%" auth configure-docker --quiet'
                bat 'docker push "gcr.io/%GCP_PROJECT_ID%/cloud-app:latest"'
            }
        }


        stage('Terraform Init & Plan') {
            steps {
                dir('terraform') {
                    bat '%TERRAFORM_CMD% init'
                    bat '%TERRAFORM_CMD% plan -var="project_id=%GCP_PROJECT_ID%" -var="region=%REGION%" -var="image_url=gcr.io/%GCP_PROJECT_ID%/cloud-app:latest"'
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                dir('terraform') {
                    bat '%TERRAFORM_CMD% apply -auto-approve -var="project_id=%GCP_PROJECT_ID%" -var="region=%REGION%" -var="image_url=gcr.io/%GCP_PROJECT_ID%/cloud-app:latest"'
                }
            }
        }
    }
}
