/**
 Object paramters:
 queryData: contains data related to the query string sent by the user
 {
 queryString: <the thing being searched for>,
 fields: <a list fields to check the query string against,
 }

 tagData: lists of tag labels to filter the results by
 {
 have: [returned documents must have these tags],
 notHave: [returned documents cannot have these tags]
 }

 pagingData: data related to which page of results to show
 {
 pageSize: number of results to get back,
 offset: where to start the search
 }
 **/

SearchAPI = {
  find: function (
    collectionName, queryData, pagingData, tagData, sortData,
    resultsHandler) {
    Meteor.call(
      'find', collectionName, queryData, pagingData, tagData, sortData,
      resultsHandler);
  },
  findByUser: function (
    collection, queryData, pagingData, sortCriteria, resultsHandler) {
    Meteor.call(
      'findByTags', collection, queryData, pagingData,
      sortCriteria, resultsHandler);
  },
  index: function (collectionName, newDocument) {
    // no callback to make this a synchronous
    // call (http://docs.meteor.com/#meteor_call)
    // this is important because for nodes we want to create the search
    // document then add access information to the document right after
    Meteor.call('index', collectionName, newDocument);
  },
  remove: function (collectionName, document) {
    Meteor.call('remove', collectionName, document);
  }
};
