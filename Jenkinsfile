@Library('gba-jenkins-scripts') _

def solution = "tradeshow-travel"
def projects = [ 'TradeshowTravel.Web' ] as String[]

def compiler = 'msbuild'
def testTool = 'mstest'

def environment = 'Dev'
def configuration = 'Debug'

def shouldDeploy = false
def destinationPaths = ["\\\\MLBIISDEVL1R2\\tradeshowtravel"]

if(env.BRANCH_NAME.equalsIgnoreCase('dev') || env.BRANCH_NAME.equalsIgnoreCase('TSTRAV-74-jenkins')) {
    destinationPaths = ["\\\\MLBIISDEVL1R2\\tradeshowtravel"]

    shouldDeploy = true
}

//Production uses two servers for load balancing.
if (env.BRANCH_NAME.equalsIgnoreCase('master')) {
    destinationPaths =  ["\\\\MLBIIS1R2\\tradeshowtravel", "\\\\MLBIIS2R2\\tradeshowtravel"]

	environment = 'Prod'
	configuration = 'Release'

    shouldDeploy = true
}

def agent = tools.getBuildAgent()
def branch = env.BRANCH_NAME.replaceAll('/', '-')
def workPath = "workspace/GBA/${solution}/${branch}"

def previousBuild = "SUCCESS"

node(agent) {
	ws(workPath) {
        stage('Checkout') {
            try {
                checkout scm
            }
            
            catch(e) {
                currentBuild.result = "Failed"
                notify(currentBuild.result, 'Checkout')
                throw e
            }
        }

        stage('Build') {
            try {
                projects.each { proj ->
                    dir(proj) {
                        build(compiler, configuration, environment, '../')
                    }
                }

				if(shouldDeploy){
                    dir("TradeshowTravel.Client"){
                        try {
                            echo "Running npm install"
                            bat "npm install"

                            echo "Building Angular"
                            bat "node_modules/.bin/ng.cmd build --prod"

                            echo "Copying Angular files to project publish folder"
                            bat "Robocopy /S dist ../Publish/${environment}"
                        }
                        catch(e) {
                            currentBuild.result = "Failed"
							notify(currentBuild.result, 'Checkout')
							throw e
                        }      
                    }
                }
            }
            catch(e) {
                currentBuild.result = "Failed"
                notify(currentBuild.result, 'Build')
                throw e
            }
        }

        if(shouldDeploy) {
            stage('Deploy') {		
                try {
                    destinationPaths.each{ path ->
                        echo "deploying to ${path}"
                        projects.each { proj ->
                            echo "deploying ${proj} to ${path}"
                            dir(proj) {
                                def source = "../Publish/${environment}"
                                deploy(source, path, false)
                            }
                        }
                    }
                }
                catch(e) {
                    currentBuild.result = "Failed"
                    notify(currentBuild.result, 'Deploy')
                    throw e
                }
            }

            stage('Archive') {
                try {
                    projects.each { proj ->
                        archiveArtifacts artifacts: "Publish\\${environment}\\**\\*.*", onlyIfSuccessful: true    
                    }
                }
                catch(e) {
                    currentBuild.result = "Unstable"
                    notify(currentBuild.result, 'Archive')
                    throw e
                }
            }
        }

        stage('Notify') {
            if(currentBuild.getPreviousBuild() != null) {
                previousBuild = "${currentBuild.getPreviousBuild().result}"
            }

            if(previousBuild != "SUCCESS" && (currentBuild.result != "UNSTABLE" || currentBuild.result != "FAILED")) {
                notify(currentBuild.result)
            }
        }
	}
}