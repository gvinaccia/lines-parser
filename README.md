# Lines Parser

an unofficial parser for .lines binary files for [reMarkable paper tablet](https://remarkable.com/)

currently only a basic renderer works but the output is usable

## Installing

the package is available on npm, you can install either via **npm**: `npm install lines-parser` or **yarn**: `yarn add lines-parser`


## How to use

the following command will parse the file at *linesFilePath* and create a png for each page in the file in the directory specified by *outputPath*, the promise returned will resolve an object for each page

```js
parse(linesFilePath, outputPath)
    .then(result => {
        for (const page of result.paths) {
            console.log(page.path);
        }
    })
```

## Todo

- [ ] page templates
- [ ] handling pressure for lines
- [ ] stroke texturing
- [ ] ...

## Credits

thanks to [@ax3l](https://github.com/ax3l) for the [great article](https://plasma.ninja/blog/devices/remarkable/binary/format/2017/12/26/reMarkable-lines-file-format.html)
