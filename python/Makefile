SHELL := /bin/bash

all: setup

# Main target for setting up dependencies
setup:
	make asdf-install
	make check-versions
	make modify-poetry-config
	make install-python-deps

# Installs dependencies via asdf
asdf-install:
	asdf plugin list | grep -q python || asdf plugin add python
	asdf plugin list | grep -q poetry || asdf plugin add poetry

	asdf plugin update --all

	asdf install

	asdf reshim

# Check versions
check-versions:
	# Check if asdf is installed
	@command -v asdf >/dev/null 2>&1 && echo "asdf is installed" || echo "asdf is not installed"

	# If asdf is installed, check the versions of Python and Poetry
	@command -v asdf >/dev/null 2>&1 && ( \
		echo "Python version:"; \
		asdf current python | awk '{print $$2}' || echo "Python not installed"; \
		echo "Poetry version:"; \
		asdf current poetry | awk '{print $$2}' || echo "Poetry not installed"; \
	) || echo "Skipping version checks for Python and Poetry"

# Modify poetry config
modify-poetry-config:
	poetry config virtualenvs.in-project true

# Install python dependencies
install-python-deps:
	npx turbo run install:deps
