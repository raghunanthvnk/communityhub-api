pipeline {
  environment {
    TAG = bat(
        returnStdout: true,
        script: 'git describe --tags --always'
    ).trim()
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
    stage('Deploy Image to Hub') {
      steps{
        script {
            docker.withRegistry( '', registryCredential ) {
            dockerImage.push()
            dockerImage.push("$BUILD_NUMBER")
           

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
    stage('deploy to AKS') {
      when {
        expression { env.GIT_BRANCH == 'origin/master' }
      }
      steps {
        // dir(".configrepo") {
        //   checkout([
        //       $class                           : 'GitSCM',
        //       branches                         : [[name: '*/master']],
        //       doGenerateSubmoduleConfigurations: false,
        //       extensions                       : [[$class: 'CleanCheckout']],
        //       submoduleCfg                     : [],
        //       userRemoteConfigs                : [[credentialsId: 'github_credentials', url: 'https://github.com/raghunanthvnk/communityhub-api.git']]
        //   ])

        //   bat '''
        //        #!/bin/bash
        //        curl -sL -o yq https://github.com/mikefarah/yq/releases/download/3.3.4/yq_linux_amd64 && chmod a+x yq
        //        '''

        //   bat '''
        //        #UPDATE TAG FOR AKS 
        //        ./yq w --inplace k8s/kustomization.yaml \
        //        'images.(name==docker.io/raghunathkoppuravuri/communityhub-api).newTag' \
        //        $BUILD_NUMBER \
        //        --style=double

        //        git add dev/kustomization.yaml
        //        git config --global user.email "kraghunathvnk@gmail.com"
        //        git config --global user.name "kraghu456"
        //        git commit -m "Update communityhub-api image tag to $BUILD_NUMBER."
        //        git push origin HEAD:refs/heads/master
        //        '''
           
        // }
         script {
            kubernetesDeploy(configs:"k8s/kustomization.yaml",kubeconfigId:"kubectlconfig")
            }
      }
    }
  }
}