pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git 'https://github.com/your-repo/task-manager.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t task-manager .'
                }
            }
        }
        stage('Run Tests') {
            steps {
                script {
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    sh 'ansible-playbook deploy.yml'
                }
            }
        }
    }
    post {
        always {
            sh 'docker rmi task-manager'
        }
    }
}
