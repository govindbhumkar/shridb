/* jshint esversion : 8 */
var fs = require('fs-extra');
var path = require('path');
var _ = require('lodash');

function Shridb(name) {
	if(_.isString(name)) {
		this.name = name;
		this.createFolder(this.name);
	} else if(typeof name === 'undefined') {
		this.name = 'Shridb';
		this.createFolder(this.name);
	} else {
		console.log('Not a valid database name');
	}
}

Shridb.prototype.createFolder = function(name) {
	fs.ensureDir(name).then(() => {
	}).catch(err => {
	  console.error(err);
	});
};

Shridb.prototype.getTable = function(tableName) {
  let dbName = this.name;
  if(tableName && typeof tableName === 'string') {
  	let pathName = path.join(dbName, tableName + '.json');
  	return new Promise((resolve, reject) => {
  		resolve(pathName);
  	}).then(pathName => {
		return new Promise((resolve, reject) => {
			fs.pathExists(pathName).then(exists => {
				if(!exists) {
					fs.ensureFile(pathName).then(() => {
			  			 fs.writeJson(pathName, [], err => {
			  			 	if (err) throw err;
			  			 	fs.readJson(pathName, (er, data) => {
			  			 		if (er) {
			  			 			reject(er);
			  			 		} else {
			  			 			resolve(data);
			  			 		}
			  			 	});
			  			 });
					}).catch(e => console.error(e));
				} else {
					fs.readJson(pathName, (err, data) => {
						if (err) {
							reject(err);
						} else {
							resolve(data);
						}
					});
				}
			});
		});
  	});
  } else {
  	console.error('table name should be valid string');
  	return;
  }
};

Shridb.prototype.saveTable = function(tableName, data) {
		let dbName = this.name;
		let pathName = null;

		if (this.checkType(tableName) === 'string' && tableName.length > 0) {
			pathName = path.join(dbName, tableName + '.json');
		} else if(this.checkType(tableName) === 'array') {
			pathName = tableName;
		} else if(this.checkType(tableName) === 'object') {
			pathName = tableName;
		}

		return new Promise((resolve, reject) => {
			resolve(pathName);
		}).then(pathName => {
			if(this.checkType(pathName) === 'string' && pathName.length > 0) {
				fs.pathExists(pathName, (err, exists) => {
					if (err) throw err;
					return new Promise((resolve, reject) => {
						if(exists) {
							resolve(data);
						} else {
							reject(tableName + ' does not exists');
						}
					}).then(dataToSave => {
						if(typeof dataToSave !== 'undefined') {
				  			fs.writeJson(pathName, dataToSave, (err) => {
				  				if (err) throw err;
				  				console.log(tableName + ' has been saved');
				  			});
				  		} else {
				  			console.error('Please, check if provided data is valid');
				  		}
					});
				});
			}
		}).catch(e => console.log(e));
};

Shridb.prototype.getMax = function(obj, prop) {
	let dbName = this.name;
	let pathName = null;

	if(this.checkType(obj) === 'string') { 
		pathName = path.join(dbName, obj + '.json');
	} else if(this.checkType(obj) === 'array') { 
		pathName = obj;
	} else if(this.checkType(obj) === 'object') {
		pathName = obj;
	}

	return new Promise((resolve, reject) => {
		resolve(pathName);
	}).then(gotPath => {
		return new Promise((resolve, reject) => {
			if(typeof prop !== 'undefined') {
				if(this.checkType(gotPath) === 'string') {
					fs.readJson(gotPath, (err, gotData) => {
						if(!_.isEmpty(gotData)) {
							let max = Number(_.maxBy(gotData, o => o[prop], Number)[prop]);
							resolve(max);
						} else {
							resolve(0);
						}
					});
				} else if(this.checkType(gotPath) === 'array') {
					if(!_.isEmpty(gotPath)) {
						let max = Number(_.maxBy(gotPath, o => o[prop], Number)[prop]);
						resolve(max);
					} else {
						resolve(0);
					}
				}
			} else if(typeof prop === 'undefined') {
				if(!_.isEmpty(gotPath)) {
					let max = Number(_.max(gotPath));
					resolve(max);
				} else {
					resolve(0);
				}
			} else {
				resolve('error while executing getMax function');
			}
		});
	});
};

Shridb.prototype.getMin = function(obj, prop) {
	let dbName = this.name;
	let pathName = null;

	if(this.checkType(obj) === 'string') { 
		pathName = path.join(dbName, obj + '.json');
	} else if(this.checkType(obj) === 'array') { 
		pathName = obj;
	} else if(this.checkType(obj) === 'object') {
		pathName = obj;
	}

	return new Promise((resolve, reject) => {
		resolve(pathName);
	}).then(gotPath => {
		return new Promise((resolve, reject) => {
			if(typeof prop !== 'undefined') {
				if(this.checkType(gotPath) === 'string') {
					fs.readJson(gotPath, (err, gotData) => {
						if(!_.isEmpty(gotData)) {
							let min = Number(_.minBy(gotData, o => o[prop], Number)[prop]);
							resolve(min);
						} else {
							resolve(0);
						}
					});
				} else if(this.checkType(gotPath) === 'array') {
					if(!_.isEmpty(gotPath)) {
						let min = Number(_.minBy(gotPath, o => o[prop], Number)[prop]);
						resolve(min);
					} else {
						resolve(0);
					}
				}
			} else if(typeof prop === 'undefined') {
				if(!_.isEmpty(gotPath)) {
					let min = Number(_.min(gotPath));
					resolve(min);
				} else {
					resolve(0);
				}
			} else {
				resolve('error while executing getMin function');
			}
		});
	});
};

