cannon: 
	clinic doctor --on-port 'autocannon -m POST localhost:3000/user/register' -- node dist/main.js
start:
	npm run start
build:
	npm run build
inspect:
	npm run dev:inspect
test:
	npm run test