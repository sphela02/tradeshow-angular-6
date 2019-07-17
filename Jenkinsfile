@Library('gba-jenkins-scripts') _

def solution = "tradeshow-travel"
def projects = [ 'TradeshowTravel.Web' ] as String[]

def compiler = 'msbuild'
def testTool = 'mstest'

def environment = 'Dev'
def configuration = 'Debug'

def shouldDeploy = false
def destinationPaths = ["\\\\MLBIISDEVL1R2\\tradeshowtravel"]
def downloadPaths = ["\\\\mlbiisdevl1r2\\wwwroot-TradeshowTravelDownloads"]
def scheduledTaskPath = "\\\\gswwwdev4\\TradeShowScheduledTaskTest"

if(env.BRANCH_NAME.equalsIgnoreCase('dev') || env.BRANCH_NAME.equalsIgnoreCase('content-filtering')) {
    destinationPaths = ["\\\\MLBIISDEVL1R2\\tradeshowtravel"]
    downloadPaths = ["\\\\mlbiisdevl1r2\\wwwroot-TradeshowTravelDownloads"]
    scheduledTaskPath = "\\\\gswwwdev4\\TradeShowScheduledTaskTest"
    shouldDeploy = true
}

//Production uses two servers for load balancing.
if (env.BRANCH_NAME.equalsIgnoreCase('master')) {
    destinationPaths =  ["\\\\MLBIIS1R2\\tradeshowtravel", "\\\\MLBIIS2R2\\tradeshowtravel"]
    downloadPaths = ["\\\\mlbiis1r2\\wwwroot-TradeshowTravelDownloads", "\\\\mlbiis2r2\\wwwroot-TradeshowTravelDownloads " ]
    scheduledTaskPath = "\\\\mlbiis1r2\\TradeshowTravelScheduledTask"
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
                dir('TradeshowTravel.Web') {
                    build(compiler, configuration, environment, '../')
                }

				dir('TradeshowTravel.Web.Download') {
                    build(compiler, configuration, environment, '../')
                }

                dir('TradeshowTravel.ScheduledTask'){
                    def msbuild_cmd = "\"C:\\Program Files (x86)\\MSBuild\\14.0\\Bin\\MSBuild.exe\""
                    def msbuild_args = "/t:Build /p:Configuration=${configuration} /v:m"
                    bat "${msbuild_cmd} /t:Clean"
                    bat "${msbuild_cmd} ${msbuild_args}"
                }

				if(shouldDeploy){
                    dir("TradeshowTravel.Client"){
                        try {
                            echo "Running npm install"
                            bat "npm install"

                            echo "Building Angular"
                            bat "node_modules/.bin/ng.cmd build --prod"

                            echo "Copying Angular files to project publish folder"
                            def status = bat returnStatus: true, script: "ROBOCOPY /S dist ../Publish/${environment}"
                            echo "ROBOCOPY returned ${status}"

                            // Only fail the build if Robocopy returns serious errors. 
                            // It's normal to have mismatched directory because files are constantly being added or removed
                            if (status == 8 || status == 16) 
                            {
                                throw new Exception("ROBOCOPY failed")
                            }
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
            stage('Deploy - Scheduled Task'){
                dir('TradeshowTravel.ScheduledTask'){
                    try{
                        echo "Deploy scheduled task to ${scheduledTaskPath}"
                        def scheduledTaskSource = "bin/${configuration}"
                        deploy(scheduledTaskSource, scheduledTaskPath, false)
                    }
                    catch(e) {
                        currentBuild.result = "Failed"
						notify(currentBuild.result, 'Checkout')
						throw e
                    }      
                }
            }

            stage('Deploy - Download'){
                try{
                    downloadPaths.each{ path ->
                        echo "Deploy download project to ${path}"
                        dir('TradeshowTravel.Web.Download'){
                            def downloadPublishDir = "Publish/${configuration}"
                            deploy(downloadPublishDir, path, false)
                        }
                    }
                }
                catch(e) {
                    currentBuild.result = "Failed"
					notify(currentBuild.result, 'Checkout')
					throw e
                }      
            }

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