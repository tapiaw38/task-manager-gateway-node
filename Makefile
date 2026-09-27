.DEFAULT_GOAL := help
.PHONY: install run run-dev test test-cover build typecheck lint fmt format-check docs help

install:
	@pnpm install --frozen-lockfile

run:
	@pnpm start

run-dev:
	@pnpm dev

test:
	@pnpm test

test-cover:
	@pnpm test:cover

build:
	@pnpm build

typecheck:
	@pnpm typecheck

lint:
	@pnpm lint

fmt:
	@pnpm format

format-check:
	@pnpm format:check

docs:
	@npx -y docsify-cli serve ./docs --port 3001

help:
	@printf '%s\n' 'build docs fmt format-check install lint run run-dev test test-cover typecheck'
