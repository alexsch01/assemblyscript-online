import asc from './assemblyscript/asc.js'

globalThis.print_WasmText = async function() {
    const { stderr, text, binary } = await asc.compileString(globalThis.codeEditor.getValue(), { optimize: 2 });
    const err = stderr.toString();
    if(err != "") {
        document.querySelector('#output').value = err;
        return -1;
    }

    document.querySelector('#output').value = text;
    return binary;
}

globalThis.download_WasmBinary = async function() {
    const binary = await globalThis.print_WasmText()
    if(binary != -1) {
        const blob = new Blob([binary], {type: 'application/wasm'});
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = "module.wasm";
        a.click();
        window.URL.revokeObjectURL(url);
    }
}
