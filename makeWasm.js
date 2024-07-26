import asc from './assemblyscript/asc.js'

globalThis.runClick = async function() {
    const { stderr, text, binary } = await asc.compileString(globalThis.codeEditor.getValue(), { optimize: 2 });
    const err = stderr.toString();
    if(err != "") {
        document.querySelector('#output').value = err;
        return;
    }

    document.querySelector('#output').value = text;
    const blob = new Blob([binary], {type: 'application/octet-stream'});
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = "module.wasm";
    a.click();
    window.URL.revokeObjectURL(url);
}