RecordsAPI = {
	recordProperties: ['userId', 'time','type', 'objectId'],
	record: function (recordData) {
		recordData.time = new Date();
		Records.insert(recordData);
	}
};