Shridb.prototype.updateOne = function(tableName, oldObj, newObj) {
	let dbName = this.name;
	let pathName = null;

	if (this.checkType(tableName) === 'string' && tableName.length > 0) {
		pathName = path.join(dbName, tableName + '.json');
	} else if(this.checkType(tableName) === 'array') {
		pathName = tableName;
	} else if(this.checkType(tableName) === 'object') {
		pathName = tableName;
	}

	return new Promise((resolve, reject) => {
		resolve(pathName);
	}).then(pathName => {
		return new Promise((resolve, reject) => {
			if(this.checkType(pathName) === 'string' && pathName.length > 0) {
				fs.readJson(pathName, (err, data) => {
					if(err) throw err;
					let index = _.findIndex(data, oldObj);
					return new Promise((res) => {
						res(index);
					}).then(foundId => {
						if(foundId !== -1) {
							resolve(_.assign(data[foundId], newObj));
						} else {
							console.log('couldn\'t find match or object already exists');
						}
					}).then(() => {
						fs.writeJson(pathName, data, er => {
							if (er) throw er;
							console.log(tableName + ' updated successfully');
						});
					}).catch(e => console.log(e));
				});
			} 
			else if(this.checkType(pathName) === 'array') { 
				let index = _.findIndex(pathName, oldObj);
				return new Promise((res) => {
					res(index);
				}).then(foundId => {
					if(foundId !== -1) {
						_.assign(pathName[foundId], newObj);
						resolve(pathName);
					} else {
						reject('couldn\'t find match or object already exists');
					}
				}).catch(e => console.log(e));
			} else if(this.checkType(pathName) === 'object') {
				reject('updateOne function works only with array, received type: \'object\'');
			} else {
				console.log('Error while executing updateOne function');
			}
		}).catch(e => console.log(e));
	}).catch(e => console.log(e));
};

Shridb.prototype.updateAll = function(tableName, oldObj, newObj) {
	let dbName = this.name;
		let pathName = null;

		if (this.checkType(tableName) === 'string' && tableName.length > 0) {
			pathName = path.join(dbName, tableName + '.json');
		} else if(this.checkType(tableName) === 'array') {
			pathName = tableName;
		} else if(this.checkType(tableName) === 'object') {
			pathName = tableName;
		}

	return new Promise((resolve, reject) => {
		resolve(pathName);
	}).then(pathName => {
		return new Promise((resolve, reject) => {
			if(this.checkType(pathName) === 'string' && pathName.length > 0) {
				this.fetchJson(pathName).then(data => {
					return new Promise((res, rej) => {
						res(_.filter(data, oldObj));
					}).then(filterData => {
						return new Promise((res, rej) => {
							if(!_.isEmpty(filterData)) {
								for (let i = 0; i < data.length; i++) {
									for (let j = 0; j < filterData.length; j++) {
										if(_.isEqual(data[i], filterData[j])) {
											_.assign(data[i], newObj);
										}
									}
								}
								res(data);
							} else {
								console.log('couldn\'t find match or object already exists');
							}
						}).then(updatedData => {
							fs.writeJson(pathName, updatedData, err => {
								if (err) throw err;
								console.log(tableName + ' updated successfully');
								resolve(updatedData);
							});
						}).catch(e => console.log(e));
					}).catch(e => console.log(e));
				}).catch(e => console.log(e));
			} else if(this.checkType(pathName) === 'array') {
				return new Promise((res, rej) => {
					res(_.filter(pathName, oldObj));
				}).then(filterData => {
					return new Promise((res, rej) => {
						if(!_.isEmpty(filterData)) {
							for (let i = 0; i < pathName.length; i++) {
								for (let j = 0; j < filterData.length; j++) {
									if(_.isEqual(pathName[i], filterData[j])) {
										_.assign(pathName[i], newObj);
									}
								}
							}
							res(pathName);
							resolve(pathName);
						} else {
							console.log('couldn\'t find match or object already exists');
						}
					}).catch(e => console.log(e));
				}).catch(e => console.log(e));
			} else if(this.checkType(pathName) === 'object') {
				reject('updateAll function works only with array, received type: \'object\'');
			}  else {
				reject('Error while executing updateAll function');
			}
		}).catch(e => console.log(e));
	}).catch(e => console.log(e));
};


Shridb.prototype.findAll = function(tableName, obj) {
	let dbName = this.name;
	let pathName = null;

	if (this.checkType(tableName) === 'string' && tableName.length > 0) {
		pathName = path.join(dbName, tableName + '.json');
	} else if(this.checkType(tableName) === 'array') {
		pathName = tableName;
	} else if(this.checkType(tableName) === 'object') {
		pathName = tableName;
	}

	return new Promise((resolve, reject) => {
		resolve(pathName);
	}).then(pathName => {
		return new Promise((resolve, reject) => {
			if(this.checkType(pathName) === 'string' && pathName.length > 0) {
				fs.pathExists(pathName, (err, exists) => {
					if (err) throw err;	
					if(exists) {
						fs.readJson(pathName, (err, data) => {
							if (err) reject(err);
							resolve(_.filter(data, obj));
						});
					} else {
						setTimeout(function () {
							fs.readJson(pathName, (err, data) => {
								if (err) reject(err);
								resolve(_.filter(data, obj));
							});
						}, this.utils.databaseInitTimeout);
					}
				});
			} else if(this.checkType(pathName) === 'array') {
				resolve(_.filter(pathName, obj));
			} else if(this.checkType(pathName) === 'object') {
				resolve(_.findKey(pathName, obj));
			}  else {
				reject('Error while executing findAll function');
			}
		}).catch(e => console.log(e));
	}).catch(e => console.log(e));
};

Shridb.prototype.findOne = function(tableName, obj) {
	let dbName = this.name;
	let pathName = null;

	if(!_.isEmpty(tableName) && this.checkType(tableName) === 'string') { 
		pathName = path.join(dbName, tableName + '.json');
	} else if(this.checkType(tableName) === 'array') { 
		pathName = tableName;
	} else if(this.checkType(tableName) === 'object') { 
		pathName = tableName;
	} else if(tableName === undefined) { 
		console.log('invalid object to find');
		return;
	}

	return new Promise((resolve, reject) => {
		if(this.checkType(pathName) === 'string' && pathName.length > 0) { 
			fs.pathExists(pathName).then(exists => {
				if (exists) {
					fs.readJson(pathName, (err, data) => {
						if (err) reject(err);
						resolve(_.find(data, obj));
					});
				} else {
					setTimeout(function () {
						fs.readJson(pathName, (err, data) => {
							if (err) reject(err);
							resolve(_.find(data, obj));
						});
					}, this.utils.databaseInitTimeout);
				}
			}).catch(e => reject(e));
		} else if(this.checkType(pathName) === 'array') { 
			resolve(_.find(pathName, obj));
		} else if(this.checkType(tableName) === 'object') { 
			resolve(_.findKey(pathName, obj));
		} else {
			reject('Error while executing findOne function');
		}
	}).catch(e => console.log(e));
};

