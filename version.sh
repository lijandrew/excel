#!/bin/bash


##### version.sh
##### For cache busting
##### Sets version query number of file $1 to new version query number $2
##### Matches/substitutes ?version=[0-9]+


### Must be 2 arguments.
if [[ "$#" -ne 2 ]]; then
  echo "version.sh: Usage: ./version.sh [ filename ] [ version (whole number) ]" 1>&2
  exit
fi

### Target file must exist in current directory.
if [[ ! -f "$1" ]]; then
  echo "version.sh: File $1 not found in current directory" 1>&2
  exit
fi

### Version must be a whole number.
if [[ ! "$2" =~ ^[0-9]+$ ]]; then
  echo "version.sh: Version must be a whole number" 1>&2
  exit
fi

### Must be 3 occurrences of version=
COUNT=$(grep -P "\?version=[0-9]+" "$1" | wc -l)
if [[ "$COUNT" -ne 3 ]]; then
  echo "version.sh: $1: Not 3 occurrences of ?version=[0-9]+" 1>&2
  exit
fi

### Perform substitution.
sed -i -r "s/\?version=[0-9]+/\?version=$2/g" "$1"
