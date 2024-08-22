SHELL := /bin/bash

all: setup run-build run-dev

# Main target for setting up dependencies
setup: check-brew asdf-install install-deps install-docker check-versions prompt-aws-profile

# Check if Homebrew is installed and prompt to install if not
check-brew:
	@command -v brew >/dev/null 2>&1 || ( \
		echo "Homebrew (brew) is not installed. Please install it by following the instructions at https://brew.sh/"; \
		exit 1; \
	)

# Installs dependencies via asdf
asdf-install: check-brew check-asdf-path
	command -v asdf >/dev/null 2>&1 || brew install asdf

	asdf plugin-list | grep -q nodejs || asdf plugin-add nodejs
	asdf plugin-list | grep -q ruby || asdf plugin-add ruby
	asdf plugin-list | grep -q cocoapods || asdf plugin-add cocoapods
	asdf plugin-list | grep -q python || asdf plugin-add python
	asdf plugin-list | grep -q poetry || asdf plugin-add poetry

	asdf plugin update --all

	asdf install

	asdf reshim

# Install Node.js modules and AWS CLI
install-deps: install-node-modules install-awscli install-awscli-local

# Install Node.js modules
install-node-modules: check-asdf-path check-yarn
	yarn

# Check that asdf has priority in PATH, or else open up instructions.
check-asdf-path:
	@echo "Checking if asdf is correctly set in PATH..."
	@ command -v asdf >/dev/null || { \
		echo "WARNING: asdf not in PATH or Node.js not installed via asdf. Make sure to follow instructions for adding asdf to shell after a brew install."; \
		echo "Opening instructions..."; \
		open "https://asdf-vm.com/guide/getting-started.html#_3-install-asdf"; \
		exit 1; \
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

	# If asdf is installed, check the versions of Node.js, Ruby, Cocoapods, Python, and Poetry
	@command -v asdf >/dev/null 2>&1 && ( \
		echo "Node.js version:"; \
		asdf current nodejs | awk '{print $$2}' || echo "Node.js not installed"; \
		echo "Ruby version:"; \
		asdf current ruby | awk '{print $$2}' || echo "Ruby not installed"; \
		echo "Cocoapods version:"; \
		asdf current cocoapods | awk '{print $$2}' || echo "Cocoapods not installed"; \
		echo "Python version:"; \
		asdf current python | awk '{print $$2}' || echo "Python not installed"; \
		echo "Poetry version:"; \
		asdf current poetry | awk '{print $$2}' || echo "Poetry not installed"; \
	) || echo "Skipping version checks for Node.js, Ruby, Cocoapods, Python, and Poetry"

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

# Build pre-built solutions
.PHONY: run-build

# Default rule to run `yarn build` in the root folder
run-build:
	yarn build

# Pattern rule to run `yarn build` in the specified subdirectory
run-build-%:
	TARGET=$* && yarn build

# Define variables
SECRETS := $(shell find apps -mindepth 1 -maxdepth 1 -type d)
SECRET_NAME_PREFIX := dbbs-pre-built-solutions
REGION := eu-central-1
STAGE := local

# Ensure AWS_PROFILE is set by prompting the user
prompt-aws-profile:
	@echo "Please select the AWS profile."
	@read -p "Enter AWS profile: " AWS_PROFILE; \
	if [ -z "$$AWS_PROFILE" ]; then \
	 echo "AWS profile cannot be empty."; \
   exit 1; \
  fi; \
  echo "Selected AWS profile: $$AWS_PROFILE"; \
  export AWS_PROFILE=$$AWS_PROFILE; \
  $(MAKE) after-prompt AWS_PROFILE=$$AWS_PROFILE

 # After prompt target
after-prompt: check-profile check-secrets download-env

# Check if the AWS profile exists
check-profile:
	@echo "Checking if AWS profile '$(AWS_PROFILE)' exists"
	@if aws configure list-profiles | grep -q "^$(AWS_PROFILE)$$"; then \
   echo "AWS profile '$(AWS_PROFILE)' exists"; \
  else \
   echo "AWS profile '$(AWS_PROFILE)' does not exist"; \
   echo "Please set up the AWS profile and credentials by running the following commands:"; \
   echo "1. Configure the profile:"; \
   echo "   aws configure --profile your-aws-profile"; \
   echo "2. Set up the credentials (if needed, open ~/.aws/credentials and add the following):"; \
   echo "   [your-aws-profile]"; \
   echo "   aws_access_key_id = YOUR_ACCESS_KEY_ID"; \
   echo "   aws_secret_access_key = YOUR_SECRET_ACCESS_KEY"; \
   exit 1; \
  fi

# Check if secrets exist for each app
check-secrets:
	@for app in $(SECRETS); do \
   SECRET_NAME=$(SECRET_NAME_PREFIX)/$(STAGE)/$${app}; \
   echo "Checking secret $$SECRET_NAME"; \
   AWS_PROFILE=$(AWS_PROFILE) AWS_REGION=$(REGION) aws secretsmanager get-secret-value --secret-id $$SECRET_NAME > /dev/null 2>&1; \
   if [ $$? -eq 0 ]; then \
    echo "Secret found for $$app"; \
   else \
    echo "Secret not found for $$app"; \
    exit 1; \
   fi \
  done

# Download environment variables
download-env:
	@echo "Downloading environment variables"
	AWS_PROFILE=$(AWS_PROFILE) AWS_REGION=$(REGION) yarn download:env

.PHONY: run-dev

# Default rule to run `yarn dev` in the root folder
run-dev:
	yarn dev

# Pattern rule to run `yarn dev` in the specified subdirectory
run-dev-%:
	TARGET=$* && yarn dev

.PHONY: run-test

# Default rule to run `yarn test` in the root folder
run-test:
	yarn test

# Pattern rule to run `yarn test` in the specified subdirectory
run-test-%:
	TARGET=$* && yarn test

install-gems-%:
	cd apps/$(*F) && bundle install

install-pods-%:
	cd apps/$(*F) && npx pod-install

fastlane-build-%:
	cd apps/$(*F) && bundle exec fastlane $(P) build variant:$(V) type:$(T)

firebase-distribution-%:
	cd apps/$(*F) && bundle exec fastlane $(P) distribution variant:$(V)

beta-distribution-%:
	cd apps/$(*F) && bundle exec fastlane $(P) beta variant:$(V)

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
