import asc from './assemblyscript/asc.js'

function generateWasm(arg) {
    document.querySelector('#output').value = ''

    const cmd = 'module.ts --textFile module.wat ' + document.querySelector('[id="promptInput"]').value.trim()
    const outputs = {}
    const config = {
        readFile: (name) => {
            switch(name) {
                case 'asconfig.json': return '{}'
                case 'module.ts': return globalThis.codeEditor.getValue()
            }
        },
        writeFile: (name, contents) => { outputs[name] = contents },
        listFiles: () => null,
    }
    const options = cmd.split(' ')
    const wasmBinaryFile = options[options.indexOf('--outFile')+1]

    asc.main(options, config).then(({ stderr }) => {
        const error = stderr.toString()
        if(error != '') {
            document.querySelector('#output').value = error
            return
        }
        document.querySelector('#output').value = outputs['module.wat']

        if(arg == 'binary') {
            const binary = outputs[wasmBinaryFile]
            const blob = new Blob([binary], {type: 'application/wasm'})
            const url = URL.createObjectURL(blob)

            const a = document.createElement('a')
            document.body.appendChild(a)
            a.href = url
            a.download = wasmBinaryFile
            a.click()
            URL.revokeObjectURL(url)
            a.remove()
        }
    })
}

globalThis.WasmText = () => generateWasm('text')
globalThis.WasmBinary = () => generateWasm('binary')
