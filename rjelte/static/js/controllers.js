	'use strict';

	/* Controllers */
	function getSampleData() {
	        return {
	        "data1": [
	            {"id": "dd2e7a97-1622-4521-a807-f29960218785", "description": "Cashier", "order": 3, "tasks": [
	                {"id": "9c17a6c8-ce8c-4426-8693-a0965ff0fe69", "subject": "Morning", "color": "#6495ED", "from":   new Date(2013,9,10,4,0,0),  "to": new Date(2013,9,10,12,0,0)}
	            ]},
	            {"id": "eede0c9a-6777-4b55-9359-1eada309404e", "description": "Drive Through", "order": 4, "tasks": [
	                {"id": "30b8f544-5a45-4357-9a72-dd0181fba49f", "subject": "Afternoon", "color": "#6495ED", "from": new Date(2013,9,10,12,0,0), "to": new Date(2013,9,10,18,0,0)}
	            ]},
	            {"id": "b5318fd9-5d70-4eb1-9c05-65647b9aefe6", "description": "Janetorial", "order": 5, "tasks": [
	                {"id": "d1fdf100-534c-4198-afb9-7bcaef0696f0", "subject": "Evening", "color": "#6495ED", "from":   new Date(2013,9,10,16,0,0),  "to": new Date(2013,9,10,22,0,0)}
	            ]},
	            {"id": "cfb29cd5-1737-4027-9778-bb3058fbed9c", "description": "Cook", "order": 6, "tasks": [
	                {"id": "57638ba3-dfff-476d-ab9a-30fda1e44b50", "subject": "Afternoon", "color": "#6495ED", "from": new Date(2013,9,10,12,0,0), "to": new Date(2013,9,10,18,0,0)}
	            ]}
	        ]};
	}

	function getTrainedSystems() {
		return 
	}


	angular.module('til.controllers', []).
		controller('NavController', function($scope) {
			$scope.navOptions = [
				{ name: "Standard Nav-Bar", slug: "navbar"},
				{ name: "Cloud", slug: "cloud"},
				{ name: "First Person", slug: "fps"},
			];

			$scope.demos = [
				{
					slug: "studio",
					name: "Studio",
					image: "http://placehold.it/100/00FFFF&text=Studio"
				},
				{
					slug: "logic",
					name: "Logic Gate Simulator",
					image: "http://placehold.it/100/7700FF&text=Logic"
				},
				{
					slug: "tiles",
					name: "Tiles",
					image: "http://placehold.it/100/770000&text=Tiles"
				},
				{
					slug: "schedule",
					name: "Schedule",
					image: "http://placehold.it/100/777700&text=Schedule"
				},
				{
					slug: "neural",
					name: "Neural Networks",
					image: "http://placehold.it/100/777700&text=Schedule"
				}
			];
		}).
		controller('MainController', function($scope) {
		}).
		controller('DemosController', function($scope, $log) {
			
		}).
		controller('StudioController', function($scope) {
			
		}).
		controller('LogicController', function($scope) {
			
		}).
		controller('TilesController', function($scope) {

		}).
		controller('NeuralController', function($scope, $log, localStorageService, usSpinnerService) {
			$scope.savable = false;
			$scope.loadingData = false;
			$scope.training = false;
			$scope.finishedTraining = false;
			$scope.loading = false;
			$scope.sets = [];
			$scope.trainingStep = 1;
			$scope.alerts = [];
			$scope.inputs = [];
			$scope.eta = .5;
			$scope.momentum = 0;
			$scope.biasInput = 1;
			$scope.currentSet = {"name": "", "samples": [], "desiredOutput": ""};
			$scope.nIn = 72;

			_.each(localStorageService.keys(), function(key){
				$scope.sets.push(localStorageService.get(key));
			});
			_.each(_.range($scope.nIn), function(num){
				$scope.inputs.push(0.1)
			});
			$scope.removeSet = function(idx){
				localStorageService.remove($scope.sets[idx].name);
				$scope.sets.splice(idx, 1);
			}
			$scope.selectInput = function(id){
				$scope.savable = true;
				$scope.inputs[id] = $scope.inputs[id] == 0.1 ? 1 : 0.1; // Flip sign
			}
			$scope.reset = function(){
				for(var i = 0; i < $scope.inputs.length; i++) {
					$scope.inputs[i] = 0.1;
				}
				$scope.savable = false;
			}
			$scope.newVerify = function(){
				$scope.alerts = [{ type: 'success', msg: "Any unsaved data in your current set will be lost.  Continue?" }];
				$scope.verify = true;
			}
			$scope.newSet = function(){
				$scope.alerts = [];
				$scope.currentSet.samples = [];
				$scope.loadName = "";
				$scope.currentSet.name = "";
				$scope.currentSet.desiredOutput = "";
				$scope.verify = false;
			}
			$scope.save = function(){

				$scope.currentSet.push(angular.copy($scope.inputs));
				$scope.reset();
				$scope.savable = false;
			}

			$scope.saveSamples = function(){
				var exists = false;
				if(!_.isUndefined($scope.currentSet.name)){
					_.each($scope.sets, function(set, index){
						if(set.name == $scope.currentSet.name)
						{
							$scope.alerts = [{ type: 'success', msg: "The Training set \"" + $scope.currentSet.name + "\" has been saved." }];
							$scope.sets[index] = $scope.currentSet;
							exists = true;
						}

					});
					if(!exists)
					{
						$scope.alerts = [{ type: 'success', msg: "The Training set is saved in your browser's storage under the name \"" + $scope.currentSet.name + "\".  Please save the text above to a file for more permanent storage" }];
						$scope.sets.push($scope.currentSet);
					}
					$scope.dumpedData = angular.toJson($scope.currentSet);
					localStorageService.set($scope.currentSet.name, angular.toJson($scope.currentSet));
				}
				$scope.loadName = "";
			}

			$scope.loadThis = function(name){
				var result = localStorageService.get(name);
					if(!_.isUndefined(result) && !_.isNull(result)){
						$scope.currentSet = angular.fromJson(result);
						return true;
					}
					else{
						return false;
					}
			}

			$scope.loadSamples = function(){
				$log.debug("Loading. . .");
				$scope.loadingData = false;
				if(!_.isUndefined($scope.loadName) && $scope.loadName){
					$log.debug("Sup");
					if($scope.loadThis($scope.loadName)) {
						$scope.alerts = [{ type: 'success', msg: 'Samples loaded succesfully.' }];
					}
					else {
						$scope.alerts = [{ type: 'danger', msg: 'Sorry, that Training Set doesn\'t exist yet, or it\'s no longer available in your browser\'s local storage.' }];
					}
				}
				else {
					$scope.loadingData = true;
				}
				$scope.loadName = "";
			}
			$scope.loadTheData = function() {
				$log.debug(_.isUndefined($scope.dataToLoad))
				$log.debug($scope.dataToLoad)
				if(_.isUndefined($scope.dataToLoad) && $scope.dataToLoad){
					$scope.currentSet = angular.fromJson($scope.dataToLoad);
					$scope.loadingData = true;
					$scope.alerts = [{ type: 'success', msg: 'Samples loaded succesfully.' }];
				}
				else {
					$scope.alerts = [{ type: 'danger', msg: 'Unable to load Data.' }];
				}
				$scope.loadingData = false;
				//$scope.dataToLoad = "";
			}

			$scope.closeAlert = function(index) {
			    $scope.alerts.splice(index, 1);
			};

			$scope.numHidden = function(){
				return Math.round(($scope.nIn + $scope.nOut) * 2/3)
			}

			$scope.startTraining = function() {
				$scope.training = true;
				$scope.totalError = 1.0;
				$scope.alerts = [];
				$scope.trainingStep = 1;
				$scope.allSetsSet = false;
				$scope.tSamples = []; // Inputs and outputs handled here
				$scope.epochs = 0;

				$scope.nIn = $scope.sets[0].samples[0].length + 1;
				$scope.nOut = $scope.sets.length;

				$scope.nHidden = $scope.numHidden();
				$scope.tOutputs = []; // This is the generic array of the possible outputs
				_.each(_.range($scope.nOut), function(){
					$scope.tOutputs.push(0);
				});
				$scope.tHidden = []; // A array of size nHidden with all 0s
				_.each(_.range($scope.nHidden), function(){
					$scope.tHidden.push(0);
				});
				$scope.tHidden.push($scope.biasInput);
				$scope.tdeltaK = []; // initialized to 0s
				_.each(_.range($scope.nOut), function(){
					$scope.tdeltaK.push(0);
				});
				$scope.tdeltaWHO = []; // initialized to 0s
				_.each(_.range(($scope.nHidden + 1) * $scope.nOut), function(){
					$scope.tdeltaWHO.push(0);
				});
				// Add Bias
				$scope.tdeltaH = []; // initialized to 0s
				_.each(_.range($scope.nHidden), function(){
					$scope.tdeltaH.push(0);
				});
				$scope.tdeltaWIH = []; // initialized to 0s
				_.each(_.range($scope.nIn * $scope.nHidden), function(){
					$scope.tdeltaWIH.push(0);
				});

				var charOutputs = [];
				_.each($scope.sets, function(set){
					charOutputs.push(set.desiredOutput);
				});
				// Initialize tSets, which is an array including all of our "sets"
				// with the initial values for all of the arrays we'll use.
				var tempSet = []
				_.each($scope.sets, function(set, i){
					tempSet[i] = [];
					// desiredOutputs will be the same for all of this type:
					// give correct output .9 and set the rest to .1
					var outputArray = [];
					_.each(charOutputs, function(output){
						if(output == set.desiredOutput){
							//outputArray.push(.9);
							outputArray.push(.9);
						}
						else {
							//outputArray.push(.1);
							outputArray.push(0.1);
						}
					});
					$scope.ihWeights = $scope.getRandomWeights($scope.nIn * $scope.nHidden);
					// Add one more Biased Weight for each hidden:
					_.each($scope.nHidden, function(){
						var num = Math.floor(Math.random() * (5 - 1)) + 1;
						num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
						num /= 100;
						$scope.ihWeights.push(num);
					})


					$scope.hoWeights = $scope.getRandomWeights($scope.nHidden * $scope.nOut)
					var num = Math.floor(Math.random() * (5 - 1)) + 1;
					num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
					num /= 100;
					$scope.hoWeights.push(num);

					_.each(set.samples, function(sample){
						var ins = sample.slice(0);
						ins.push($scope.biasInput);
						tempSet[i].push({
							inputs: ins,
							hidden: $scope.tHidden.slice(0),
							outputs: $scope.tOutputs.slice(0),
							targets: outputArray.slice(0),
							deltaK: $scope.tdeltaK.slice(0),
							deltaWHO: $scope.tdeltaWHO.slice(0),
							deltaH: $scope.tdeltaH.slice(0),
							deltaWIH: $scope.tdeltaWIH.slice(0),
							prevDeltaWHO: $scope.tdeltaWHO.slice(0),
							prevDeltaWIH: $scope.tdeltaWIH.slice(0),
							error: 1.0
						});
					});
				});
				for(var i = 0; i < $scope.sets.length; i += 1){
					_.each(tempSet, function(t){
						$scope.tSamples.push(t[i]);
					});
				}
				$log.debug("Unit Counts:");
				var sample = $scope.tSamples[0];
				$log.debug("inputs: " + sample.inputs.length);
				$log.debug("hidden: " + sample.hidden.length);
				$log.debug("outputs: " + sample.outputs.length);
				$log.debug("targets: " + sample.targets.length);
				$log.debug("deltaK: " + sample.deltaK.length);
				$log.debug("deltaWHO: " + sample.deltaWHO.length);
				$log.debug("deltaH: " + sample.deltaH.length);
				$log.debug("deltaWIH: " + sample.deltaWIH.length);
			}

			$scope.endTraining = function() {
				$scope.trainingStep = 2;
			}

			$scope.getRandomWeights = function(number) {
				var weightArray = [];
				_.each(_.range(number), function(num){
					var num = Math.floor(Math.random() * (5 - 1)) + 1;
					num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
					num /= 100;
					weightArray.push(num);
				});
				return weightArray;
			}

			$scope.sampleData = {
				"inputs":[1,0.1,1],
				"targets":[0.1,0.9],
				"hidden":[0,0,1],
				"outputs":[0,0],
				"deltaH":[0,0],
				"deltaK":[0,0],
				"deltaWIH":[0,0,0,0,0,0],
				"deltaWHO":[0,0,0,0,0,0]
			}
			$scope.sampleIHWeights = [0.04,-0.04,0.03,0.02,-0.03,-0.01];
			$scope.sampleHOWeights = [-0.01,-0.04,0.03,0.02,0.01,0.03];

			$scope.train = function() {
				//usSpinnerService.spin('trainSpinner');
				//$scope.trainingStep = 2;
				// Build the array of desiredOutputs:

				// REMOVE ME!!!!
				// $scope.ihWeights = $scope.sampleIHWeights;
				// $scope.hoWeights = $scope.sampleHOWeights;
				$scope.maxEpochs = 10;
				while($scope.totalError > 0.1 && $scope.epochs < $scope.maxEpochs){
					var errorForAll = 0;
					//$log.debug("Fixing Hidden and Outputs.")
					_.each([$scope.tSamples[0]], function(sample){
					// _.each([$scope.sampleData], function(sample){
						sample.outputs = $scope.tOutputs.slice(0);
						sample.hidden = $scope.tHidden.slice(0);
						sample.deltaK = $scope.tdeltaK.slice(0);
						sample.deltaWHO = $scope.tdeltaWHO.slice(0);
						sample.deltaH = $scope.tdeltaH.slice(0);
						sample.deltaWIH = $scope.tdeltaWIH.slice(0);
						// sample = $scope.sampleData;
						//$log.debug(sample.targets);
						/*
						$log.debug(angular.toJson({
							"sample": sample,
							"ih": $scope.ihWeights,
							"ho": $scope.hoWeights
						}));
						*/

						/***************************************
						* Feed Forward
						***************************************/
						// Hidden Unit = SUM of (weight * input)
						for(var i = 0; i < $scope.ihWeights.length; i += 1){
							//$log.debug(Math.floor(i / sample.inputs.length));
							//$log.debug("Hidden unit #" + Math.floor(i / sample.inputs.length) + " += " + sample.inputs[i % sample.inputs.length] + " * " + $scope.ihWeights[i] + " (" + (sample.inputs[i % sample.inputs.length] * $scope.ihWeights[i]) + ")");
							sample.hidden[Math.floor(i / sample.inputs.length)] += sample.inputs[i % sample.inputs.length] * $scope.ihWeights[i];
							//$log.debug("   sofar: " + sample.hidden[Math.floor(i / sample.inputs.length)]);
						}
						// Sigmoid each hidden unit
						for(var i = 0; i < sample.hidden.length - 1; i += 1){
							// Sigmoid
							//$log.debug("Hidden " + i + " (before Sigmoid): " + sample.hidden[i]);
							sample.hidden[i] = 1 / (1 + Math.exp(sample.hidden[i] * -1));
							//$log.debug("Hidden " + i + " (after Sigmoid): " + sample.hidden[i]);
						}

						// Output Unit = SUM of (weight * hidden unit)
						for(var i = 0; i < $scope.hoWeights.length; i += 1){
							//$log.debug("Hidden unit #" + Math.floor(i / sample.inputs.length) + " += " + sample.inputs[i % sample.inputs.length] + " * " + $scope.ihWeights[i] + " (" + (sample.inputs[i % sample.inputs.length] * $scope.ihWeights[i]) + ")");
							//$log.debug("Output #" + Math.floor(i / sample.hidden.length) + " += " + sample.hidden[i % sample.hidden.length] * $scope.hoWeights[i])
							sample.outputs[Math.floor(i / sample.hidden.length)] += sample.hidden[i % sample.hidden.length] * $scope.hoWeights[i];
							//$log.debug("   sofar: " + sample.outputs[Math.floor(i / sample.hidden.length)]);
						}
						// Sigmoid each output unit
						for(var i = 0; i < sample.outputs.length; i += 1){
							// Sigmoid
							sample.outputs[i] = 1 / (1 + Math.exp(sample.outputs[i] * -1));
							//$log.debug("Output " + i + " (after sigmoid) " + sample.outputs[i]);
						}
						/***************************************
						* Back Propogation
						***************************************/
						//$log.debug("Calculate deltaK:")
						for(var i = 0; i < sample.deltaK.length; i += 1){
							var out = sample.outputs[i];
							sample.deltaK[i] = out * (1.0 - out) * (sample.targets[i] - out);
							//$log.debug("deltaK[" + i + "] = " + sample.deltaK[i]);
						}
						//$log.debug("Calculate DeltaWHO: (" + sample.deltaWHO.length + " total)");
						for(var i = 0; i < sample.deltaWHO.length; i += 1){
							// Delta W =  ETA  *  Error * current value
							var value = sample.outputs[i % sample.outputs.length];
							var error = sample.deltaK[i % sample.outputs.length];
							//$log.debug($scope.eta * value * error+ " + " + $scope.momentum * sample.prevDeltaWHO) +" = " + $scope.eta * value * error + ($scope.momentum * sample.prevDeltaWHO))
							sample.deltaWHO[i] = $scope.eta * value * error + ($scope.momentum * sample.prevDeltaWHO[i]);
							//$log.debug("Value: " + value);
							//$log.debug("Error: " + error);
							//$log.debug("deltaWHO[" + i + "] = " + sample.deltaWHO[i]);
						}
						//$log.debug("Calculate deltaH:")
						for(var i = 0; i < sample.deltaH.length; i += 1){
							// deltah = o(1 - o) * SUM of (weights * deltaK of output);
							var out = sample.hidden[i];
							//$log.debug("Hidden Value: " + out);
							//$log.debug(i + " ~ " + deltaOut);
							var sum = 0;
							//$log.debug("deltaOut: " + deltaOut);
							//$log.debug("NumWeights: " + $scope.ihWeights.length);
							for(var j = 0; j < sample.deltaK.length; j += 1){
								var dk = sample.deltaK[i];
								//$log.debug("Weight #" + (i * sample.deltaH.length + j) + " and deltaK #" + j + " Add (" + $scope.ihWeights[i * sample.deltaH.length + j] + " * " + sample.deltaK[j] + ") to Hidden #" + i);
								var deltaK = sample.deltaK[Math.floor(j % sample.outputs.length)];
								//$log.debug(j % sample.hidden.length + " - " + deltaOut)
								sum += $scope.ihWeights[i * sample.deltaH.length + j] * sample.deltaK[j];
								//$log.debug("   sofar: " + sum);
							}
							//$log.debug("EndSum: " + sum)
							sample.deltaH[i] = out * (1.0 - out) * sum;
							//$log.debug("deltaH[" + i + "] = " + out + " * (1 - " + out + ") * " + sum + " = " + sample.deltaH[i]);
						}
						//$log.debug("Calculate deltaWIH:")
						for(var i = 0; i < (sample.inputs.length -1) * (sample.hidden.length -1); i += 1){
							// Delta W =  ETA  *  Error * current value
							var value = sample.hidden[i % (sample.hidden.length-1)];
							var error = sample.deltaH[i % (sample.hidden.length-1)];
							sample.deltaWIH[i] = $scope.eta * value * error + $scope.momentum * sample.prevDeltaWIH[i];
							//$log.debug("Hidden #" + i % (sample.hidden.length-1) + " = " + value);
							//$log.debug("DeltaH: #" + i % (sample.hidden.length-1) + " = " + error);
							//$log.debug("deltaWIH[" + i + "] = " + sample.deltaWIH[i]);
						}
						//$log.debug("Making HO Updates: (" + $scope.hoWeights.length + ")")
						//$log.debug("============================================")
						for(var i = 0; i < $scope.hoWeights.length; i += 1){
							var temp = $scope.hoWeights[i];
							$scope.hoWeights[i] += sample.deltaWHO[i];
							//$log.debug(temp + " + " + sample.deltaWHO[Math.floor(i / sample.hidden.length)] + " = " + $scope.hoWeights[i]);
						}
						//$log.debug("Making IH Updates: (" + $scope.ihWeights.length + ")")
						//$log.debug("- - - - -");
						for(var i = 0; i < $scope.ihWeights.length - 1; i += 1){
							var temp = $scope.ihWeights[i];
							$scope.ihWeights[i] += sample.deltaWIH[i];
							//$log.debug(temp + " + " + sample.deltaWIH[Math.floor(i / sample.outputs.length)] + " = " + $scope.ihWeights[i]);
						}

						// Save Delta values for next iteration:
						sample.prevDeltaWHO = sample.deltaWHO.splice(0);
						sample.prevDeltaWIH = sample.deltaWIH.splice(0);

						// $log.debug("===================================================")
						// $log.debug("deltaK: " + sample.deltaK.length);
						// $log.debug("deltaWHO: " + sample.deltaWHO.length);
						// $log.debug("deltaH: " + sample.deltaH.length);
						// $log.debug("deltaWIH: " + sample.deltaWIH.length);
						/*
						$log.debug(angular.toJson({
							"sample": sample.,
							"ih": $scope.ihWeights,
							"ho": $scope.hoWeights
						}));
						*/

						//$log.debug("- - - Error - - -")
						var error = 0;
						for(var i = 0; i < sample.outputs.length; i += 1){
							error += (sample.targets[i] - sample.outputs[i]) * (sample.targets[i] - sample.outputs[i]);
							//$log.debug("#" + i + " Desired: " + sample.targets[i] + ",  Actual: " + sample.outputs[i] + ",  Error: " + error)
						}
						//$log.debug("====================================================");
						errorForAll += error;
						/*
						$log.debug(angular.toJson({
							"sample": sample,
							"ih": $scope.ihWeights,
							"ho": $scope.hoWeights
						}));
						*/
						//$log.debug("Error: " + sample.error)
					});
					$scope.totalError = errorForAll / 2;
					$log.debug('Total Error: ' + $scope.totalError);
					$scope.epochs += 1;
					//$log.debug("Before:");
					//$log.debug(JSON.parse( JSON.stringify( sample )));
				}

				$scope.learnedNetwork = {
					"name": "Pretrained Neural Network",
					"ihWeights": $scope.ihWeights,
					"hoWeights": $scope.hoWeights
				}
				//$scope.dumpedData = angular.toJson($scope.tSamples);
				//$log.debug(angular.toJson($scope.tSamples));
				$scope.endTraining();
				//$log.debug(sample);
			}
			$scope.trainPreSet = function(){
				$scope.startTraining();
				$scope.train();
				if(_.isUndefined($scope.preTrainedSet)){
					$scope.preTrainedSet = getTrainedData();
					$log.debug($scope.preTrainedSet);
				}
			}
			$scope.recognize = function(){
				var outputs = []; // This is the generic array of the possible outputs
				_.each(_.range($scope.nOut), function(){
					outputs.push(0);
				});
				var hidden = []; // A array of size nHidden with all 0s
				_.each(_.range($scope.nHidden), function(){
					hidden.push(0);
				});
				//$log.debug("Pretrained IH Weights:")
				//$log.debug($scope.ihWeights);
				//$log.debug("Pretrained HO Weights:")
				//$log.debug($scope.hoWeights);
				/*
					$scope.tSamples.push({
							inputs: sample,
							outputs: $scope.tOutputs.slice(0),
							hidden: $scope.tHidden.slice(0),
							ihWeights: $scope.getRandomWeights(outputs.length * sample.hidden.length),
							hoWeights: $scope.getRandomWeights(sample.hidden.length * outputs.length),
							targets: outputArray.slice(0),
							deltaK: $scope.tdeltaK.slice(0),
							deltaWHO: $scope.tdeltaWHO.slice(0),
							deltaH: $scope.tdeltaH.slice(0),
							deltaWIH: $scope.tdeltaWIH.slice(0),
							error: 1.0
						});
				*/
				var checkInputs = $scope.inputs.slice(0);
				checkInputs.push($scope.biasInput);
				/***************************************
				* Feed Forward
				***************************************/
				// Hidden Unit = SUM of (weight * input)
				for(var i = 0; i < $scope.ihWeights.length; i += 1){
					//$log.debug("Hidden unit #" + Math.floor(i / checkInputs.length) + " += " + checkInputs[i % checkInputs.length] + " * " + $scope.ihWeights[i] + " (" + (checkInputs[i % checkInputs.length] * $scope.ihWeights[i]) + ")");
					hidden[Math.floor(i / checkInputs.length)] += checkInputs[i % checkInputs.length] * $scope.ihWeights[i];
					//$log.debug("   sofar: " + hidden[Math.floor(i / checkInputs.length)]);
				}
				// Sigmoid each hidden unit
				for(var i = 0; i < hidden.length - 1; i += 1){
					// Sigmoid
					//$log.debug("Hidden " + i + " (before Sigmoid): " + hidden[i]);
					hidden[i] = 1 / (1 + Math.exp(hidden[i] * -1));
					$log.debug("Hidden " + i + " (after Sigmoid): " + hidden[i]);
				}
				$log.debug("HIDDEN LENGTH:")
				$log.debug(hidden.length);
				// Output Unit = SUM of (weight * hidden unit)
				for(var i = 0; i < $scope.hoWeights.length; i += 1){
					//$log.debug("Hidden unit #" + Math.floor(i / checkInputs.length) + " += " + checkInputs[i % checkInputs.length] + " * " + $scope.ihWeights[i] + " (" + (checkInputs[i % checkInputs.length] * $scope.ihWeights[i]) + ")");
					if(i % hidden.length < hidden.length - 1){
						$log.debug("Output #" + Math.floor(i / hidden.length) + ", using Hidden #" + i % hidden.length + " += " + hidden[i % hidden.length] * $scope.hoWeights[i])
						outputs[Math.floor(i / hidden.length)] += hidden[i % hidden.length] * $scope.hoWeights[i];
						$log.debug("   sofar: " + outputs[Math.floor(i / hidden.length)]);
					}
				}
				// Sigmoid each output unit
				for(var i = 0; i < outputs.length; i += 1){
					// Sigmoid
					$log.debug()
					outputs[i] = 1 / (1 + Math.exp(outputs[i] * -1));
					$log.debug("Output " + i + " (after sigmoid) " + outputs[i]);
				}
				var lowestError = 1.0;
				var idx = 0;
				for(var i = 0; i < outputs.length; i += 1){
					$log.debug("Actual: " + outputs[i])
					if(outputs[i] < lowestError){
						idx = i;
						lowestError = outputs[i];
					}
				}
				$log.debug("Lowest: at index " + idx + " = " + $scope.sets[idx].desiredOutput)
			}
		}).
		controller('ScheduleController', function($scope, $log) {
			$scope.employees = [
				{"name": "Bruce Wayne", "color": "#93C47D"},
		        {"name": "Selina Kyle", "color": "#FFC232"},
		        {"name": "Peter Parker", "color": "#F1C2FF"},
				{"name": "Natasha Romanoff", "color": "#5577AA"}
			]

			$scope.workingHours = angular.element(document.querySelector('gantt')).attr("work-hours").replace(/\[|\]/g, '').split(",");
			$scope.width = String(Math.round(100 * 1.0 / $scope.workingHours.length * 100) / 100);
			$log.debug($scope.width);
			angular.element(document.querySelector('gantt')).attr("column-width", "scale === 'hour' && " + $scope.width);
			$log.debug(angular.element(document.querySelector('gantt')).attr("column-width"));
			$scope.mode = "custom";
		    $scope.maxHeight = 0;
		    $scope.showWeekends = true;
		    $scope.showNonWorkHours = true;
		    $scope.scale = "hour";
		    $scope.noEmp = {
		    		name: "Select an Employee to Assign Shifts",
		    		color: "#999999"
		    }
		    $scope.currentEmp = $scope.noEmp;

		    $scope.setEmployee = function (emp) {
		    	$scope.currentEmp = emp;
		    	$log.debug($scope.roles);
		    	$scope.loadData(angular.copy($scope.roles));
		    }

		    $scope.assignEmployee = function() {

		    }

		    $scope.addSamples = function () {
		    	$scope.roles = getSampleData().data1;
		        $scope.loadData($scope.roles);

		    };

		    $scope.removeSomeSamples = function () {
		        $scope.removeData([
		            {"id": "cfb29cd5-1737-4027-9778-bb3058fbed9c"}, // Remove all Kickoff meetings
		            {"id": "2f85dbeb-0845-404e-934e-218bf39750c0", "tasks": [
		                {"id": "f55549b5-e449-4b0c-9f4b-8b33381f7d76"},
		                {"id": "5e997eb3-4311-46b1-a1b4-7e8663ea8b0b"},
		                {"id": "6fdfd775-7b22-42ec-a12c-21a64c9e7a9e"}
		            ]}, // Remove some Milestones
		            {"id": "cfb29cd5-1737-4027-9778-bb3058fbed9c", "tasks": [
		                {"id": "57638ba3-dfff-476d-ab9a-30fda1e44b50"}
		            ]} // Remove order basket from Sprint 2
		        ]);
		    };

		    $scope.removeSamples = function () {
		        $scope.clearData();
		    };

		    $scope.generateUUID = function() {
		    	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    	var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    	return v.toString(16);
				});
		    }

		    $scope.addRole = function(title) {
		    	$log.debug("Hmmmmm.");
		    	$scope.loadData([{
				    id : $scope.generateUUID(),
				    description : title, // Description shown on the left side of each row.
				    tasks : [] // Array containing the row tasks to add.
				}]);
		    }

		    $scope.rowEvent = function(event) {
		        // A row has been added, updated or clicked. Use this event to save back the updated row e.g. after a user re-ordered it.
		        console.log('Row event (by user: ' + event.userTriggered + '): ' + event.date + ' '  + event.row.description + ' (Custom data: ' + event.row.data + ')');
		    };

		    $scope.scrollEvent = function(event) {
		        if (angular.equals(event.direction, "left")) {
		            // Raised if the user scrolled to the left side of the Gantt. Use this event to load more data.
		            console.log('Scroll event: Left');
		        } else if (angular.equals(event.direction, "right")) {
		            // Raised if the user scrolled to the right side of the Gantt. Use this event to load more data.
		            console.log('Scroll event: Right');
		        }
		    };

		    $scope.taskEvent = function(event) {
		        // A task has been updated or clicked.
		        if($scope.currentEmp != $scope.noEmp){
			        console.log(event);
			        event.task.color = $scope.currentEmp.color;
			        event.task.subject = $scope.currentEmp.name;
			    }
			    $scope.currentEmp = $scope.noEmp;
		    };

		});

	var underscore = angular.module('underscore', []);
	underscore.factory('_', function() {
	  return window._; // assumes underscore has already been loaded on the page
	});

	'use strict';