Shridb.prototype.findLast = function(tableName, obj) {
	let dbName = this.name;
	let pathName = null;

	if(!_.isEmpty(tableName) && this.checkType(tableName) === 'string') { 
		pathName = path.join(dbName, tableName + '.json');
	} else if(this.checkType(tableName) === 'array') { 
		pathName = tableName;
	} else if(this.checkType(tableName) === 'object') { 
		pathName = tableName;
	} else if(tableName === undefined) { 
		console.log('invalid object to find');
		return;
	}

	return new Promise((resolve, reject) => {
		if(this.checkType(pathName) === 'string' && pathName.length > 0) { 
			fs.pathExists(pathName).then(exists => {
				if (exists) {
					fs.readJson(pathName, (err, data) => {
						if (err) reject(err);
						resolve(_.findLast(data, obj));
					});
				} else {
					setTimeout(function () {
						fs.readJson(pathName, (err, data) => {
							if (err) reject(err);
							resolve(_.findLast(data, obj));
						});
					}, this.utils.databaseInitTimeout);
				}
			}).catch(e => reject(e));
		} else if(this.checkType(pathName) === 'array') { 
			resolve(_.findLast(pathName, obj));
		} else if(this.checkType(tableName) === 'object') { 
			reject('findLast function works only with array, received type: \'object\'');
		} else {
			reject('Error while executing findLast function');
		}
	}).catch(e => console.log(e));
};

Shridb.prototype.findIndex = function(tableName, obj) {
	let dbName = this.name;
	let pathName = null;

	if(!_.isEmpty(tableName) && this.checkType(tableName) === 'string') { 
		pathName = path.join(dbName, tableName + '.json');
	} else if(this.checkType(tableName) === 'array') { 
		pathName = tableName;
	} else if(this.checkType(tableName) === 'object') { 
		pathName = tableName;
	} else if(tableName === undefined) { 
		console.log('invalid object to find');
		return;
	}

	return new Promise((resolve, reject) => {
		resolve(pathName);
	}).then(pathName => {
		return new Promise((resolve, reject) => {
			if(this.checkType(pathName) === 'string' &&  pathName.length > 0) {
				fs.pathExists(pathName, (error, exists) => {
					if (error) throw error;
					if(exists) {
						this.fetchJson(pathName).then(data => {
							 if(this.checkType(data) === 'array') {
							 	 resolve(_.findIndex(data, obj));
							 }
						}).catch(e => reject(e));
					} else {
						setTimeout(function () {
							fs.readJson(pathName, (er, data) => {
								if (er) reject(er);
								if(_.isArray(data)) {
									resolve(_.findIndex(data, obj));
								}
							});
						}, this.utils.databaseInitTimeout);
					}
				});
			} else if(this.checkType(tableName) === 'array') {
				resolve(_.findIndex(tableName, obj));
			} else if(this.checkType(tableName) === 'object') {
				reject('findIndex function works only with array, received type: \'object\'');
			}
		}).catch(e => console.log(e));
	}).catch(e => console.log(e));
};

Shridb.prototype.findLastIndex = function(tableName, obj) {
	let dbName = this.name;
	let pathName = null;

	if(!_.isEmpty(tableName) && this.checkType(tableName) === 'string') { 
		pathName = path.join(dbName, tableName + '.json');
	} else if(this.checkType(tableName) === 'array') { 
		pathName = tableName;
	} else if(this.checkType(tableName) === 'object') { 
		pathName = tableName;
	} else if(tableName === undefined) { 
		console.log('invalid object to find');
		return;
	}

	return new Promise((resolve, reject) => {
		resolve(pathName);
	}).then(pathName => {
		return new Promise((resolve, reject) => {
			if(this.checkType(pathName) === 'string' &&  pathName.length > 0) {
				fs.pathExists(pathName, (error, exists) => {
					if (error) throw error;
					if(exists) {
						this.fetchJson(pathName).then(data => {
							 if(this.checkType(data) === 'array') {
							 	 resolve(_.findLastIndex(data, obj));
							 }
						}).catch(e => reject(e));
					} else {
						setTimeout(function () {
							fs.readJson(pathName, (er, data) => {
								if (er) reject(er);
								if(_.isArray(data)) {
									resolve(_.findLastIndex(data, obj));
								}
							});
						}, this.utils.databaseInitTimeout);
					}
				});
			} else if(this.checkType(tableName) === 'array') {
				resolve(_.findLastIndex(tableName, obj));
			} else if(this.checkType(tableName) === 'object') {
				reject('findLastIndex function works only with array, received type: \'object\'');
			}
		}).catch(e => console.log(e));
	}).catch(e => console.log(e));
};

