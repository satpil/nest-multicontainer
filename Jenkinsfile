pipeline {
     agent any

    stages {
        stage('Checkout') {
            steps {
                script {  
                    checkout scm
                }
            }
        }

        stage('Build docker image') {
            steps {
                sh 'docker compose up -d --build'
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