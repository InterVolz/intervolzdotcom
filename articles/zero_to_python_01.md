@@Title: Zero to Python
@@URL: zero-to-python-1
@@Date: 11/15/2023
@@TLDR: set up a new project on a new machine the modern way
@@Tags: py

If you are on a machine where you're unsure about the versions of Python, pip, or other dependencies, you can follow these steps to ensure a smooth installation and setup process:

1. **Check Python installation**: Open a terminal or command prompt and check if Python is installed by running the following command:
    
    ```sh
    python --version
    ```
    
    This will display the installed Python version. If Python is not installed, you'll need to download and install it from the official Python website (https://www.python.org/downloads) and follow the installation instructions specific to your operating system.
    
2. **Check pip installation**: Check if pip, the Python package installer, is installed by running the following command:
    
    ```
    pip --version
    ```
    
    This will display the installed pip version. If pip is not installed or you have an outdated version, you can upgrade it by running the following command:
    
    ```
    python -m pip install --upgrade pip
    ```
    
3. **Install Poetry**: Now that you have Python and pip installed, you can proceed with installing Poetry. Use the following command to install Poetry using pip:
    
    ```
    pip install poetry
    ```
    
4. **Create and navigate to a new project directory**: Create a new directory for your project and navigate to it using the command line. You can use the `mkdir` command to create a directory and the `cd` command to navigate into it. For example:
    
    ```
    mkdir my_project
    cd my_project
    ```
    
5. **Initialize a new Poetry project**: Once inside your project directory, initialize a new Poetry project by running the following command:
    
    ```
    poetry init
    ```
    
    Follow the prompts to enter the details about your project, such as name, version, description, etc. You can press Enter to accept the default values or provide your own.
    
6. **Add and install dependencies**: To add dependencies to your project, you can use the `add` command followed by the package name and optionally the version specifier. For example, to add the requests library, run:
    
    ```
    poetry add requests
    ```
    
    Poetry will automatically resolve and manage the dependencies for your project. The dependencies will be installed within a virtual environment managed by Poetry.
    
7. **Activate the virtual environment**: Poetry automatically creates a virtual environment for your project. To activate it, run the following command:
    
    ```
    poetry shell
    ```
    
    This will activate the virtual environment, and you'll see the command prompt change to indicate that you're working within the virtual environment.
    
    *The first time you do this or after adding new dependencies you need to run*:
    
    ```python
    # On Windows, Start Powershell as Admin
    Invoke-WebRequest -UseBasicParsing -Uri "https://raw.githubusercontent.com/pyenv-win/pyenv-win/master/pyenv-win/install-pyenv-win.ps1" -OutFile "./install-pyenv-win.ps1"; &"./install-pyenv-win.ps1"
    # if that fails run Set-ExecutionPolicy RemoteSigned, and run again
    # re-open Powershell
    
    pyenv install 3.9.8 # example install of new python version
    poetry install
    poetry env use 3.11  # change python versions
    poetry install       # reinstall dependencies
    
    ```
    
8. **Run your project**: You can now run your Python project using the Poetry-managed virtual environment. For example, if your project has an entry point script called `main.py`, you can execute it using the following command:
    
    ```
    python main.py
    ```
    
    Poetry will ensure that your project's dependencies are available and properly configured when running your script.
    

By following these steps, you should be able to install and set up a Python project using Poetry, even on a machine where you are unsure about the versions of Python, pip, or other dependencies.

