SHELL := /bin/bash

all: setup run-build run-dev

# Main target for setting up dependencies
setup: check-brew install-asdf
	make -C typescript setup
	make -C python setup
	make install-aws install-docker check-versions setup-aws-credentials download-env

# Target for setting up dependencies for typescript
setup-ts: check-brew install-asdf
	make -C typescript setup
	make install-aws install-docker check-versions setup-aws-credentials download-env

# Target for setting up dependencies for python
setup-py: check-brew install-asdf
	make -C python setup

# Check if Homebrew is installed and prompt to install if not
check-brew:
	@command -v brew >/dev/null 2>&1 || ( \
		echo "Homebrew (brew) is not installed. Please install it by following the instructions at https://brew.sh/"; \
		exit 1; \
	)

# Check that asdf is installed or install it via brew.
install-asdf:
	@command -v asdf >/dev/null || { \
		 echo "Installing asdf..."; \
		 brew install asdf; \
		 echo "asdf is installed."; \
	}

# Check if yarn is installed, and install it if not
check-yarn:
	@echo "Checking if yarn is installed and up to date..."
	@command -v yarn >/dev/null || { \
		echo "Yarn not found. Installing yarn via corepack..."; \
		yarn_version=$$(grep '"packageManager": "yarn@' package.json | sed 's/.*"yarn@\(.*\)".*/\1/'); \
		asdf reshim nodejs; \
		corepack enable; \
		corepack prepare yarn@$$yarn_version --activate; \
		echo "Yarn version $$yarn_version has been installed. Please reopen your terminal and check the yarn version with 'yarn -v'."; \
		exit 1; \
	}
	@{ \
		yarn_version=$$(grep '"packageManager": "yarn@' package.json | sed 's/.*"yarn@\(.*\)".*/\1/'); \
		current_yarn_version=$$(yarn -v); \
		if [ "$$current_yarn_version" != "$$yarn_version" ]; then \
			echo "Yarn version $$current_yarn_version is not $$yarn_version. Installing version $$yarn_version..."; \
			asdf reshim nodejs; \
			corepack enable; \
			corepack prepare yarn@$$yarn_version --activate; \
			yarn set version $$yarn_version; \
			echo "Yarn has been updated to version $$yarn_version. Please reopen your terminal and check the yarn version with 'yarn -v'."; \
			exit 1; \
		fi; \
	}

# Install AWS CLI
install-aws: install-awscli install-awscli-local

# Install AWS CLI using Homebrew
install-awscli: check-brew
	@echo "Installing AWS CLI using Homebrew..."
	@brew install awscli
	@command -v aws >/dev/null 2>&1 && echo "AWS CLI installed successfully" || ( \
		echo "AWS CLI installation failed. Please check the Homebrew installation or try installing it manually."; \
		exit 1; \
	)

# Install LocalStack AWS CLI using Homebrew
install-awscli-local: check-brew
	@echo "Installing LocalStack AWS CLI using Homebrew..."
	@brew install awscli-local
	@command -v awslocal >/dev/null 2>&1 && echo "LocalStack AWS CLI installed successfully" || ( \
		echo "LocalStack AWS CLI installation failed. Please check the Homebrew installation or try installing it manually."; \
		exit 1; \
	)

# Check versions
check-versions: check-brew check-yarn
	# Check if asdf is installed
	@command -v asdf >/dev/null 2>&1 && echo "asdf is installed" || echo "asdf is not installed"

	# Check Yarn version
	@command -v yarn >/dev/null 2>&1 && ( \
		echo "Yarn version:"; \
		yarn -v; \
	) || echo "Yarn not installed"

	# Check AWS CLI version
	@command -v aws >/dev/null 2>&1 && ( \
		echo "AWS CLI version:"; \
		aws --version; \
	) || echo "AWS CLI not installed"

	# Check Docker version
	@command -v docker >/dev/null 2>&1 && ( \
		echo "Docker version:"; \
		docker --version; \
	) || echo "Docker not installed"

	# Check Docker Compose version
	@command -v docker-compose >/dev/null 2>&1 && ( \
		echo "Docker Compose version:"; \
		docker-compose --version; \
	) || echo "Docker Compose not installed"

