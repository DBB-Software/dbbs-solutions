SHELL := /bin/bash

# Java version from .tool-versions
JAVA_VERSION := $(shell set -e; grep "^java" .tool-versions | cut -d' ' -f2 | tr -d '\n')
FLUTTER_VERSION := $(shell set -e; grep "^flutter" .tool-versions | cut -d' ' -f2 | tr -d '\n')

all: setup

# Main target for setting up dependencies
setup:
	make asdf-install
	make check-jdk
	make check-versions
	sh ./../scripts/flutter-mobile-env.sh

# Install dependencies for Flutter
install-flutter-dependencies:
	@echo "Installing Flutter version $(FLUTTER_VERSION) via fvm..."
	@command -v fvm >/dev/null 2>&1 || (brew tap leoafarias/fvm && brew install fvm)
	fvm install $(FLUTTER_VERSION)
	fvm use $(FLUTTER_VERSION)
	
	@echo "Flutter installed successfully."
	fvm flutter doctor

# Installs dependencies via asdf
asdf-install:
	asdf plugin list | grep -q ruby || asdf plugin add ruby
	asdf plugin list | grep -q cocoapods || asdf plugin add cocoapods
	# asdf plugin list | grep -q dart || asdf plugin add dart
	asdf plugin list | grep -q flutter || asdf plugin add flutter

	asdf plugin update --all

	asdf install ruby
	asdf install cocoapods
	# asdf install dart
	asdf install flutter

	asdf reshim

# Check if Java is installed and meets the required version
check-jdk:
	current_version=$$(java -version 2>&1 | awk -F '"' '/version/ {print $$2}' | sed 's/^1\.//; s/\..*//'); \
	echo "Current Java version: $$current_version"; \
	echo "Required Java version: $(JAVA_VERSION)"; \
	if [ -z "$$current_version" ] || [ "$$current_version" != "$(JAVA_VERSION)" ]; then \
		echo "Java version mismatch. Installing Java $(JAVA_VERSION)..."; \
		if [[ "$$(uname)" == "Darwin" ]]; then \
			brew install openjdk@$(JAVA_VERSION); \
			sudo ln -sfn /usr/local/opt/openjdk@$(JAVA_VERSION)/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk.jdk; \
		elif [[ "$$(uname)" == "Linux" ]]; then \
			sudo apt-get update; \
			sudo apt-get install -y openjdk-$(JAVA_VERSION)-jdk; \
		fi; \
	else \
		echo "Java version $$current_version matches the required version $(JAVA_VERSION)."; \
	fi

# Check versions
check-versions:
	# Check if asdf is installed
	@command -v asdf >/dev/null 2>&1 && echo "asdf is installed" || echo "asdf is not installed"

	# If asdf is installed, check all tool versions
	@command -v asdf >/dev/null 2>&1 && ( \
		echo "Flutter version:"; \
		flutter --version | awk '{print $$2}' || echo "Flutter not installed"; \
		echo "Java version:"; \
		java --version | awk '{print $$2}' || echo "Java not installed"; \
		echo "Ruby version:"; \
		asdf current ruby | awk '{print $$2}' || echo "Ruby not installed"; \
		echo "Cocoapods version:"; \
		asdf current cocoapods | awk '{print $$2}' || echo "Cocoapods not installed"; \
	) || echo "Skipping version checks as asdf is not installed"

# Create a new Flutter app
create-app:
	@read -p "Enter organization name: " org_name; \
	@read -p "Enter app name: " app_name; \
	flutter create --org com.$(org_name) --project-name $$app_name apps/$$app_name; \
	echo "Flutter app '$$app_name' created in apps/$$app_name"

# Configure the Flutter firebase app
configure-firebase:
	@if ! firebase login:list | grep -q "No users are currently logged in"; then \
		echo "Firebase: user already logged in, skipping login"; \
	else \
		echo "Firebase: requires login"; \
		firebase login; \
	fi
	cd apps/$(FOLDER) && flutterfire configure
