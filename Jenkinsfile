@Library('gba-jenkins-scripts') _

//TODO Change the "CHANGE THIS" strings to the correct values and then uncomment.
def solution = "tradeshow-travel"
def projects = [ 'TradeshowTravel.Web' ] as String[]

def compiler = 'msbuild'
def testTool = 'mstest'
//TODO Change the "CHANGE THIS" strings to the correct values and then uncomment.
//def testProjects = ['CHANGE THIS'] as String[]

def environment = 'Dev'
def configuration = 'MLBIISDEVL1R2'

def shouldDeploy = false
def destinationPath = "\\\\MLBIISDEVL1R2\\tradeshowtravel"

if(env.BRANCH_NAME.equalsIgnoreCase('dev') || env.BRANCH_NAME.equalsIgnoreCase('feature/TSTRAV-1-ghuang01') ) {
    //TODO Change the "CHANGE THIS" strings to the correct values and then uncomment.
   destinationPath = "\\\\MLBIISDEVL1R2\\tradeshowtravel"

    shouldDeploy = true
}

//Production uses two servers for load balancing. I still need to figure out how to do that in Jenkins
//if (env.BRANCH_NAME.equalsIgnoreCase('master')) {
//    TODO Change the "CHANGE THIS" strings to the correct values and then uncomment.
//    destinationPath = "CHANGE THIS (PROD)"

//	environment = 'Prod'
//	configuration = 'Release'

//    shouldDeploy = true
//}

def agent = tools.getBuildAgent()
def branch = env.BRANCH_NAME.replaceAll('/', '-')
def workPath = "workspace/GBA/${solution}/${branch}"

// Pull requests and new branches won't have a previous build. Treat non-existing previous as successful.
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

				
			  dir("TradeshowTravel.Client"){
			    try {
			  		bat "Robocopy /S dist ../Publish/${environment}"
				  }
                catch(e) {
                    // gobble gobble gobble
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
                    projects.each { proj ->
                        dir(proj) {
                            def source = ".\\Publish\\${environment}"
                            deploy(source, destinationPath)
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
                        archiveArtifacts artifacts: "\\${proj}\\Publish\\${environment}\\**\\*.*", onlyIfSuccessful: true    
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