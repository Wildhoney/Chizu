unit:
	npx jest

typecheck:
	npx tsc --noEmit

app:
	/Users/adam/.deno/bin/deno --allow-net src/example/index.ts

fmt:
	npx prettier --write .
