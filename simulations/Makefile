# This is a Makefile for the project AIDu_skeleton.backend
# system python interpreter. used only to create virtual environment
PY=python3
BIN=.venv/bin
FIND=find


# Source files: *.py
SRC_DIR   := $(addprefix simulations/,$(MODULES))
SRC       := $(foreach sdir,$(SRC_DIR),$(wildcard $(sdir)/*.py))
MAIN      := main.py


help:      ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e "s/\\$$//" | sed -e "s/##//"
	@echo ---         ---------------------------------------------
	@echo ---         prophysik: python main.py --help

install:   ## install new packages
install: .venv

init:   ## initialize the environment
init: .venv
	$(BIN)/pip install --upgrade pip

list:	  ## list the source files
	@echo $(SRC)


.venv:     ## setup the environment
.venv: requirements.txt
	$(PY) -m venv .venv
	$(BIN)/pip install --upgrade -r requirements.txt
	touch .venv

clean:     ## clean up
clean:
	rm -rf .pytest_cache
	$(FIND) . -type f -name '*~' -delete
	$(FIND) . -type f -name '*.pyc' -delete
	$(FIND) . -type d -name '__pycache__' -delete

.PHONY: lint
lint:      ## run flake8
lint: .venv
	$(BIN)/flake8



