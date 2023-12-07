pipeline {
    agent any
    stages {
        stage('Debug') {
            steps {
                echo 'Starting pipeline execution...'
                sh 'env'
            }
        }
        stage('Check Environment') {
            steps {
                echo 'Checking Environment...'
                sh 'docker ps'
            }
        }
        stage('Build and Deploy Intervolz Locally') {
            steps {
                sh '''
                    docker build -t intervolz-website static-websites/intervolz
                    docker stop intervolz-website-container || true
                    docker rm intervolz-website-container || true
                    docker run -d -p 8081:80 --name intervolz-website-container intervolz-website
                '''
            }
        }
        stage('Celebrate good times!') {
            steps {
                echo 'We are celebrating...'
            }
        }
    }
}
