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
                    docker build -t intervolz-website .
                    docker stop intervolz-website-container || true
                    docker rm intervolz-website-container || true

                    docker run -d  \
                        --network intervolz-network \
                        --name intervolz-website-container \
                        intervolz-website
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
