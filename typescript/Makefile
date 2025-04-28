SHELL := /bin/bash

all: setup

# Main target for setting up dependencies
setup:
	make asdf-install
	make install-node-modules
	make check-versions

# Installs dependencies via asdf
asdf-install:
	asdf plugin list | grep -q nodejs || asdf plugin add nodejs
	asdf plugin list | grep -q ruby || asdf plugin add ruby
	asdf plugin list | grep -q cocoapods || asdf plugin add cocoapods

	asdf plugin update --all

	asdf install

	asdf reshim

install-node-modules:
	make -C .. check-yarn
	make -C .. install-asdf
	yarn

# Check versions
check-versions:
	make -C .. check-yarn
	make -C .. check-brew
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
	) || echo "Skipping version checks for Node.js, Ruby and Cocoapods"
