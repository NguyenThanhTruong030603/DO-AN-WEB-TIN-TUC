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
                # kill port 8000 nếu có
                fuser -k 8000/tcp || true
                
                # chạy Node.js nền dưới user ubuntu, log lưu trong /tmp
                sudo -u ubuntu nohup node app.js --host 0.0.0.0 > /tmp/app.log 2>&1 &
                '''
            }
        }
    }
}