Shridb.prototype.removeOne = function(tableName, obj) {
	let dbName = this.name;
	let pathName = null;

	if (this.checkType(tableName) === 'string' && tableName.length > 0) {
		pathName = path.join(dbName, tableName + '.json');
	} else if(this.checkType(tableName) === 'array') {
		pathName = tableName;
	} else if(this.checkType(tableName) === 'object') {
		pathName = tableName;
	}

	return new Promise((resolve, reject) => {
		resolve(pathName);
	}).then(pathName => {
		return new Promise((resolve, reject) => {
			if(this.checkType(pathName) === 'string' && pathName.length > 0) {
				fs.pathExists(pathName, (err, exists) => {
					if (err) throw err;
					if (exists) {
						fs.readJson(pathName, (err, data) => {
							if(err) throw err;
							let index = _.findIndex(data, obj);
							return new Promise((res, rej) => {
								res(index);
							}).then(foundId => {
								if(foundId !== -1) {
									resolve(data[foundId]);
									data.splice(foundId, 1);
									return new Promise((res, rej) => {
										res(data);
									}).then(data => {
										fs.writeJson(pathName, data, err => {
											if (err) reject(err);
											console.log('One object removed successfully');
										});
									}).catch(e => console.log(e));
								} else {
									console.log('couldn\'t find match or object is empty');
								}
							}).catch(e => console.log(e));
						});
					} else {
						setTimeout(function () {
							fs.readJson(pathName, (err, data) => {
								if(err) throw err;
								let index = _.findIndex(data, obj);
								return new Promise((res, rej) => {
									res(index);
								}).then(foundId => {
									if(foundId !== -1) {
										data.splice(foundId, 1);
										return new Promise((res, rej) => {
											res(data);
										}).then(data => {
											fs.writeJson(pathName, data, err => {
												if (err) reject(err);
												console.log('One object removed successfully');
											});
										}).catch(e => console.log(e));
									} else {
										console.log('couldn\'t find match or object is empty');
										return;
									}
								}).catch(e => console.log(e));
							});
						}, this.utils.databaseInitTimeout);
					}
				});
			} else if(this.checkType(tableName) === 'array' && !_.isEmpty(tableName)) {
				let index = _.findIndex(tableName, obj);
				return new Promise((res, rej) => {
					res(index);
				}).then(foundId => {
					if(foundId !== -1) {
						tableName.splice(foundId, 1);
					} else {
						reject('couldn\'t find match or object is empty');
					}
					resolve(tableName);
				}).catch(e => console.log(e));
			} else if(this.checkType(tableName) === 'object') {
				reject('removeOne function works only with array, received type: \'object\'');
			}
		}).catch(e => console.log(e));
	}).catch(e => console.log(e));
};


Shridb.prototype.removeAll = function(tableName, obj) {
	let dbName = this.name;
	let pathName = null;

	if (this.checkType(tableName) === 'string' && tableName.length > 0) {
		pathName = path.join(dbName, tableName + '.json');
	} else if(this.checkType(tableName) === 'array') {
		pathName = tableName;
	} else if(this.checkType(tableName) === 'object') {
		pathName = tableName;
	}

	return new Promise((resolve, reject) => {
		resolve(pathName);
	}).then(pathName => {
		return new Promise((resolve, reject) => {
		if(this.checkType(pathName) === 'string' && pathName.length > 0) {
				fs.pathExists(pathName, (err, exists) => {
					if (err) throw err;
					if(exists) {
						fs.readJson(pathName, (err, data) => {
							if (err) throw err;
							return new Promise((res, rej) => {
								res(_.filter(data, obj));
							}).then(filterData => {
								if(!_.isEmpty(filterData)) {
									for (let i = 0; i < data.length; i++) {
										for (let j = 0; j < filterData.length; j++) {
											if(_.isEqual(data[i], filterData[j])) {
												data.splice(i, 1);
											}
										}
									}
									resolve(data);
								} else {
									console.log('couldn\'t find match or object is empty');
								}
							}).then(data => {
								fs.writeJson(pathName, data, err => {
									if (err) reject(err);
									console.log('data removed successfully');
								});
							}).catch(e => console.log(e));
						});
					} else {
						setTimeout(function () {
							fs.readJson(pathName, (err, data) => {
								if (err) throw err;
								return new Promise((res, rej) => {
									res(_.filter(data, obj));
								}).then(filterData => {
									if(!_.isEmpty(filterData)) {
										for (let i = 0; i < data.length; i++) {
											for (let j = 0; j < filterData.length; j++) {
												if(_.isEqual(data[i], filterData[j])) {
													data.splice(i, 1);
												}
											}
										}
										resolve(data);
									} else {
										console.log('couldn\'t find match or object is empty');
									}
								}).then(data => {
									fs.writeJson(pathName, data, err => {
										if (err) reject(err);
										console.log('data removed successfully');
									});
								}).catch(e => console.log(e));
							});
						}, this.utils.databaseInitTimeout);
					}
				});
			} else if(this.checkType(pathName) === 'array' && !_.isEmpty(pathName)) {
				return new Promise((res, rej) => {
					res(_.filter(pathName, obj));
				}).then(filterData => {
					if(!_.isEmpty(filterData)) {
						for (let i = 0; i < pathName.length; i++) {
							for (let j = 0; j < filterData.length; j++) {
								if(_.isEqual(pathName[i], filterData[j])) {
									pathName.splice(i, 1);
								}
							}
						}
						resolve(pathName);
					} else {
						console.log('couldn\'t find match or object is empty');
					}
				});
			} else if(this.checkType(pathName) === 'object') {
				reject('removeAll function works only with array, received type: \'object\'');
			}
		});
	});
};

Shridb.prototype.map = function(tableName, prop) {
	let dbName = this.name;
	let pathName = null;

	if (this.checkType(tableName) === 'string' && tableName.length > 0) {
		pathName = path.join(dbName, tableName + '.json');
	} else if(this.checkType(tableName) === 'array') {
		pathName = tableName;
	} else if(this.checkType(tableName) === 'object') {
		pathName = tableName;
	}

	return new Promise((resolve, reject) => {
		if (this.checkType(pathName) === 'string' && pathName.length > 0) {
			fs.pathExists(pathName, (err, exists) => {
				if(err) throw err;
				if(exists) {
					fs.readJson(pathName, (er, data) => {
						if (er) throw er;
							if(!_.isEmpty(data)) {
								resolve(_.map(data, prop));
							} else {
								reject('data not found or table is empty');
							}
					});
				} else {
					setTimeout(function () {
						fs.readJson(pathName, (er, data) => {
							if (er) throw er;
								if(!_.isEmpty(data)) {
									resolve(_.map(data, prop));
								} else {
									reject('data not found or table is empty');
								}
						});
					}, this.utils.databaseInitTimeout);
				}
			});
		} else if (this.checkType(pathName) === 'array' && !_.isEmpty(pathName)) {
			if(!_.isEmpty(pathName)) {
				resolve(_.map(pathName, prop));
			} else {
				reject('Empty data or table is empty');
			}
		} else if(this.checkType(pathName) === 'object') {
				reject('map function works only with array, received type: \'object\'');
		}
		 else {
			reject('Error while executing map function: Please check provided arguement is valid object');
		}
	}).catch(e => console.log(e));
};

