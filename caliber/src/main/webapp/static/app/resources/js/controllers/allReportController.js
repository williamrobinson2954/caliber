angular
		.module("charts")
		.controller(
				"allReportController",
				function($rootScope, $scope, $state, $log, caliberDelegate,
						chartsDelegate, allBatches) {

					// *******************************************************************************
					// *** UI
					// *******************************************************************************

					const
					OVERALL = "(All)";
					const
					ALL = -1;
					var radarComparData = null;
					var radarComparObj = {};
					const
					NONE = "NONE";
					// What you see when you open Reports
					$scope.selectedTraining = NONE;
					$scope.selectedSkill = OVERALL;
					$scope.selectedDate = new Date();
					$scope.selectedDate.setFullYear($scope.selectedDate.getFullYear()-1);
					$scope.currentBatch = allBatches[0];
					$scope.reportCurrentWeek = OVERALL;
					$scope.currentBatchWeeks = [];
					$scope.skillstack = [];
						
				
					
					$scope.currentTraineeId = ALL;
					$scope.noBatch = true;
					$scope.batchWeek = false;
					$scope.batchWeekTrainee = false;
					$scope.batchOverall = false;
					$scope.batchOverallTrainee = false;

					(function() {
						// Finishes any left over ajax animation
						NProgress.done();
						
						//get stack of batch skill
						 getAllSkillTypes();

						// get all training types for dropdown
						getAllTrainingTypes();

						if ($scope.currentBatch === null) {
							$scope.noBatch = true;
						} else {
							$scope.noBatch = false;
							$scope.selectedYear = Number($scope.currentBatch.startDate
									.substr(0, 4));
							batchYears();
							getCurrentBatchWeeks($scope.currentBatch.weeks);
							selectView($scope.currentBatch.batchId,
									$scope.reportCurrentWeek,
									$scope.currentTraineeId);
						}

					})();
					
					function selectView(batch, week, trainee) {
						if (week === OVERALL) {
							// All Weeks
							if (trainee === ALL) {
								// All Trainees
								$scope.batchWeek = false;
								$scope.batchWeekTrainee = false;
								$scope.batchOverall = true;
								$scope.batchOverallTrainee = false;
								createBatchOverall();

							} else {
								// Specific Trainee
								$rootScope.$emit("GET_TRAINEE_OVERALL",
										$scope.currentTraineeId);
								displayTraineeOverallTable($scope.currentTraineeId);
								$scope.batchWeek = false;
								$scope.batchWeekTrainee = false;
								$scope.batchOverall = false;
								$scope.batchOverallTrainee = true;
								createBatchOverallTrainee();
							}
						} else {
							// Specific Week
							if (trainee === ALL) {
								// All Trainees
								$rootScope.$emit('test');
								$scope.batchWeek = true;
								$scope.batchWeekTrainee = false;
								$scope.batchOverall = false;
								$scope.batchOverallTrainee = false;
								createBatchWeek();
							} else {
								// Specific trainee
								$scope.batchWeek = false;
								$scope.batchWeekTrainee = true;
								$scope.batchOverall = false;
								$scope.batchOverallTrainee = false;
								createBatchWeekTrainee();
								$scope.getTraineeNote($scope.currentTraineeId,$scope.currentWeek);
							}

						}

					}
					function getAllSkillTypes(){
						caliberDelegate.all.enumSkillType().then(function(skills){
							$scope.skillstack= skills;
							$log.debug($scope.skillstack);
							$log.debug("Hello there" );
							});
						
					}
					function displayTraineeOverallTable(traineeId) {
						$scope.traineeOverall=[];	
						
						for(weekNum in $scope.currentBatchWeeks){
							var week = parseInt(weekNum) + 1
							$scope.traineeOverall.push({week});
						}
						
						caliberDelegate.all
								.getAllTraineeNotes(traineeId)
								.then(
										function(response) {
											for(note of response){
												if($scope.traineeOverall[parseInt(note.week)-1] !==undefined){
													$scope.traineeOverall[parseInt(note.week)-1].trainerNote= note;
												}
											}											
										});
						
						caliberDelegate.qc.
								traineeOverallNote(traineeId)
								.then(
										function(response) {
											for(qcNote of response){
												if($scope.traineeOverall[parseInt(qcNote.week)-1] !== undefined){
													$scope.traineeOverall[parseInt(qcNote.week)-1].qcNote = qcNote;
												}
											}
										});
					}

					function getCurrentBatchWeeks(weeks) {
						$scope.currentBatchWeeks = [];
						for (var i = 1; i <= weeks; i++)
							$scope.currentBatchWeeks.push(i);
					}

					// Filter batches by year
					$scope.years = addYears();
					$scope.batches = allBatches;
					
					$scope.currentTrainee = {
						name : "Trainee",
					}
					// hide filter tabs
					$scope.hideOtherTabs = function() {
						return $scope.currentBatch.trainingName !== "Batch";
					}

					function addYears() {
						var currentYear = new Date().getFullYear();
						$scope.selectedYear = currentYear;

						var data = [];
						// List all years from 2014 --> current year
						for (var y = currentYear + 1; y >= currentYear - 2; y--) {
							data.push(y)
						}
						return data;
					}
					function batchYears() {
						$scope.batchesByYear = [];
						for (var i = 0; i < allBatches.length; i++) {
							if ($scope.selectedYear === Number(allBatches[i].startDate
									.substr(0, 4))) {
								$scope.batchesByYear.push(allBatches[i]);
							}
						}
					}

					$scope.selectYear = function(index) {
						$scope.selectedYear = $scope.years[index];
						sortByDate($scope.selectedYear);
						batchYears();
						$scope.currentBatch = $scope.batchesByYear[0];
						$scope.reportCurrentWeek = OVERALL;
						$scope.currentTraineeId = ALL;
						selectView($scope.currentBatch.batchId,
								$scope.reportCurrentWeek,
								$scope.currentTraineeId);
					};

					function sortByDate(currentYear) {
						$scope.selectedBatches = [];
						for (var i = 0; i < $scope.batches.length; i++) {
							var date = new Date($scope.batches[i].startDate);
							if (date.getFullYear() === currentYear) {
								$scope.selectedBatches.push($scope.batches[i]);
							}
						}
					}

					$scope.selectCurrentBatch = function(index) {
						$scope.currentBatch = $scope.batchesByYear[index];
						getCurrentBatchWeeks($scope.currentBatch.weeks);
						$scope.reportCurrentWeek = OVERALL;
						$scope.currentTraineeId = ALL;
						selectView($scope.currentBatch.batchId,
								$scope.reportCurrentWeek,
								$scope.currentTraineeId);
					}

					$scope.selectCurrentWeek = function(week) {
						$scope.currentWeek = week;
						$scope.reportCurrentWeek = week;
						selectView($scope.currentBatch.batchId,
								$scope.reportCurrentWeek,
								$scope.currentTraineeId);
					}
					/*
					 * scope function to display the table if a batch and week
					 * has been selected
					 */
					$scope.displayTable = function() {
						if ($scope.currentBatch === null
								|| $scope.currentWeek === null) { 
							return false;
						}
						return true;
					}
					$scope.displayTraineeOverallTable = function() {
						if ($scope.currentBatch === null
								|| $scope.currentWeek === null
								|| $scope.batchOverallTrainee === null) {
							return false;
						} else {
							return true;
						}
					}
					$scope.selectCurrentTrainee = function(index) {
						if (index === ALL) {
							$scope.currentTrainee = {
								name : "Trainee"
							}
							$scope.currentTraineeId = ALL;
							selectView($scope.currentBatch.batchId,
									$scope.reportCurrentWeek,
									$scope.currentTraineeId);
						} else {
							$scope.currentTraineeId = $scope.currentBatch.trainees[index].traineeId;
							$scope.currentTrainee = $scope.currentBatch.trainees[index];
							$log.debug($scope.currentTrainee);
							selectView($scope.currentBatch.batchId,
									$scope.reportCurrentWeek,
									$scope.currentTraineeId);
						}
					}
					
					// Get Data for Trainees and Batch comparison
					function createAllTraineesAndBatchRadarData(){
						chartsDelegate.radar.data
						.getAllTraineesAndBatchRadarChart($scope.currentBatch.batchId)
						.then(function(data) {
							radarComparData = data;
						})
					}
					
					// toggle Checked and Unchecked for Trainees
					$scope.toggleComparisonRadarChart = function(isChecked, val) {
						radarComparObj[$scope.currentBatch.trainingName] = mainData;
						if(isChecked) {
							radarComparObj[$scope.currentBatch.trainees[val].name] = radarComparData[$scope.currentBatch.trainees[val].name] ;
						} else {
							delete radarComparObj[$scope.currentBatch.trainees[val].name];
						}

						var radarBatchOverallChartObject = chartsDelegate.radar
								.getCombineBatchAndAllTraineeAssess(
										radarComparObj);
						$scope.radarBatchOverallData = radarBatchOverallChartObject.data;
						$scope.radarBatchOverallOptions = radarBatchOverallChartObject.options;
						$scope.radarBatchOverallLabels = radarBatchOverallChartObject.labels;
						$scope.radarBatchOverallSeries = radarBatchOverallChartObject.series;
						$scope.radarBatchOverallColors = radarBatchOverallChartObject.colors;
						
						$scope.radarBatchOverallTable = chartsDelegate.utility
						.dataToTable(radarBatchOverallChartObject);
						$log.debug(radarBatchOverallChartObject);
					}
					
					function getAllTrainingTypes() {
						caliberDelegate.all.enumTrainingType().then(
								function(trainingType) {
									$log.debug(trainingType);
									$scope.trainingTypes = trainingType;
								});
					}
					
					// *******************************************************************************
					// *** Chart Generation
					// *******************************************************************************

					function createBatchWeek() {
						NProgress.done();
						NProgress.start();

						createQCStatus();
						createAverageTraineeScoresWeekly();
						createAssessmentAveragesBatchWeekly();
					}

					function createBatchWeekTrainee() {
						NProgress.done();
						NProgress.start();

						createAssessmentAveragesTraineeWeekly();
						createTechnicalSkillsTraineeWeekly();
						createWeeklyProgressTraineeWeekly();
					}

					function createBatchOverall() {
						NProgress.done();
						NProgress.start();

						createAverageTraineeScoresOverall();
						createTechnicalSkillsBatchOverall();
						// TODO
						createAllTraineesAndBatchRadarData();
						createWeeklyProgressBatchOverall();
					}

					function createBatchOverallTrainee() {
						NProgress.done();
						NProgress.start();

						createAssessmentAveragesTraineeOverall();
						createWeeklyProgressTraineeOverall();
						createTechnicalSkillsTraineeOverall();
					}

					// *******************************************************************************
					// *** Doughnut Charts
					// *******************************************************************************

					function createQCStatus() {
						chartsDelegate.doughnut.data
								.getQCStatsData($scope.currentBatch.batchId,
										$scope.reportCurrentWeek)
								.then(
										function(data) {
											NProgress.done();
											var doughnutChartObject = chartsDelegate.doughnut
													.getQCStats(data);
											$scope.qcStatsLabels = doughnutChartObject.labels;
											$scope.qcStatsData = doughnutChartObject.data;
											$scope.qcStatsOptions = doughnutChartObject.options;
											$scope.qcStatsColors = doughnutChartObject.colors;
										});

					}

					// *******************************************************************************
					// *** Bar Charts
					// *******************************************************************************

					function createAverageTraineeScoresWeekly() {
						chartsDelegate.bar.data
								.getAverageTraineeScoresWeeklyData(
										$scope.currentBatch.batchId,
										$scope.reportCurrentWeek)
								.then(
										function(data) {
											NProgress.done();
											var barChartObj = chartsDelegate.bar
													.getAverageTraineeScoresWeekly(data);
											$scope.averageTraineeScoresWeeklyData = barChartObj.data;
											$scope.averageTraineeScoresWeeklyLabels = barChartObj.labels;
											$scope.averageTraineeScoresWeeklySeries = barChartObj.series;
											$scope.averageTraineeScoresWeeklyOptions = barChartObj.options;
											$scope.averageTraineeScoresWeeklyColors = barChartObj.colors;
										}, function() {
											NProgress.done();
										});
					}

					// Hossain bar chart trainee vs average all week score
					function createAverageTraineeScoresOverall() {
						chartsDelegate.bar.data
								.getAverageTraineeScoresOverallData(
										$scope.currentBatch.batchId)
								// confirm if batch or trainee
								.then(
										function(data) {
											NProgress.done();
											var barChartObject = chartsDelegate.bar
													.getAverageTraineeScoresOverall(data);
											$scope.batchOverAllLabels = barChartObject.labels;
											$scope.batchOverAllData = barChartObject.data;
											$scope.batchOverAllOptions = barChartObject.options;
											$scope.batchOverAllColors = barChartObject.colors;
										}, function() {
											NProgress.done();
										});

					}

					// Yanilda barchart
					function createAssessmentAveragesBatchWeekly() {
						chartsDelegate.bar.data
								.getAssessmentAveragesBatchWeeklyData(
										$scope.currentBatch.batchId,
										$scope.reportCurrentWeek)
								.then(
										function(data) {
											NProgress.done();
											var barChartObject = chartsDelegate.bar
													.getAssessmentAveragesBatchWeekly(data);
											$scope.barchartAWLabels = barChartObject.labels;
											$scope.barchartAWData = barChartObject.data;
											$scope.barchartAWOptions = barChartObject.options;
											$scope.barchartAWSeries = barChartObject.series;
											$scope.barchartAWColors = barChartObject.colors;
										}, function() {
											NProgress.done();
										});

					}
		

					function createAssessmentAveragesTraineeWeekly() {
						chartsDelegate.bar.data
								.getAssessmentAveragesTraineeWeeklyData(
										$scope.currentBatch.batchId,
										$scope.reportCurrentWeek,
										$scope.currentTraineeId)
								.then(
										function(data) {
											NProgress.done();
											var barChartObject = chartsDelegate.bar
													.getAssessmentAveragesTraineeWeekly(data);
											$scope.AssessmentAveragesTraineeWeeklyLabels = barChartObject.labels;
											$scope.AssessmentAveragesTraineeWeeklyData = barChartObject.data;
											$scope.AssessmentAveragesTraineeWeeklyOptions = barChartObject.options;
											$scope.AssessmentAveragesTraineeWeeklySeries = barChartObject.series;
											$scope.AssessmentAveragesTraineeWeeklyColors = barChartObject.colors;
										}, function() {
											NProgress.done();
										});

					}

					function createAssessmentAveragesTraineeOverall() {
						chartsDelegate.bar.data
								.getAssessmentAveragesTraineeOverallData(
										$scope.currentBatch.batchId,
										$scope.currentTraineeId)
								.then(
										function(data) {
											NProgress.done();
											var barChartObject = chartsDelegate.bar
													.getAssessmentAveragesTraineeOverall(data);
											$scope.AssessmentAveragesTraineeOverallLabels = barChartObject.labels;
											$scope.AssessmentAveragesTraineeOverallData = barChartObject.data;
											$scope.AssessmentAveragesTraineeOverallOptions = barChartObject.options;
											$scope.AssessmentAveragesTraineeOverallSeries = barChartObject.series;
											$scope.AssessmentAveragesTraineeOverallColors = barChartObject.colors;
										}, function() {
											NProgress.done();
										});

					}

					// *******************************************************************************
					// *** Radar Charts
					// *******************************************************************************
					function createTechnicalSkillsTraineeWeekly() {
						$log.debug("createTechnicalSkillsTraineeWeekly");
						chartsDelegate.radar.data
								.getTraineAndBatchSkillComparisonChart(
										$scope.currentBatch.batchId,
										$scope.reportCurrentWeek,
										$scope.currentTraineeId)
								.then(
										function(data) {
											NProgress.done();
											var radarChartObject = chartsDelegate.radar
													.createFromTwoDataSets(
															data.batch,
															data.trainee,
															$scope.currentBatch.trainingName,
															$scope.currentTrainee.name);

											$scope.radarTraineeWeeklyData = radarChartObject.data;
											$scope.radarTraineeWeeklyOptions = radarChartObject.options;
											$scope.radarTraineeWeeklyLabels = radarChartObject.labels;
											$scope.radarTraineeWeeklySeries = radarChartObject.series;
											$scope.radarTraineeWeeklyColors = radarChartObject.colors;

											$scope.radarTraineeWeeklyTable = chartsDelegate.utility
													.dataToTable(radarChartObject);
										});
					}

					function createTechnicalSkillsTraineeOverall() {
						$log.debug("createTechnicalSkillsTraineeOverall");
						chartsDelegate.radar.data
								.getTraineAndBatchSkillComparisonChart(
										$scope.currentBatch.batchId,
										$scope.reportCurrentWeek,
										$scope.currentTraineeId)
								.then(
										function(data) {
											NProgress.done();
											var radarChartObject = chartsDelegate.radar
													.createFromTwoDataSets(
															data.batch,
															data.trainee,
															$scope.currentBatch.trainingName,
															$scope.currentTrainee.name);

											$scope.radarTraineeOverallData = radarChartObject.data;
											$scope.radarTraineeOverallOptions = radarChartObject.options;
											$scope.radarTraineeOverallLabels = radarChartObject.labels;
											$scope.radarTraineeOverallSeries = radarChartObject.series;
											$scope.radarTraineeOverallColors = radarChartObject.colors;

											$scope.radarTraineeOverallTable = chartsDelegate.utility
													.dataToTable(radarChartObject);
										});
					}
					var mainData = null;
					function createTechnicalSkillsBatchOverall() {
						$log.debug("createTechnicalSkillsBatchOverall");
						chartsDelegate.radar.data
								.getTechnicalSkillsBatchOverallData(
										$scope.currentBatch.batchId)
								// batchId
								.then(
										function(data) {
											NProgress.done();
											mainData = data;
											var radarBatchOverallChartObject = chartsDelegate.radar
													.getTechnicalSkillsBatchOverall(
															data,
															$scope.currentBatch.trainingName);
											$scope.radarBatchOverallData = radarBatchOverallChartObject.data;
											$scope.radarBatchOverallOptions = radarBatchOverallChartObject.options;
											$scope.radarBatchOverallLabels = radarBatchOverallChartObject.labels;
											$scope.radarBatchOverallSeries = radarBatchOverallChartObject.series;
											$scope.radarBatchOverallColors = radarBatchOverallChartObject.colors;

											$scope.radarBatchOverallTable = chartsDelegate.utility
													.dataToTable(radarBatchOverallChartObject);
										});

					}
					
					// *******************************************************************************
					// *** Line Charts
					// *******************************************************************************

					function createWeeklyProgressBatchOverall() {
						chartsDelegate.line.data
								.getWeeklyProgressBatchOverallData(
										$scope.currentBatch.batchId)
								.then(
										function(data) {
											NProgress.done();
											var lineChartObj = chartsDelegate.line
													.getWeeklyProgressBatchOverall(data);
											$scope.weeklyProgressBatchOverallLabels = lineChartObj.labels;
											$scope.weeklyProgressBatchOverallData = lineChartObj.data;
											$scope.weeklyProgressBatchOverallOptions = lineChartObj.options;
											$scope.weeklyProgressBatchOverallColors = lineChartObj.colors;
										}, function() {
											NProgress.done();
										})
					}

					// Yanilda
					function createWeeklyProgressTraineeWeekly() {
						chartsDelegate.line.data
								.getWeeklyProgressTraineeWeeklyData($scope.currentBatch.batchId,
										$scope.reportCurrentWeek,
										$scope.currentTraineeId)
								.then(
										function(data) {
											NProgress.done();
											var lineChartObjectwd = chartsDelegate.line
													.getWeeklyProgressTraineeWeekly(data);
											$scope.linechartTWLabels = lineChartObjectwd.labels;
											$scope.linechartTWData = lineChartObjectwd.data;
											$scope.linechartTWOptions = lineChartObjectwd.options;
											$scope.linechartTWSeries = lineChartObjectwd.series;
											$scope.linechartTWColors = lineChartObjectwd.colors;
										}, function() {
											NProgress.done();
										});

					}

					function createWeeklyProgressTraineeOverall() {
						chartsDelegate.line.data
								.getWeeklyProgressTraineeOverallData(
										$scope.currentBatch.batchId,
										$scope.currentTraineeId)
								.then(
										function(data) {
											NProgress.done();
											var lineChartObject = chartsDelegate.line
													.getWeeklyProgressTraineeOverall(data);
											$scope.batchOverallWeeklyLabels = lineChartObject.labels;
											$scope.batchOverallWeeklyData = lineChartObject.data;
											$scope.batchOverallWeeklySeries = lineChartObject.series;
											$scope.batchOverallWeeklyOptions = lineChartObject.options;
											$scope.batchOverallWeeklyColors = lineChartObject.colors;
										}, function() {
											NProgress.done();
										});

					}

					// *******************************************************************************
					// *** PDF Generation
					// *******************************************************************************
					/**
					 * Generates a PDF by sending HTML to server. Downloads
					 * automatically in new tab.
					 */
					$scope.generatePDF = function() {
						// indicate to user the PDF is processing
						$scope.reticulatingSplines = true;

						// get html element #caliber-container
						var caliber = document
								.getElementById("caliber-container");
						// create deep copy to manipulate for POST request body
						var clone = document
								.getElementById("caliber-container").cloneNode(
										true);
						$log.debug(caliber);

						// iterate over all childrens to convert <canvas> to
						// <img src=base64>
						var html = $scope.generateImgFromCanvas(caliber, clone).innerHTML;

						var title;
						// generate the title
						if ($scope.reportCurrentWeek !== OVERALL)
							title = "Week " + $scope.currentWeek
									+ " Progress for "
									+ $scope.currentBatch.trainingName;
						else if ($scope.currentTraineeId !== ALL)
							title = "Progress for "
									+ $scope.currentTrainee.name;
						else
							title = "Performance at a Glance";

						// send to server and download generated PDF
						caliberDelegate.all.generatePDF(title, html).then(
								function(pdf) {
									// extract PDF bytes
									var file = new Blob([ pdf ], {
										type : "application/pdf"
									});
									// create temporary 'url' and download
									// automatically
									var fileURL = URL.createObjectURL(file);
									var a = document.createElement("a");
									a.href = fileURL;
									a.target = "_blank";
									a.download = "report.pdf";
									document.body.appendChild(a);
									a.click();
									$scope.reticulatingSplines = false;
								}, function(error) {
									$log.debug(error);
								}, function(value) {
									$log.debug(value);
								});
					}

					/**
					 * Replace canvas (in DOM) with img (in deep copy)
					 */
					$scope.generateImgFromCanvas = function(dom, clone) {
						for (var i = 0; i < dom.childNodes.length; i++) {
							var child = dom.childNodes[i];
							var cloneChild = clone.childNodes[i];
							$scope.generateImgFromCanvas(child, cloneChild);
							if (child.tagName === "CANVAS") {
								// swap canvas for image with base64 src
								var image = new Image();
								image.src = child.toDataURL();
								clone.replaceChild(image, cloneChild);
							}
						}
						return clone;
					};
					
					
					
					
					$scope.selectTraining = function(index){
						
						
					};
					
					$scope.selectSkill = function(index){
						$log.debug("Hello there Y1");
						$log.debug(index);
						$log.debug("Hello there Y2");
						if (index===ALL) {
							$scope.selectedSkill = "Skill";
			
						} else {
							$scope.selectedSkill = $scope.skillstack[index];
							$log.debug($scope.selectedSkill);
							selectView($scope.selectedSkill);
						}
						
					};
					
					function changeDate(){
						
						
					};
					
					
					
					
					// gets the note for that trainne and that week
					$scope.getTraineeNote=function(traineeId,weekId){
						$log.debug("YOU ARE IN YOUR FUNCTION");
						caliberDelegate.trainer.getTraineeNote(traineeId,weekId).then(function(data){
							$log.debug("YOU ARE IN get trainer caliber in controller");
								$scope.note = {};
							if(data){
								$scope.note = data;
							}
						});
						// Michael get QCnote and QCstatus
						caliberDelegate.qc.getQCTraineeNote(traineeId,weekId).then(function(data){
							$log.debug("YOU ARE IN get qc caliber in controller");
								$scope.qcNote = {};
							if(data){
								$scope.qcNote = data;
							}
						});
					}
					
				});


