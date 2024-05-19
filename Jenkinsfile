pipeline {
    agent any

    environment {
        REGION = 'us-east-1'
        USERNAME = 'AWS'
        ECR_URL = 'public.ecr.aws/n6e3e7b0/backend'
        VERSION = "${BUILD_NUMBER}-${new Date().format("yyyyMMdd-HHmmss")}" // Dynamic version combining build number and timestamp
    }

    stages {
        stage('Checkout') {
            steps {
                script {  
                    checkout scm
                }
            }
        }

        // stage('Build docker image') {
        //     steps {
        //         sh 'docker build -t backend_basic .'
        //     }
        // }
        stage('Authenticate to ECR'){
            steps{
              sh "aws ecr-public get-login-password --region ${REGION} | docker login --username ${USERNAME} --password-stdin ${ECR_URL}"
            }
        }
        stage('Push to ECR'){
            steps{
                sh 'docker compose -d --build'
                sh "docker tag backend:latest ${ECR_URL}/backend:${VERSION}"
                sh "docker push ${ECR_URL}/backend:${VERSION}"
            }
        }
    }

    post {
        success {
            echo 'Build successful! Send notifications, etc.'
        }

        failure {
            echo 'Build failed! Send notifications, etc.'
        }
    }
}