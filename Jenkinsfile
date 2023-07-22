def CURRENT_STAGE
def REPO_HELM    = 'gitlab.com/official-primaku/primaku-chart-stag' 
def EMAIL        = 'rio.wiraldhani@primaku.com'
def USER_NAME    = 'rioprimaku'
def SECRET	 = 'cdic-staging' // should be changed
def APPS_NAME    = 'primaku-cdic' //should be changed
def BRANCH_NAME  = 'main'

pipeline {
  agent any
    environment {
        tag = sh(returnStdout: true, script: "git rev-parse --short=7 HEAD").trim()
    }
  stages {
    stage ('Set Environtmet') {
      steps {
        script {
          CURRENT_STAGE=env.STAGE_NAME
          if (env.BRANCH_NAME == 'master') {
              echo 'This branch Master'
            } else {
              sh "echo 'This branch ${env.BRANCH_NAME} !'"
            }
        }
      }
    }
    stage('SCM') {
        steps {
          node ('master') {
            checkout scm
          }
          script {
            CURRENT_STAGE=env.STAGE_NAME
          }
        }
    }
    stage('Build Base & Prod Image') {
      steps {
        node ('master') {
          script {
            CURRENT_STAGE=env.STAGE_NAME
            sh "docker build -t gcr.io/primaku-web/${APPS_NAME}-base -f Dockerfile.base ./ && docker push gcr.io/primaku-web/${APPS_NAME}-base"
          }
        }
      }
    }
    stage('Build image') {  
      steps {
        node ('master') {  
          script {      
            CURRENT_STAGE=env.STAGE_NAME
            app = docker.build("primaku-web/${APPS_NAME}")
            }
          } 
        }
      }
    stage('Push image') {
      steps {
        node ('master') {
          script {
            CURRENT_STAGE=env.STAGE_NAME
            docker.withRegistry('https://gcr.io', 'gcr:primaku-web') {
              app.push("${env.tag}")
            }          
          }
        }
      } 
    }
    stage('Delete image') {
      steps {
        node ('master') {
          script {
            sh "docker rmi gcr.io/primaku-web/${APPS_NAME}:${env.tag}"
            sh "docker rmi primaku-web/${APPS_NAME}:latest"   
          }
        }
      } 
    }
    stage('Helm-Update'){
      steps {
        node ('master') {
          dir('helm'){
            git branch: "${BRANCH_NAME}", changelog: false, credentialsId: 'rioprimaku', poll: false, url: "https://${USER_NAME}@${REPO_HELM}"
            withCredentials([usernamePassword(credentialsId: 'rioprimaku', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
              sh "git config user.email ${EMAIL}"
              sh "git config user.name ${USER_NAME}"
              sh "sed  -i -e 's/tag:.*/tag: ${env.tag}/g' ${APPS_NAME}/values.yaml"
              sh "git add ."
              sh "git commit -m 'Done by Jenkins Job: ${env.BUILD_NUMBER}'"
              sh "git push https://${GIT_USERNAME}:${GIT_PASSWORD}@${REPO_HELM} HEAD:main"
            }
        script {
          CURRENT_STAGE=env.STAGE_NAME
            }
          }
        }
      }
    }
  }
}
