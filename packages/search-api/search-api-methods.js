var searchHostUrl = 'http://localhost:9200';
if (Meteor.settings.elasticSearchServer) {
  searchHostUrl = Meteor.settings.elasticSearchServer;
}

console.log('Searching with ' + searchHostUrl);

Meteor.startup(function () {
  // set the mapping for elasticsearch
  console.log('setting up the elasticsearch mapping');
  // create index
  HTTP.put(searchHostUrl+'/nodes/node/0', {'data': {'node': 'start'}});
  // add mapping
  var mapping = {
    'node': {
      'properties': {
        'privacySettings': {'type': 'string', 'index': 'not_analyzed'},
        'content': {'type': 'string', 'analyzer': 'english'},
        'title': {'type': 'string', 'analyzer': 'english'},
        'tags': {'type': 'string', 'analyzer': 'not_analyzed'}
      }
    }
  };
  HTTP.put(searchHostUrl+'/nodes/node/_mapping', {'data': mapping});
});

function elasticSearchParse(httpResponse) {
  console.log('parsing response');

  return {
    hits: _.map(httpResponse.data.hits.hits, function (hit) {
      return {
        'title': hit._source.title,
        'id': hit._source._id,
        'type': hit._type,
        'highlight': hit.highlight,
        'score': hit._score
      };
    }),
    totalHitCount: httpResponse.data.hits.total
  };
}

Meteor.methods({
  find: function (
    collectionName, queryData, pagingData, tagData, sortData, resultsHandler) {
    var url = searchHostUrl + '/' + collectionName + '/_search';
    console.log('in find method');
    console.log(this.userId);
    // assumes user has read access for all their groups
    var userActorIds = PermissionsAPI.getUserActorIds(this.userId);
    console.log('searching');
    console.log(userActorIds);
    // remove date fields, TODO find a better way to do this
    // maybe make fields a dictionary keyed by field type
    queryData.fields = _.without(queryData.fields, 'createdAt', 'editedAt');
    console.log(queryData.fields);
    var elasticSearchQuery = {
      'from': pagingData.offset,
      'size': pagingData.pageSize,
      'query': {
        'bool': {
          'should': {
            'multi_match': {
              'query': queryData.queryString,
              'fields': queryData.fields
            }
          },
          'must': [{
            'terms': {
              'privacySettings': userActorIds,
              'minimum_should_match': 1
            }
          }]
        }
      },
      'highlight': {
        'fields': {
          'title': {},
          'content': {}
        },
        'require_field_match': true
      }
    };

    if (sortData) {
      elasticSearchQuery['sort'] = sortData;
    }

    if (tagData && tagData.have.length > 0) {
      var tagTerms = {
        terms: {
          'tags': _.map(tagData.have, spacesToUnderscores),
          'minimum_should_match': 1}
      };
      elasticSearchQuery[
        'query']['bool']['must'].push(tagTerms);
    }

    console.log('meteor method searching... ');
    console.log(JSON.stringify(sortData));
    console.log(JSON.stringify(elasticSearchQuery));
    try {
      var results = elasticSearchParse(
        HTTP.get(url, {'data': elasticSearchQuery}));
    } catch (e) {
      console.log('error with search');
      console.log(JSON.stringify(e));
    }

    return results;
  },
  index: function (collectionName, newDocument) {
    var url = searchHostUrl + '/' + collectionName + '/' +
          collectionName.slice(0, -1) + '/' + newDocument._id;
    console.log('meteor method indexing... ');
    console.log(newDocument);
    // TODO remove if start using a crawler to index documents
    // using id instead of _id since that causes an error with elasticsearch
    // perhaps move this into the editor package so that the access
    // related tags can be added to search index document
    var permissions = PermissionsAPI.getResourcePermissions(newDocument._id);
    var readPermissions = _.filter(permissions, function (permission) {
      return _.contains(permission.actions, 'read');
    });
    var validActors = _.pluck(readPermissions, 'actorId');
    newDocument.privacySettings = validActors;
    newDocument.tags = _.map(
      _.pluck(TagsAPI.getTags(newDocument._id), 'label'), spacesToUnderscores);
    console.log('about to put the document:' + JSON.stringify(newDocument));

    HTTP.put(url, {'data': newDocument}, function (error, result) {
      console.log(error);
      console.log(result);
      return result;
    });
  },
  remove: function (collectionName, document) {
    var url = searchHostUrl + '/' + collectionName + '/' +
          collectionName.slice(0, -1) + '/' + document._id;
    HTTP.del(url);
  }
});

// fix for elasticsearch not handling multiword tags for a terms clause
// basically delimit multiword tags with an underscore when searching and
// indexing
function spacesToUnderscores(label) {
  if (label.indexOf(' ') > -1) {
    return label.split(' ').join('_');
  }
  else {
    return label;
  }
}
