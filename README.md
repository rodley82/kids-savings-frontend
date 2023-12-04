# Kids Savings

The idea is to store data as JSON on a Google spreadsheet cell and have have it compute/agregate the savings account for a child, for example a parent could grant it's child 5 USD a week

There's a process that is executed periodically gets the cell data, creates to json files and stores/copies somewhere so that it's publicly accessible.

- `instructions.json` contains a json with one key namely `question` and a string that is the security question for the child, for example: "what is the name of your cousin's pet?"
- Assuming the answer is `lola` the backend will create a JSON file with the data from the spreadsheet using a command like this:

```
echo -n "lola" | sha256sum --text 
47acf82a48cfa5c340ea536cdd66c75ef85eb8d3fcff468fc7c8abcaceb15ed0  -
```

The filename in this case will be: `47acf82a48cfa5c340ea536cdd66c75ef85eb8d3fcff468fc7c8abcaceb15ed0.json` and this frontend app will show the question, ask for the answer and out of that answer it'll compute that sha256sum and attempt to fetch that file from the base URL

## Building

Set these two env variables beforehand:

- `VITE_BASE_DATA_FILES_ENDPOINT`
With the base url without the trailing `/` => to be used to reach the json files, for example if set to https://www.google.com then https://www.google.com/instructions.json will be used
- `VITE_ACCOUNT_NAME` Name of the child
- `VITE_FRONT_IMAGE_URL` An absolute URL to customize the image in the center, can be an animated gif

For example:

```
VITE_BASE_DATA_FILES_ENDPOINT=https://www.google.com VITE_ACCOUNT_NAME=Juan VITE_FRONT_IMAGE_URL=https://images.com/background.gif yarn run build
```
