pipeline {
  environment {
    // TAG = sh(
    //     returnStdout: true,
    //     script: 'git describe --tags --always'
    // ).trim()
    // BRANCH_TAG = sh(
    //     returnStdout: true,
    //     script: 'echo ${GIT_BRANCH} | cut -d "/" -f 2'
    // )
    MASTER_REPO = ''
    imagename = "raghunathkoppuravuri/communityhub-api"
    registryCredential = 'dockerhub_credentials'
    DOCKERFILE = 'Dockerfile'
    dockerImage = ''
  }
  agent any
  stages {
    // stage('Cloning Git') {
    //   steps {
    //     git([url: 'https://github.com/raghunanthvnk/communityhub-api.git', branch: 'master', credentialsId: 'github_credentials'])
 
    //   }
    // }
    stage('init') {
      steps {
        checkout scm
      }
    }
    stage('Building image') {
      steps{
        // script {
        //   dockerImage = docker.build("${imagename}:${TAG}", "-f ${DOCKERFILE} .")
        // }
        dir(".") {
          script {
            dockerImage = docker.build("${imagename}:$BUILD_NUMBER", "-f ${DOCKERFILE} .")
          }
        }
      }
    }
    stage('Deploy Image') {
      steps{
        script {
            docker.withRegistry( '', registryCredential ) {
            dockerImage.push("$BUILD_NUMBER")
            dockerImage.push("$GIT_BRANCH")

            if (env.GIT_BRANCH == 'origin/master') {
              dockerImage.push('latest')
            }
          }
        }
      }
    }
    stage('Remove Unused docker image') {
      steps{
        bat "docker rmi $imagename:$BUILD_NUMBER"
        bat "docker rmi $imagename:latest"
 
      }
    }
  }
}