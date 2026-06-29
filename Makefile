.PHONY: lint test sk-lint ci

lint:
	npx eslint .

test:
	npx vitest run

sk-lint:
	python3 tools/sk-lint.py docs/specs

ci: lint test sk-lint
