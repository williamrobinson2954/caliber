angular
		.module("reportApi")
		.factory(
				"barChartDataFactory",
				function($http, $log) {
					$log.debug("Booted Report Factory");

					var report = {};

					/**
					 * Yanilda
					 */
					report.getBatchWeekAvgBarChart = function(batchId, week) {
						return $http(
								{
									url : "/all/reports/batch/" + batchId
											+ "/week/" + week
											+ "/bar-batch-week-avg",
									method : "GET"
								})
								.then(
										function(response) {
											$log
													.debug("Agg - Batch - batchId, Week -- success");
											$log.debug(response);
											return response.data;
										},
										function(response) {
											$log.error("There was an error: "
													+ response.status);
										});
					};

					report.batchWeekTraineeAssessBar = function(batchId,
							weekNum, traineeId) {
						return $http(
								{
									url : "all/reports/batch/" + batchId
											+ "/week/" + weekNum + "/trainee/"
											+ traineeId
											+ "/bar-batch-week-trainee",
									method : "GET"
								})
								.then(
										function(response) {
											$log
													.debug("Reports - batchWeekTraineeAssessBar -- success");
											$log.debug(response);
											return response.data;
										},
										function(response) {
											$log.error("There was an error: "
													+ response.status);
										});
					};

					report.batchOverallTraineeAssessBar = function(batchId,
							traineeId) {
						return $http(
								{
									url : "all/reports/batch/" + batchId
											+ "/overall/trainee/" + traineeId
											+ "/bar-batch-overall-trainee",
									method : "GET"
								})
								.then(
										function(response) {
											$log
													.debug("Reports - batchWeekTraineeAssessBar -- success");
											$log.debug(response);
											return response.data;
										},
										function(response) {
											$log.error("There was an error: "
													+ response.status);
										});
					};

					report.getBarChartBatchWeekAvg = function(batchId, week) {
						return $http(
								{
									url : "/all/reports/batch/" + batchId
											+ "/week/" + week + "/bar",
									method : "GET"
								})
								.then(
										function(response) {
											$log
													.debug("Batch - Week - batch avg Bar Chart");
											$log.debug(response);
											return response.data;
										},
										function(response) {
											$log.error("There was an error: "
													+ response.status);
										}); // end then
					};

					report.getBatchOverallBarChart = function(batchId) {
						return $http(
								{
									url : "/all/reports/batch/" + batchId
											+ "/overall/bar-batch-overall",
									method : "GET"
								}).then(
								function(response) {
									$log.debug("batch - overall");
									$log.debug(response);
									return response.data;

								},
								function(response) {
									$log.error("There was an error: "
											+ response.status);

								});
					};
					 return report;

					
					return report;
					
				})