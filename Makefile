SHELL := /usr/bin/env bash

build: 	
	docker-compose up --build && docker rmi $(docker images -f "dangling=true" -q)

run: 	
	docker-compose up	

update:
	npm install && \
	cd backend && \
	npm install

start:
	cd backend && \
	nodemon server.js && \
	cd .. && \
	npm start	
