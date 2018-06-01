declare module 'lines-parser' {
    export function parse(inputFile: string, outputPath: string): Promise<any>;
}