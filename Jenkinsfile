pipeline {
    agent any

    parameters {
        string(name: 'GCP_PROJECT_ID', defaultValue: 'test-jenkis', description: 'Google Cloud Project ID (ex: my-project-123456)')
        string(name: 'GCLOUD_PATH', defaultValue: '', description: 'Optional absolute path to gcloud.cmd on Jenkins agent (leave empty for auto-detection)')
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

                    // Map build parameters to environment variables used by bat steps.
                    env.GCP_PROJECT_ID_EFF = params.GCP_PROJECT_ID.trim()
                    env.TERRAFORM_CMD_EFF = (params.TERRAFORM_CMD?.trim()) ? params.TERRAFORM_CMD.trim() : 'terraform'

                    def gcloudCandidates = [
                        params.GCLOUD_PATH?.trim(),
                        'C:\\Program Files\\Google\\Cloud SDK\\google-cloud-sdk\\bin\\gcloud.cmd',
                        'C:\\Program Files (x86)\\Google\\Cloud SDK\\google-cloud-sdk\\bin\\gcloud.cmd',
                        "${env.USERPROFILE}\\AppData\\Local\\Google\\Cloud SDK\\google-cloud-sdk\\bin\\gcloud.cmd"
                    ].findAll { it }

                    def detected = gcloudCandidates.find { new File(it).exists() }
                    if (!detected) {
                        error('gcloud.cmd not found. Set GCLOUD_PATH in Build with Parameters to the absolute path of gcloud.cmd.')
                    }
                    env.GCLOUD_PATH_EFF = detected
                }
                bat 'if not exist "%GCLOUD_PATH_EFF%" (echo gcloud not found at %GCLOUD_PATH_EFF% & exit /b 1)'
                bat '"%GCLOUD_PATH_EFF%" --version'
                bat '%TERRAFORM_CMD_EFF% version'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker version'
                bat 'docker build --file Dockerfile --tag "gcr.io/%GCP_PROJECT_ID_EFF%/cloud-app:latest" "%WORKSPACE%"'
            }
        }


        stage('Push Docker Image') {
            steps {
                bat '"%GCLOUD_PATH_EFF%" auth activate-service-account --key-file="%GCP_SA_KEY%"'
                bat '"%GCLOUD_PATH_EFF%" config set project "%GCP_PROJECT_ID_EFF%"'
                bat '"%GCLOUD_PATH_EFF%" auth configure-docker --quiet'
                bat 'docker push "gcr.io/%GCP_PROJECT_ID_EFF%/cloud-app:latest"'
            }
        }


        stage('Terraform Init & Plan') {
            steps {
                dir('terraform') {
                    bat '%TERRAFORM_CMD_EFF% init'
                    bat '%TERRAFORM_CMD_EFF% plan -var="project_id=%GCP_PROJECT_ID_EFF%" -var="region=%REGION%" -var="image_url=gcr.io/%GCP_PROJECT_ID_EFF%/cloud-app:latest"'
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                dir('terraform') {
                    bat '%TERRAFORM_CMD_EFF% apply -auto-approve -var="project_id=%GCP_PROJECT_ID_EFF%" -var="region=%REGION%" -var="image_url=gcr.io/%GCP_PROJECT_ID_EFF%/cloud-app:latest"'
                }
            }
        }
    }
}
