#!/bin/bash

#clear the meteor database
meteor reset

#clear the search index
curl -XDELETE 'http://api.searchbox.io/api-key/ce2b03bb86b96565d31457f952ddbae3/nodes'
curl -XPUT 'http://api.searchbox.io/api-key/ce2b03bb86b96565d31457f952ddbae3/nodes'

#start meteor in the background
mrt & 


#wait for the server to get started, find a better way to do this... 
sleep 15

#run the actual tests, doing it this way because --includes seems problematic when calling from here
cd tests
./run-casper.sh

#stop meteor processes
echo "stopping meteor..."
kill -9 `ps ax | grep meteor | awk '{print $1}'`

exit