# Setup Docker and Docker Compose
install-docker: check-brew
	@command -v docker >/dev/null 2>&1 && echo "Docker is already installed." || { \
		echo "Docker is not installed. Installing Docker via Homebrew..."; \
		brew install docker && brew link docker; \
	}

	@echo "Checking if Docker Compose is installed..."
	@command -v docker-compose >/dev/null 2>&1 && echo "Docker Compose is already installed." || { \
		echo "Docker Compose is not installed. Installing Docker Compose via Homebrew..."; \
		brew install docker-compose; \
		echo "Docker Compose installed successfully"; \
	}

# Define variables
#SECRETS := $(shell find apps -mindepth 1 -maxdepth 1 -type d)
AWS_REGION := eu-central-1
STAGE := development
SECRET_PREFIX := dbbs-pre-built-solutions
AWS_PROFILE := $(SECRET_PREFIX)-$(STAGE)

setup-aws-credentials:
	@if ! test -f ~/.aws/config; then mkdir -p ~/.aws && touch ~/.aws/config; fi; \
	if ! grep "$(AWS_PROFILE)" ~/.aws/config; then cat infra/aws_configs/config >> ~/.aws/config; fi; \
	if ! aws sts get-caller-identity --profile $(AWS_PROFILE) >/dev/null 2>&1; then \
		aws sso login --profile $(AWS_PROFILE); \
	fi; \
	echo "AWS credentials setup completed.";

aws-login: setup-aws-credentials
	@if ! aws sts get-caller-identity --profile $(AWS_PROFILE) >/dev/null 2>&1; then \
		echo "Not logged in. Redirecting to SSO."; \
		aws sso login --profile $(AWS_PROFILE); \
	else \
		echo "Already logged in."; \
	fi;

download-env:
	@read -p "If you want to download the environment variables, you need to provide access to the AWS account. Proceed with AWS login? (yes/no): " response; \
	if [ "$$response" = "yes" ]; then \
		make aws-login; \
		echo "Downloading environment variables"; \
		STAGE=$(STAGE) SECRET_PREFIX=$(SECRET_PREFIX) AWS_PROFILE=$(AWS_PROFILE) yarn download:env; \
	else \
		echo "Skipping download-env as requested."; \
	fi;

# Build pre-built solutions
.PHONY: run-build

# Default rule to run `yarn build` in the root folder
run-build:
	yarn build

# Pattern rule to run `yarn build` in the specified subdirectory
run-build-%:
	target=$* yarn build

.PHONY: run-dev

# Default rule to run `yarn dev` in the root folder
run-dev:
	yarn dev

# Pattern rule to run `yarn dev` in the specified subdirectory
run-dev-%:
	target=$* yarn dev

.PHONY: run-test

# Default rule to run `yarn test` in the root folder
run-test:
	yarn test

# Pattern rule to run `yarn test` in the specified subdirectory
run-test-%:
	target=$* yarn test

install-gems-%:
	cd typescript/apps/$(*F) && bundle install

install-pods-%:
	cd typescript/apps/$(*F) && npx pod-install

fastlane-build-%:
	cd typescript/apps/$(*F) && bundle exec fastlane $(P) build variant:$(V) type:$(T)

firebase-distribution-%:
	cd typescript/apps/$(*F) && bundle exec fastlane $(P) distribution variant:$(V)

beta-distribution-%:
	cd typescript/apps/$(*F) && bundle exec fastlane $(P) beta variant:$(V)

localstack-up: install-docker local-network-up
	docker compose -f docker-compose/docker-compose.localstack.yml --env-file ./.env --project-name backend-localstack up --build -d
localstack-down: local-network-down
	docker compose -f docker-compose/docker-compose.localstack.yml --env-file ./.env --project-name backend-localstack down

local-network-up:
	docker network create dbb-backend-network || true

local-network-down:
	docker network remove dbb-backend-network || true

set-docker-volume-permissions:
	chmod -R 777 docker-compose/volume
