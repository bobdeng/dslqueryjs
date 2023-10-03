import typescript from "@rollup/plugin-typescript";
import {dts} from "rollup-plugin-dts";

export default {
    input: [
        './src/index.ts'
    ],
    output: [{
        file: './dist/library.js',
        format: 'esm'
    }, {file: './dist/index.d.ts', format: 'es'}],
    plugins: [
        typescript(),
        dts()
    ]
};