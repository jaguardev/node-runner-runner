 
test:
	./node_modules/.bin/_mocha \
		--reporter spec \
		--slow 75 \
		--ui bdd
.PHONY: test