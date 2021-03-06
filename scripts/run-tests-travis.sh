#!/bin/bash

code=0

# Try running the tests 10 times.
for i in {1..10}; do
    nyc --all --reporter=lcov mocha tests --recursive

    code=$?

    # If not code 50, the docker server not starting correctly was
    # the problem.
    if [[ $code -ne 50 ]]; then
        break;

    # Sleep for 10 seconds and then keep trying.
    else
        echo '\n\033[0;31m' \
                'Error running test: could not connect to docker server. ' \
                'Trying again.\033[0m\n'

        sleep 10
    fi
done

exit $code
