unit:
	npx jest

typecheck:
	npx tsc --noEmit

dev:
	npx vite

build:
	npx tsc -b && vite build

preview:
	npx vite preview

fmt:
	npx prettier --write .