Shridb.prototype.removeTable = function(tableName) {
	let dbName = this.name;
	let pathName = path.join(dbName, tableName + '.json');

	return new Promise((resolve, reject) => {
		fs.pathExists(pathName).then(exists => {
			if(exists) {
				fs.remove(pathName, err => {
				  if (err) return reject(err);
				  resolve(`'${tableName}' table removed from database`);
				});
			} else {
				setTimeout(function () {
					fs.remove(pathName, err => {
					  if (err) return reject(err);
					  resolve(`'${tableName}' table removed from database`);
					});
				}, this.utils.databaseInitTimeout);
			}
		}).catch(e => console.log(e));
	});
};

Shridb.prototype.cleanTable = function(tableName) {
	let dbName = this.name;
	let pathName = null;

	if (this.checkType(tableName) === 'string' && tableName.length > 0) {
		pathName = path.join(dbName, tableName + '.json');
	} else if(this.checkType(tableName) === 'array') {
		pathName = tableName;
	} else if(this.checkType(tableName) === 'object') {
		pathName = tableName;
	}

	return new Promise((resolve, reject) => {
		resolve(pathName);
	}).then(gotPath => {
		return new Promise((resolve, reject) => {
			if(this.checkType(pathName) === 'string' && pathName.length > 0) {
				fs.pathExists(pathName, (error, exists) => {
					if (error) throw error;
					if (exists) {
						fs.readJson(pathName, (error, data) => {
							if (error) throw error;
							if(this.checkType(data) === 'array') {
								fs.writeJson(pathName, [], err => {
								  if (err) return console.error(err);
								  resolve([]);
								});
							} else if(this.checkType(data) === 'object') {
								fs.writeJson(pathName, {}, err => {
								  if (err) return console.error(err);
								  resolve({});
								});
							}
						});
					} else {
						reject(pathName + ' not  exists');
					}
				});
			} else if(this.checkType(pathName) === 'array') {
				pathName = [];
				resolve(pathName);
			} else if(this.checkType(pathName) === 'object') {
				pathName = {};
				resolve(pathName);
			} else {
				reject('Error while executing cleanTable function');
			}
		});
	});
};

Shridb.prototype.fetchJson = function(filePath) {
	if (this.checkType(filePath) === 'string' && filePath.length > 0) {
		return new Promise((resolve, reject) => {
			fs.pathExists(filePath, (error, exists) => {
				if (error) throw error;
				if (exists) {
					fs.readJson(filePath, (err, data) => {
						if (err) throw err;
						resolve(data);
					});
				} else {
					reject(filePath + ' not exists');
				}
			});
		});
	}
};

Shridb.prototype.checkType = function(obj) {
	if(_.isObject(obj)) {
	    if(!_.isArray(obj)) {
	      return 'object';
	    } else if(_.isArray(obj)) {
	      return 'array';
	    }
	  } else if(_.isString(obj)) {
	    return 'string';
	  } else if(typeof obj === 'undefined' || _.isUndefined(obj)) {
	  	return undefined;
	  } else if(_.isNumber(obj)) {
	  	return 'number';
	  } else if(_.isBoolean(obj)) {
	  	return 'boolean';
	  }
};

Shridb.prototype.doSum = function(tableName, prop) {
	let dbName = this.name;
	let pathName = null;

	if (this.checkType(tableName) === 'string' && tableName.length > 0) {
		pathName = path.join(dbName, tableName + '.json');
	} else if(this.checkType(tableName) === 'array') {
		pathName = tableName;
	} else if(this.checkType(tableName) === 'object') {
		pathName = tableName;
	}

	return new Promise((resolve, reject) => {
		if(this.checkType(pathName) === 'string') {
			if(this.checkType(prop) === 'string' && prop.length > 0) {
				fs.pathExists(pathName).then(exists => {
					if (exists) {
						fs.readJson(pathName, (err, data) => {
							if (err) throw(err);
							resolve(_.sumBy(data, o => Number(o[prop])));
						});
					} else {
						setTimeout(function () {
							fs.readJson(pathName, (err, data) => {
								if (err) reject(err);
								resolve(_.sumBy(data, o => Number(o[prop])));
							});
						}, this.utils.databaseInitTimeout);
					}
				}).catch(e => console.log(e));
			}
		} else if(this.checkType(pathName) === 'array') {
			if(this.checkType(prop) === 'string' && prop.length > 0) {
					resolve(_.sumBy(pathName, o => Number(o[prop])));
			} else if(typeof prop === 'undefined') {
					resolve(_.sumBy(pathName, Number));
			}
		} else if(this.checkType(pathName) === 'object') {
			reject('doSum function works only with array, received type: \'object\'');
		} else {
			reject('Error while executing doSum function: Please check provided arguement is valid object');
		}
	});
};


