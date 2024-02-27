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
install-deps: install-node-modules install-awscli

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
		asdf reshim nodejs; \
		corepack enable; \
		corepack prepare yarn@stable --activate; \
		echo "Yarn has been installed. Please reopen your terminal and check the yarn version with 'yarn -v'."; \
		exit 0; \
	}
	@{ \
		yarn_version=$$(yarn -v); \
		if [ "$$(echo "$$yarn_version 4.0" | awk '{print ($$1 < $$2)}')" -eq 1 ]; then \
			echo "Yarn version $$yarn_version is lower than 4.0. Installing stable version..."; \
			corepack prepare yarn@stable --activate; \
			yarn set version stable; \
			echo "Yarn has been updated to the stable version. Please reopen your terminal and check the yarn version with 'yarn -v'."; \
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
