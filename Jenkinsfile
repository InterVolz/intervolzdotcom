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
                    docker run -d -p 8081:80 -p 8082:443 \
                        -v /etc/letsencrypt/live/intervolz.com/fullchain.pem:/etc/nginx/ssl/fullchain.pem:ro \
                        -v /etc/letsencrypt/live/intervolz.com/privkey.pem:/etc/nginx/ssl/privkey.pem:ro \
                        --name intervolz-website-container intervolz-website
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
