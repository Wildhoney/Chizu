unit:
	npx jest

browser:
	$(eval port := $(shell npx get-port-cli --port 50000-59999))
	npx vite dev --port $(port)	&
	npx wait-on http://localhost:$(port)
	npx playwright test

typecheck:
	npx tsc --noEmit

dev:
	npx vite

build:
	npx vite build

checks:
	make fmt
	make lint
	make typecheck
	make unit

preview:
	npx vite preview

fmt:
	npx prettier --write .

lint:
	npx eslint --fix src/

test:
	make unit

deploy:
	yarn --force
	make build
	npx commit-and-tag-version
	npm publish
	git push
	git push --tags