Shridb.prototype.groupBy = function(tableName, prop) {
	let dbName = this.name;
	let pathName = null;

	if (this.checkType(tableName) === 'string' && tableName.length > 0) {
		pathName = path.join(dbName, tableName + '.json');
	} else if(this.checkType(tableName) === 'array') {
		pathName = tableName;
	} else if(this.checkType(tableName) === 'object') {
		pathName = tableName;
	}

	return new Promise((resolve, reject) => {
		if(this.checkType(pathName) === 'string') {
			if(this.checkType(prop) === 'string' && prop.length > 0) {
				fs.pathExists(pathName).then(exists => {
					if (exists) {
						fs.readJson(pathName, (err, data) => {
							if (err) throw(err);
							resolve(_.groupBy(data, prop));
						});
					} else {
						setTimeout(function () {
							fs.readJson(pathName, (err, data) => {
								if (err) reject(err);
								resolve(_.groupBy(data, prop));
							});
						}, this.utils.databaseInitTimeout);
					}
				}).catch(e => console.log(e));
			}
		} else if(this.checkType(pathName) === 'array') {
			if(this.checkType(prop) === 'string' && prop.length > 0) {
					resolve(_.groupBy(pathName, prop));
			} else if(typeof prop === 'undefined') {
					reject('Error while executing doSum function: Please check group property is defined');
			}
		} else if(this.checkType(pathName) === 'object') {
			reject('groupBy function works only with array, received type: \'object\'');
		} else {
			reject('Error while executing doSum function: Please check defined arguement is valid object');
		}
	});
};

Shridb.prototype.backupDatabase = function(destPath, folderName) {
	let dbName = this.name;
	let backupFolder = path.join(destPath, folderName);

	return new Promise((res, rej) => {
		res(backupFolder);
	}).then(backupFolder => {
		return new Promise((resolve, reject) => {
			if (this.checkType(folderName) === 'string' && folderName.length > 0) {
				if (this.checkType(destPath) === 'string' && destPath.length > 0) {
					fs.pathExists(backupFolder).then(exists => {
						if(exists) {
							fs.copy(dbName, backupFolder).then(() => {
							  resolve(dbName + ' backup successfull..!');
							}).catch(err => {
							  reject('backup failed: ' + err);
							});
						} else {
							fs.ensureDir(backupFolder).then(() => {
							  	fs.copy(dbName, backupFolder).then(() => {
							  	  resolve(dbName + ' backup successfull..!');
							  	}).catch(err => {
							  	  reject('backup failed: ' + err);
							  	});
							}).catch(err => {
							  console.error(err);
							});
						}
					}).catch(e => console.log(e));
				} else {
					resolve('backupDatabase: destinationPath is empty');
				}
			} else {
				resolve('backupDatabase: folderName is empty');
			}
		}).catch(e => console.error(e));
	}).catch(e => console.error(e));
};

Shridb.prototype.restoreDatabase = function(sourcePath) {
	let dbName = this.name;
	var isDirectory = fs.statSync(sourcePath).isDirectory();

	return new Promise((resolve, reject) => {
		if (this.checkType(sourcePath) === 'string' && sourcePath.length > 0) {
			fs.pathExists(sourcePath).then(exists => {
				if(exists) {
					if(isDirectory) {
						fs.copy(sourcePath, dbName).then(() => {
						  resolve(dbName + ' restored successfully..!');
						}).catch(err => {
						  reject(err + ' source folder not exists');
						});
					} else {
						reject(err + 'source folder is not a directory');
					}
				} else {
					resolve('sourcePath not exists: ' + sourcePath);
				}
			}).catch(e => console.log(e));
		} else {
			resolve('restoreDatabase: sourcePath is empty');
		}
	});
};


Shridb.prototype.orderBy = function(array, sortProp, order) {
	let dbName = this.name;
	let pathName = null;

	if (this.checkType(array) === 'string' && array.length > 0) {
		pathName = path.join(dbName, array + '.json');
	} else if(this.checkType(array) === 'array') {
		pathName = array;
	} else if(this.checkType(array) === 'object') {
		pathName = array;
	}

	return new Promise((resolve, reject) => {
		return new Promise((res, rej) => {
			res(pathName);
		}).then(pathName => {
			if(this.checkType(pathName) === 'string' && pathName.length > 0) {
				fs.pathExists(pathName).then(exists => {
					if (exists) {
						fs.readJson(pathName, (err, data) => {
							if (err) throw err;
							if(_.isArray(data)) {
								resolve(_.orderBy(data, sortProp, order));
							}
						});
					} else {
						reject(pathName + ' not exists');
					}
				}).catch(e => console.log(e));
			} else if(this.checkType(pathName) === 'array') {
				return new Promise((res, rej) => {
					res(pathName);
				}).then(arr => {
					resolve(_.orderBy(arr, sortProp, order));
				}).catch(e => console.log(e));
			} else if(this.checkType(pathName) === 'object') {
				reject('orderBy function works only with array for query purpose received type: \'object\'');
			} else {
				reject('Error while executing orderBy function');
			}
		}).catch(e => console.log(e));
	});
};


Shridb.prototype.unique = function(array, prop) {
	let dbName = this.name;
	let pathName = null;

	if (this.checkType(array) === 'string' && array.length > 0) {
		pathName = path.join(dbName, array + '.json');
	} else if(this.checkType(array) === 'array') {
		pathName = array;
	} else if(this.checkType(array) === 'object') {
		pathName = array;
	}

	return new Promise((resolve, reject) => {
		return new Promise((res, rej) => {
			res(pathName);
		}).then(pathName => {
			if(this.checkType(pathName) === 'string' && pathName.length > 0) {
				fs.pathExists(pathName).then(exists => {
					if (exists) {
						fs.readJson(pathName, (err, data) => {
							if(_.isArray(data)) {
								if(typeof prop !== 'undefined' || prop !== undefined) {
								 	resolve(_.uniqBy(data, prop));
								} else {
									resolve(_.uniq(data));
								}
							} else {
								reject('Not a valid array:' + data);
							}
						});
					} else {
						reject(pathName + ' not exists');
					}
				}).catch(e => console.log(e));
			} else if(this.checkType(pathName) === 'array') {
				if(typeof prop !== 'undefined' || prop !== undefined) {
				 	resolve(_.uniqBy(array, prop));
				} else {
					resolve(_.uniq(array));
				}
			} else if(this.checkType(pathName) === 'object') {
				reject('unique function works only with array for query purpose received type: \'object\'');
			} else {
				reject('Error while executing unique function');
			}
		}).catch(e => console.log(e));
	});
};


