pipeline {
    agent any
    stages {
        stage('clone repo and build modeler') {
            steps {
               // sh "rm -Rf /var/lib/jenkins/workspace/dfmproject/dfm"
               sh "git clone https://github.com/rxwminhaj/dfm.git"
               sh "mv /var/lib/jenkins/workspace/dfmproject_dfmproject/dfm/* /var/lib/jenkins/workspace/dfmproject_dfmproject/"
               sh "yarn install"
               sh "npm install"
               sh "rm -rf /var/lib/jenkins/workspace/dfmproject_dfmproject/package-lock.json"
               sh "node --max_old_space_size=4098 ./node_modules/@angular/cli/bin/ng build --project core"
               sh "node --max_old_space_size=4098 ./node_modules/@angular/cli/bin/ng build --project user-management"
               sh "node --max_old_space_size=4098 ./node_modules/@angular/cli/bin/ng build --project modeler"
            // build job: 'demo-dfm-service-scm', propagate: true, wait: true

            }
        }
    }

}
