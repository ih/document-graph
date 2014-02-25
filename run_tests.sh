#!/bin/bash

#clear the meteor database
meteor reset

#clear the search index
curl -XDELETE 'http://api.searchbox.io/api-key/ce2b03bb86b96565d31457f952ddbae3/nodes'
curl -XPUT 'http://api.searchbox.io/api-key/ce2b03bb86b96565d31457f952ddbae3/nodes'

#start meteor in the background
mrt --release template-engine-preview-10.1 &

#wait for the server to get started, find a better way to do this... 
sleep 10

casperjs test tests --verbose --log-level=debug

#stop meteor processes
kill -9 `ps ax | grep meteor | awk '{print $1}'`

exit
