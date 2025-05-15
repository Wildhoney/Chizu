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

preview:
	npx vite preview

fmt:
	npx prettier --write .

test:
	make unit
	make browser

deploy:
	make build
	npx commit-and-tag-version
	npm publish
