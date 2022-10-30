import clear from 'rollup-plugin-clear'
import screeps from 'rollup-plugin-screeps'
import copy from 'rollup-plugin-copy'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json';

// 复制到指定路径
let pluginDeploy = copy({
    targets: [
        {
            src: 'dist/main.js',
            dest: "C:\\Users\\安琦航\\AppData\\Local\\Screeps\\scripts\\screeps.com\\default"
        },
        {
            src: 'dist/main.js.map',
            dest: "C:\\Users\\安琦航\\AppData\\Local\\Screeps\\scripts\\screeps.com\\default",
            rename: name => name + '.map.js',
            transform: contents => `module.exports = ${contents.toString()};`
        }
    ],
    hook: 'writeBundle',
    verbose: true
})

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/main.js',
        format: 'cjs',
        sourcemap: true
    },
    plugins: [
        // 清除上次编译成果
        clear({ targets: ["dist"] }),
        // 打包依赖
        resolve(),
        // 模块化依赖
        commonjs(),
        // 执行上传或者复制
        pluginDeploy,
        json()
    ]
};