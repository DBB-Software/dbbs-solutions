SHELL := /bin/bash

setup-mac: setup-mac-asdf install-deps

setup-mac-asdf:

	asdf global nodejs
	asdf global ruby
	asdf global cocoapods

install-deps: install-node-modules install-gems install-pods

install-node-modules:
	npm i

install-gems:
	bundle install

install-pods:
	npx pod-install
