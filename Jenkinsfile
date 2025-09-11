pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git(
                    url: 'https://github.com/NguyenThanhTruong030603/DO-AN-WEB-TIN-TUC',
                    branch: 'main',
                    credentialsId: 'github-token'
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run app.js') {
            steps {
                sh '''
                  # Dừng tiến trình cũ trên port 8000 (nếu có)
                  fuser -k 8000/tcp || true
                  
                  # Chạy app.js nền
                  nohup node app.js > app.log 2>&1 &
                '''
            }
        }
    }
}
