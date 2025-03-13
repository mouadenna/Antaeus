import subprocess

def run_script(script_name, *args):
    command = ["python", script_name] + list(args)
    subprocess.run(command, check=True)

def main(args):
    # Run localization scripts
    run_script("predict34_loc.py", *args)
    run_script("predict50_loc.py", *args)
    run_script("predict92_loc.py", *args)
    run_script("predict154_loc.py", *args)

    # Run classification scripts
    for i in range(3):
        run_script("predict34cls.py", str(i), *args)
        run_script("predict50cls.py", str(i), *args)
        run_script("predict92cls.py", str(i), *args)
        run_script("predict154cls.py", str(i), *args)

    # Create submission
    run_script("create_submission.py", *args)
    print("submission created!")

if __name__ == "__main__":
    import sys
    main(sys.argv[1:])