Shridb.prototype.pushAfter = function(array, element, newElement) {
	let dbName = this.name;
	let pathName = null;

	if (this.checkType(array) === 'string' && array.length > 0) {
		pathName = path.join(dbName, array + '.json');
	} else if(this.checkType(array) === 'array') {
		pathName = array;
	} else if(this.checkType(array) === 'object') {
		pathName = array;
	}

	return new Promise((resolve, reject) => {
		return new Promise((res, rej) => {
			res(pathName);
		}).then(pathName => {
			if(this.checkType(pathName) === 'string' && pathName.length > 0) {
				fs.pathExists(pathName).then(exists => {
					if (exists) {
						fs.readJson(pathName, (err, data) => {
							if (err) throw err;
							 if(_.isArray(data)) {
							 	let index = _.findIndex(data, element);
							 	return new Promise((res, rej) => {
							 		if(index !== -1) {
							 			res(index);
							 		} else {
							 			rej('No index found');
							 		}
							 	}).then(gotIndex => {
							 		gotIndex++;
							 		data.splice(gotIndex, 0, newElement);
							 		return new Promise((res, rej) => {
							 			res(data);
							 		}).then(updatedData => {
							 			fs.writeJson(pathName, updatedData, er => {
							 				if (er) throw er;
							 				console.log('New element pushed');
							 				resolve(updatedData);
							 			});
							 		});
							 	}).catch(e => console.log(e));
							 }
						});
					} else {
						setTimeout(function () {
							fs.readJson(pathName, (err, data) => {
								if (err) throw err;
								 if(_.isArray(data)) {
								 	let index = _.findIndex(data, element);
								 	return new Promise((res, rej) => {
								 		if(index !== -1) {
								 			res(index);
								 		} else {
								 			rej('No index found');
								 		}
								 	}).then(gotIndex => {
								 		gotIndex++;
								 		data.splice(gotIndex, 0, newElement);
								 		return new Promise((res, rej) => {
								 			res(data);
								 		}).then(updatedData => {
								 			fs.writeJson(pathName, updatedData, er => {
								 				if (er) throw er;
								 				console.log('New element pushed');
								 				resolve(updatedData);
								 			});
								 		});
								 	}).catch(e => console.log(e));
								 }
							});
						}, this.utils.databaseInitTimeout);
					}
				}).catch(e => console.log(e));
			} else if(this.checkType(pathName) === 'array') {
			 	let index = _.findIndex(pathName, element);
			 	return new Promise((res, rej) => {
			 		if(index !== -1) {
			 			res(index);
			 		} else {
			 			rej('No index found');
			 		}
			 	}).then(gotIndex => {
			 		gotIndex++;
			 		pathName.splice(gotIndex, 0, newElement);
			 		return new Promise((res, rej) => {
			 			res(pathName);
			 		}).then(updatedData => {
			 			resolve(updatedData);
			 		});
			 	});
			} else if(this.checkType(pathName) === 'object') {
				reject('pushAfter function works only with array, received type: \'object\'');
			} else {
				reject('Error while executing pushAfter function');
			}
		}).catch(e => console.log(e));
	});
};

Shridb.prototype.pushBefore = function(array, element, newElement) {
	let dbName = this.name;
	let pathName = null;

	if (this.checkType(array) === 'string' && array.length > 0) {
		pathName = path.join(dbName, array + '.json');
	} else if(this.checkType(array) === 'array') {
		pathName = array;
	} else if(this.checkType(array) === 'object') {
		pathName = array;
	}

	return new Promise((resolve, reject) => {
		return new Promise((res, rej) => {
			res(pathName);
		}).then(pathName => {
			if(this.checkType(pathName) === 'string' && pathName.length > 0) {
				fs.pathExists(pathName).then(exists => {
					if (exists) {
						fs.readJson(pathName, (err, data) => {
							if (err) throw err;
							 if(_.isArray(data)) {
							 	let index = _.findIndex(data, element);
							 	return new Promise((res, rej) => {
							 		if(index !== -1) {
							 			res(index);
							 		} else {
							 			rej('No index found');
							 		}
							 	}).then(gotIndex => {
							 		data.splice(gotIndex, 0, newElement);
							 		return new Promise((res, rej) => {
							 			res(data);
							 		}).then(updatedData => {
							 			fs.writeJson(pathName, updatedData, er => {
							 				if (er) throw er;
							 				console.log('New element pushed');
							 				resolve(updatedData);
							 			});
							 		});
							 	}).catch(e => console.log(e));
							 }
						});
					} else {
						setTimeout(function () {
							fs.readJson(pathName, (err, data) => {
								if (err) throw err;
								 if(_.isArray(data)) {
								 	let index = _.findIndex(data, element);
								 	return new Promise((res, rej) => {
								 		if(index !== -1) {
								 			res(index);
								 		} else {
								 			rej('No index found');
								 		}
								 	}).then(gotIndex => {
								 		data.splice(gotIndex, 0, newElement);
								 		return new Promise((res, rej) => {
								 			res(data);
								 		}).then(updatedData => {
								 			fs.writeJson(pathName, updatedData, er => {
								 				if (er) throw er;
								 				console.log('New element pushed');
								 				resolve(updatedData);
								 			});
								 		});
								 	}).catch(e => console.log(e));
								 }
							});
						}, this.utils.databaseInitTimeout);
					}
				}).catch(e => console.log(e));
			} else if(this.checkType(pathName) === 'array') {
			 	let index = _.findIndex(pathName, element);
			 	return new Promise((res, rej) => {
			 		if(index !== -1) {
			 			res(index);
			 		} else {
			 			rej('No index found');
			 		}
			 	}).then(gotIndex => {
			 		pathName.splice(gotIndex, 0, newElement);
			 		return new Promise((res, rej) => {
			 			res(pathName);
			 		}).then(updatedData => {
			 			resolve(updatedData);
			 		});
			 	});
			} else if(this.checkType(pathName) === 'object') {
				reject('pushBefore function works only with array, received type: \'object\'');
			} else {
				reject('Error while executing pushBefore function');
			}
		}).catch(e => console.log(e));
	});
};


