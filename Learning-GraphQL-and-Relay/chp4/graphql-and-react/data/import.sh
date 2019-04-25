#!/bin/bash

mongoimport --db test --collection quotes --file ./data.json --jsonArray
