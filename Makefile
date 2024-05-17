SHELL := /bin/bash

# Main target for setting up dependencies
setup-dependencies: check-brew asdf-install install-deps

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
	
	asdf plugin update --all

	asdf install
	
	asdf reshim

# Install Node.js modules and AWS CLI
install-deps: install-node-modules install-awscli install-awscli-local install-sst-cli

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
		yarn_version=$$(grep '"packageManager": "yarn@' package.json | sed 's/.*yarn@\(.*\)".*/\1/'); \
		asdf reshim nodejs; \
		corepack enable; \
		corepack prepare yarn@$$yarn_version --activate; \
		echo "Yarn version $$yarn_version has been installed. Please reopen your terminal and check the yarn version with 'yarn -v'."; \
		exit 0; \
	}
	@{ \
		yarn_version=$$(grep '"packageManager": "yarn@' package.json | sed 's/.*yarn@\(.*\)".*/\1/'); \
		current_yarn_version=$$(yarn -v); \
		if [ "$$current_yarn_version" != "$$yarn_version" ]; then \
			echo "Yarn version $$current_yarn_version is not $$yarn_version. Installing version $$yarn_version..."; \
			corepack prepare yarn@$$yarn_version --activate; \
			yarn set version $$yarn_version; \
			echo "Yarn has been updated to version $$yarn_version. Please reopen your terminal and check the yarn version with 'yarn -v'."; \
			exit 0; \
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

# Install SST
install-sst-cli: check-brew
	@echo "Installing SST CLI using Homebrew..."
	@brew install sst/tap/sst
	@command sst version >/dev/null 2>&1 && echo "SST CLI installed successfully" || ( \
		echo "SST CLI installation failed. Please check the Homebrew installation or try installing it manually."; \
		exit 1; \
	)	

# Check versions
check-versions: check-brew check-yarn
	# Check if asdf is installed
	@command -v asdf >/dev/null 2>&1 && echo "asdf is installed" || echo "asdf is not installed"

	# If asdf is installed, check the versions of Node.js, Ruby, and Cocoapods
	@command -v asdf >/dev/null 2>&1 && ( \
		echo "Node.js version:"; \
		asdf current nodejs | awk '{print $$2}' || echo "Node.js not installed"; \
		echo "Ruby version:"; \
		asdf current ruby | awk '{print $$2}' || echo "Ruby not installed"; \
		echo "Cocoapods version:"; \
		asdf current cocoapods | awk '{print $$2}' || echo "Cocoapods not installed"; \
	) || echo "Skipping version checks for Node.js, Ruby, and Cocoapods"

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

localstack-up: local-network-up
	docker compose -f docker-compose/docker-compose.localstack.yml --env-file ./.env --project-name backend-localstack up --build -d
localstack-down: local-network-down
	docker compose -f docker-compose/docker-compose.localstack.yml --env-file ./.env --project-name backend-localstack down

local-network-up:
	docker network create dbb-backend-network || true

local-network-down:
	docker network remove dbb-backend-network || true

set-docker-volume-permissions:
	chmod -R 777 docker-compose/volume
