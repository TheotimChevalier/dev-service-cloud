pipeline {
    agent any

    parameters {
        string(name: 'GCP_PROJECT_ID', defaultValue: 'test-jenkis', description: 'Google Cloud Project ID (ex: my-project-123456)')
        string(name: 'GCLOUD_PATH', defaultValue: 'C:\\Users\\thp99\\AppData\\Local\\Google\\Cloud SDK\\google-cloud-sdk\\bin\\gcloud.cmd', description: 'Absolute path to gcloud.cmd on Jenkins agent')
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
                    if (!params.GCLOUD_PATH?.trim()) {
                        error('Missing required parameter: GCLOUD_PATH. Set absolute path to gcloud.cmd in Build with Parameters.')
                    }
                    env.GCLOUD_PATH_EFF = params.GCLOUD_PATH.trim()
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
                bat '"%GCLOUD_PATH_EFF%" auth print-access-token > gcloud_token.txt'
                bat 'docker login -u oauth2accesstoken --password-stdin https://gcr.io < gcloud_token.txt'
                bat 'del /q gcloud_token.txt'
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