Shridb.prototype.length = function(tableName) {
	let dbName = this.name;
	let pathName = null;

	if (this.checkType(tableName) === 'string' && tableName.length > 0) {
		pathName = path.join(dbName, tableName + '.json');
	} else if(this.checkType(tableName) === 'array') {
		pathName = tableName;
	} else if(this.checkType(tableName) === 'object') {
		pathName = tableName;
	}

	return new Promise((resolve, reject) => {
		return new Promise((res, rej) => {
			res(pathName);
		}).then(pathName => {
			if(this.checkType(pathName) === 'string' && pathName.length > 0) {
					fs.pathExists(pathName, (err, exists) => {
						if(err) throw err;
						if (exists) {
							fs.readJson(pathName, (er, data) => {
								if (er) throw er;
								resolve(_.size(data));
							});
						} else {
							reject(tableName + ' not exists');
						}
					});
			} else if(this.checkType(pathName) === 'array') {
				resolve(_.size(pathName));
			} else if(this.checkType(pathName) === 'object') {
				resolve(_.size(pathName));
			}
		});
	});
};


Shridb.prototype.utils = {
	databaseInitTimeout: 2000,
	trimString : function(str) {
		if(_.isString(str)) {
			return _.trim(str.replace(/\s\s+/g, ' '));
		} else {
			return 'Invalid string';
		}
	},
};


Shridb.prototype.insert = function(tableName, obj) {
	let dbName = this.name;
	let pathName = null;
	let checkObj = this.checkType(obj);

	if (this.checkType(tableName) === 'string' && tableName.length > 0) {
		pathName = path.join(dbName, tableName + '.json');
	} else if(this.checkType(tableName) === 'array') {
		pathName = tableName;
	} else if(this.checkType(tableName) === 'object') {
		pathName = tableName;
	}

	return new Promise((resolve, reject) => {
		return new Promise((res, rej) => {
			res(pathName);
		}).then(pathName => {
		if(this.checkType(pathName) === 'string' && pathName.length > 0) {
			fs.pathExists(pathName, (err, exists) => {
				if (err) throw err;
				if (exists) {
					return new Promise((res, rej) => {
						fs.readJson(pathName, (er, data) => {
							if (er) throw er;
							if(checkObj === 'object') {
								data.push(obj);
								res(data);
							} else if(checkObj === 'array') {
								for (let i = 0; i < obj.length; i++) {
									data.push(obj[i]);
								}
								res(data);
							} else {
								data.push(obj);
								res(data);
							}
						});
					}).then((updatedData) => {
						resolve(updatedData);
						fs.writeJson(pathName, updatedData);
					}).catch(e => console.log(e));
				} else {
					setTimeout(function () {
						return new Promise((res, rej) => {
							fs.readJson(pathName, (er, data) => {
								if (er) reject(tableName + ' not exists, please set databaseInitTimeout\n' + err);
								if(typeof data !== 'undefined') {
									if(checkObj === 'object') {
										data.push(obj);
										res(data);
									} else if(checkObj === 'array') {
										for (let i = 0; i < obj.length; i++) {
											data.push(obj[i]);
										}
										res(data);
									} else {
										data.push(obj);
										res(data);
									}
								} else {
									console.log(tableName + ' not exists, please set databaseInitTimeout');
								}
								
							});
						}).then((updatedData) => {
							resolve(updatedData);
							fs.writeJson(pathName, updatedData);
						}).catch(e => console.log(e));
					}, this.utils.databaseInitTimeout);
				}
			});
		} else if(this.checkType(pathName) === 'array') {
			if(checkObj === 'object') {
				pathName.push(obj);
				resolve(pathName);
			} else if(checkObj === 'array') {
				for (let i = 0; i < obj.length; i++) {
					pathName.push(obj[i]);
					resolve(pathName);
				}
			} else {
				pathName.push(obj);
				resolve(pathName);
			}
		} else if(this.checkType(pathName) === 'object') {
			reject('insert function works only with array, received type: \'object\'');
		}

		});
	});
};


Shridb.prototype.dateRangeFilter = function(tableName, dateProp, startDate, endDate) {
	let dbName = this.name;
	let pathName = null;

	if (this.checkType(tableName) === 'string' && tableName.length > 0) {
		pathName = path.join(dbName, tableName + '.json');
	} else if(this.checkType(tableName) === 'array') {
		pathName = tableName;
	} else if(this.checkType(tableName) === 'object') {
		pathName = tableName;
	}

	let isStartDate = _.isDate(new Date(startDate));
	let isEndDate = _.isDate(new Date(endDate));

	return new Promise((resolve, reject) => {
		return new Promise((res, rej) => {
			res(pathName);
		}).then(pathName => {
			if(this.checkType(pathName) === 'string' && pathName.length > 0) {
				fs.pathExists(pathName, (error, exists) => {
					if (error) throw error;
					if (exists) {
						fs.readJson(pathName, (err, data) => {
							if (err) throw err;
							if(_.isArray(data)) {
								if(_.isString(dateProp) && dateProp.length > 0) {
									if(isStartDate && isEndDate) {
										resolve(_.filter(data, o => o[dateProp] >= startDate && 
							            o[dateProp] <= endDate));
									} else {
										reject('date defined is invalid');
									}
								} else {
									reject('invalid date property');
								}
							} else {
								reject('invalid data object to filter date range, required Array');
							}
						});
					} else {
						reject(tableName + ' not exists');
					}
				});
			} else if(this.checkType(pathName) === 'array') { 
				if(_.isString(dateProp) && dateProp.length > 0) {
					if(isStartDate && isEndDate) {
						resolve(_.filter(pathName, o => o[dateProp] >= startDate && 
			            o[dateProp] <= endDate));
					} else {
						reject('date defined is invalid');
					}
				} else {
					reject('invalid date property');
				}
			} else if(this.checkType(pathName) === 'object') { 
				reject('dateRangeFilter function works only with array, received type: \'object\'');
			} else {
				reject('Error while executing dateRangeFilter function');
			}
		});
	});
};


module.exports = Shridb;
