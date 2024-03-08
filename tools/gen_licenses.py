#!/usr/bin/python3

#
# setup:
# 1. Install tools 
#    - npm install -g license-checker
# 2. Run script in webapp root dir
#    - ./tools/generate_licenses >{basename outputfile}
#
#
# vim: tabstop=8 expandtab shiftwidth=4 softtabstop=4
#

import sys
import json
import subprocess
import pprint
import re
import urllib
import urllib.request
import urllib.error

ignore_modules = {
    "^kiwi"
}

def print_import_path():
    print("\n".join(sys.path), file=sys.stderr)


def pretty_print(json):
    pp = pprint.PrettyPrinter(indent=4)
    pp.pprint(json)


def strip_line(line):
    l = re.sub("^//\s*", "", line)
    return l.rstrip()


def set_proxy():
    proxy = urllib.request.ProxyHandler({ 'http': '10.158.0.79:80' })
    opener = urllib.request.build_opener(proxy)
    urllib.request.install_opener(opener)


def run_get_stdout(cmd):
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    return proc.stdout.read().decode('utf-8')


def fetch_url(mod,url):
    try:
        req = urllib.request.Request(url)
        response = urllib.request.urlopen(req)
    except urllib.error.HTTPError as e:
        print("Module: {} HTTPError: {}".format(mod,e.code), file=sys.stderr)
    except urllib.error.URLError as e:
        print("Module: {} URLError: {}".format(mod,e.reason), file=sys.stderr)
    except ValueError as e:
        print("Module:{} ValueError: {}".format(mod,e), file=sys.stderr)
    else:
        # We assume plain text files...
        for line in response.read().decode('utf-8').split("\n"):
            print(strip_line(line))


def gen_npm():
    data = json.loads(run_get_stdout(['license-checker', '--json', '--production']))
    for mod, mod_data in sorted(data.items(), key=lambda m: m[0]):
        skip = False
        for im in ignore_modules: 
            if re.search(im,mod):
                skip = True
        if not skip:
            print("<h3>" + mod + "</h3>")
            print("<p><pre>")
            # We assume plain text files...
            with open(mod_data["licenseFile"],encoding='utf-8') as f:
                for line in f:
                    print(strip_line(line))
            print("</pre></p>")


def main():
    #set_proxy()
    gen_npm()


if __name__ == "__main__":
    main()
