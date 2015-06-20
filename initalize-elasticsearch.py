from elasticsearch import Elasticsearch

es = Elasticsearch()

mapping = {
    'node': {
        'properties': {
            'privacySettings': {'type': 'string', 'index': 'not_analyzed'},
            'content': {'type': 'string', 'analyzer': 'english'},
            'title': {'type': 'string', 'analyzer': 'english'},
            'tags': {'type': 'string', 'index': 'not_analyzed'}
        }
    }
  }

es.indices.create(index='nodes', body={'mappings': mapping}, ignore=400)
