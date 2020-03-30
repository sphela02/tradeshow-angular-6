@Library('gba-jenkins-scripts') _

def solution = "tradeshow-travel"
def projects = [ 'TradeshowTravel.Web' ] as String[]

def compiler = 'msbuild'
def testTool = 'mstest'

def environment = 'Dev'
def configuration = 'Debug'

def shouldDeploy = false
def destinationPaths = ['\\\\usmlb1web1d\\wwwroot-tradeshowtravel']
def downloadPaths = ['\\\\usmlb1web1d\\wwwroot-TradeshowTravelDownloads']
def scheduledTaskPath = '\\\\usmlb1web1d\\TradeshowTravelScheduledTask'

if(env.BRANCH_NAME.equalsIgnoreCase('dev')) {
    destinationPaths = ['\\\\usmlb1web1d\\wwwroot-tradeshowtravel']
    downloadPaths = ['\\\\usmlb1web1d\\wwwroot-TradeshowTravelDownloads']
    scheduledTaskPath = '\\\\usmlb1web1d\\TradeshowTravelScheduledTask'
    shouldDeploy = true
}

//Production uses two servers for load balancing.
if (env.BRANCH_NAME.equalsIgnoreCase('master')) {
    destinationPaths =  ['\\\\usmlb1web1p\\wwwroot-tradeshowtravel', '\\\\usmlb1web2p\\wwwroot-tradeshowtravel']
    downloadPaths = ['\\\\usmlb1web1p\\wwwroot-TradeshowTravelDownloads', '\\\\usmlb1web2p\\wwwroot-TradeshowTravelDownloads' ]
    scheduledTaskPath = '\\\\usmlb1web2p\\TradeshowTravelScheduledTask'
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
							if(environment == 'Prod'){ 
								bat "node_modules/.bin/ng.cmd build --prod"
							}else{
								bat "node_modules/.bin/ng.cmd build --prod --environment=devServer"
							}

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
                if(scheduledTaskPath != null && !scheduledTaskPath.isEmpty()){
                    dir('TradeshowTravel.ScheduledTask'){
                        try{
                            echo "Deploy scheduled task to ${scheduledTaskPath}"
                            def scheduledTaskSource = "bin/${configuration}"
                            deploy(scheduledTaskSource, scheduledTaskPath)
                        }
                        catch(e) {
                            currentBuild.result = "Failed"
                            notify(currentBuild.result, 'Checkout')
                            throw e
                        }      
                    }
                }
            }

            stage('Deploy - Download'){
                try{
                    downloadPaths.each{ path ->
                        echo "Deploy download project to ${path}"
                        dir('TradeshowTravel.Web.Download'){
                            def downloadPublishDir = "Publish/${environment}"
                            deploy(downloadPublishDir, path)
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
                                // deploy(source, path, false)

								// Verify source directory actually exists before trying to use it
								if (fileExists(source)) {
									def publishStatus = bat returnStatus: true, script: "ROBOCOPY ${source} ${path} /e /purge"
									echo "ROBOCOPY returned ${publishStatus}"

									if (publishStatus == 8 || publishStatus == 16) 
									{
										throw new Exception("ROBOCOPY failed")
									}
								}
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
