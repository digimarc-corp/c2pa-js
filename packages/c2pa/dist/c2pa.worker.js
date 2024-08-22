
/*!*************************************************************************
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. 
 **************************************************************************/

(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    /**
     * Copyright 2023 Adobe
     * All Rights Reserved.
     *
     * NOTICE: Adobe permits you to use, modify, and distribute this file in
     * accordance with the terms of the Adobe license agreement accompanying
     * it.
     */
    // From https://github.com/josdejong/workerpool/blob/master/src/worker.js#L76-L83
    function serializeError(error) {
        return Object.getOwnPropertyNames(error).reduce(function (product, name) {
            return Object.defineProperty(product, name, {
                value: error[name],
                enumerable: true,
            });
        }, {});
    }

    /**
     * Copyright 2023 Adobe
     * All Rights Reserved.
     *
     * NOTICE: Adobe permits you to use, modify, and distribute this file in
     * accordance with the terms of the Adobe license agreement accompanying
     * it.
     */
    function setupWorker(methods) {
        onmessage = async (e) => {
            const { args, method } = e.data;
            try {
                const res = await methods[method](...args);
                postMessage({
                    type: 'success',
                    data: res,
                });
            }
            catch (error) {
                postMessage({
                    type: 'error',
                    error: serializeError(error),
                });
            }
        };
    }

    let wasm$1;

    const cachedTextDecoder$1 = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

    cachedTextDecoder$1.decode();

    let cachedUint8Memory0 = new Uint8Array();

    function getUint8Memory0() {
        if (cachedUint8Memory0.byteLength === 0) {
            cachedUint8Memory0 = new Uint8Array(wasm$1.memory.buffer);
        }
        return cachedUint8Memory0;
    }

    function getStringFromWasm0$1(ptr, len) {
        return cachedTextDecoder$1.decode(getUint8Memory0().subarray(ptr, ptr + len));
    }

    let WASM_VECTOR_LEN$1 = 0;

    const cachedTextEncoder$1 = new TextEncoder('utf-8');

    const encodeString$1 = (typeof cachedTextEncoder$1.encodeInto === 'function'
        ? function (arg, view) {
        return cachedTextEncoder$1.encodeInto(arg, view);
    }
        : function (arg, view) {
        const buf = cachedTextEncoder$1.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    });

    function passStringToWasm0$1(arg, malloc, realloc) {

        if (realloc === undefined) {
            const buf = cachedTextEncoder$1.encode(arg);
            const ptr = malloc(buf.length);
            getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
            WASM_VECTOR_LEN$1 = buf.length;
            return ptr;
        }

        let len = arg.length;
        let ptr = malloc(len);

        const mem = getUint8Memory0();

        let offset = 0;

        for (; offset < len; offset++) {
            const code = arg.charCodeAt(offset);
            if (code > 0x7F) break;
            mem[ptr + offset] = code;
        }

        if (offset !== len) {
            if (offset !== 0) {
                arg = arg.slice(offset);
            }
            ptr = realloc(ptr, len, len = offset + arg.length * 3);
            const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
            const ret = encodeString$1(arg, view);

            offset += ret.written;
        }

        WASM_VECTOR_LEN$1 = offset;
        return ptr;
    }

    function isLikeNone$1(x) {
        return x === undefined || x === null;
    }

    let cachedInt32Memory0 = new Int32Array();

    function getInt32Memory0() {
        if (cachedInt32Memory0.byteLength === 0) {
            cachedInt32Memory0 = new Int32Array(wasm$1.memory.buffer);
        }
        return cachedInt32Memory0;
    }

    let cachedFloat64Memory0 = new Float64Array();

    function getFloat64Memory0() {
        if (cachedFloat64Memory0.byteLength === 0) {
            cachedFloat64Memory0 = new Float64Array(wasm$1.memory.buffer);
        }
        return cachedFloat64Memory0;
    }

    function debugString$1(val) {
        // primitive types
        const type = typeof val;
        if (type == 'number' || type == 'boolean' || val == null) {
            return  `${val}`;
        }
        if (type == 'string') {
            return `"${val}"`;
        }
        if (type == 'symbol') {
            const description = val.description;
            if (description == null) {
                return 'Symbol';
            } else {
                return `Symbol(${description})`;
            }
        }
        if (type == 'function') {
            const name = val.name;
            if (typeof name == 'string' && name.length > 0) {
                return `Function(${name})`;
            } else {
                return 'Function';
            }
        }
        // objects
        if (Array.isArray(val)) {
            const length = val.length;
            let debug = '[';
            if (length > 0) {
                debug += debugString$1(val[0]);
            }
            for(let i = 1; i < length; i++) {
                debug += ', ' + debugString$1(val[i]);
            }
            debug += ']';
            return debug;
        }
        // Test for built-in
        const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
        let className;
        if (builtInMatches.length > 1) {
            className = builtInMatches[1];
        } else {
            // Failed to match the standard '[object ClassName]'
            return toString.call(val);
        }
        if (className == 'Object') {
            // we're a user defined class or Object
            // JSON.stringify avoids problems with cycles, and is generally much
            // easier than looping through ownProperties of `val`.
            try {
                return 'Object(' + JSON.stringify(val) + ')';
            } catch (_) {
                return 'Object';
            }
        }
        // errors
        if (val instanceof Error) {
            return `${val.name}: ${val.message}\n${val.stack}`;
        }
        // TODO we could test for more things here, like `Set`s and `Map`s.
        return className;
    }

    function takeFromExternrefTable0(idx) {
        const value = wasm$1.__wbindgen_export_2.get(idx);
        wasm$1.__externref_table_dealloc(idx);
        return value;
    }
    /**
    * @param {any} buf
    * @returns {number}
    */
    function scan_array_buffer(buf) {
        try {
            const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
            wasm$1.scan_array_buffer(retptr, buf);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeFromExternrefTable0(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm$1.__wbindgen_add_to_stack_pointer(16);
        }
    }

    async function load(module, imports) {
        if (typeof Response === 'function' && module instanceof Response) {
            if (typeof WebAssembly.instantiateStreaming === 'function') {
                try {
                    return await WebAssembly.instantiateStreaming(module, imports);

                } catch (e) {
                    if (module.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                    } else {
                        throw e;
                    }
                }
            }

            const bytes = await module.arrayBuffer();
            return await WebAssembly.instantiate(bytes, imports);

        } else {
            const instance = await WebAssembly.instantiate(module, imports);

            if (instance instanceof WebAssembly.Instance) {
                return { instance, module };

            } else {
                return instance;
            }
        }
    }

    function getImports() {
        const imports = {};
        imports.wbg = {};
        imports.wbg.__wbg_isArray_27c46c67f498e15d = function(arg0) {
            const ret = Array.isArray(arg0);
            return ret;
        };
        imports.wbg.__wbg_length_6e3bbe7c8bd4dbd8 = function(arg0) {
            const ret = arg0.length;
            return ret;
        };
        imports.wbg.__wbg_get_57245cc7d7c7619d = function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        };
        imports.wbg.__wbg_isSafeInteger_dfa0593e8d7ac35a = function(arg0) {
            const ret = Number.isSafeInteger(arg0);
            return ret;
        };
        imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
            const ret = getStringFromWasm0$1(arg0, arg1);
            return ret;
        };
        imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
            const ret = new Error();
            return ret;
        };
        imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
            const ret = arg1.stack;
            const ptr0 = passStringToWasm0$1(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN$1;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        };
        imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
            try {
                console.error(getStringFromWasm0$1(arg0, arg1));
            } finally {
                wasm$1.__wbindgen_free(arg0, arg1);
            }
        };
        imports.wbg.__wbg_length_9e1ae1900cb0fbd5 = function(arg0) {
            const ret = arg0.length;
            return ret;
        };
        imports.wbg.__wbindgen_memory = function() {
            const ret = wasm$1.memory;
            return ret;
        };
        imports.wbg.__wbg_buffer_3f3d764d4747d564 = function(arg0) {
            const ret = arg0.buffer;
            return ret;
        };
        imports.wbg.__wbg_new_8c3f0052272a457a = function(arg0) {
            const ret = new Uint8Array(arg0);
            return ret;
        };
        imports.wbg.__wbg_set_83db9690f9353e79 = function(arg0, arg1, arg2) {
            arg0.set(arg1, arg2 >>> 0);
        };
        imports.wbg.__wbg_instanceof_Uint8Array_971eeda69eb75003 = function(arg0) {
            let result;
            try {
                result = arg0 instanceof Uint8Array;
            } catch {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_instanceof_ArrayBuffer_e5e48f4762c5610b = function(arg0) {
            let result;
            try {
                result = arg0 instanceof ArrayBuffer;
            } catch {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
            const ret = arg0 == arg1;
            return ret;
        };
        imports.wbg.__wbindgen_boolean_get = function(arg0) {
            const v = arg0;
            const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
            return ret;
        };
        imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr0 = isLikeNone$1(ret) ? 0 : passStringToWasm0$1(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN$1;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        };
        imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'number' ? obj : undefined;
            getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone$1(ret) ? 0 : ret;
            getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone$1(ret);
        };
        imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
            const ret = new Error(getStringFromWasm0$1(arg0, arg1));
            return ret;
        };
        imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
            const ret = debugString$1(arg1);
            const ptr0 = passStringToWasm0$1(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN$1;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        };
        imports.wbg.__wbindgen_throw = function(arg0, arg1) {
            throw new Error(getStringFromWasm0$1(arg0, arg1));
        };
        imports.wbg.__wbindgen_init_externref_table = function() {
            const table = wasm$1.__wbindgen_export_2;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        };

        return imports;
    }

    function finalizeInit(instance, module) {
        wasm$1 = instance.exports;
        init.__wbindgen_wasm_module = module;
        cachedFloat64Memory0 = new Float64Array();
        cachedInt32Memory0 = new Int32Array();
        cachedUint8Memory0 = new Uint8Array();

        wasm$1.__wbindgen_start();
        return wasm$1;
    }

    async function init(input) {
        if (typeof input === 'undefined') {
            input = new URL('detector_bg.wasm', (typeof document === 'undefined' && typeof location === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : typeof document === 'undefined' ? location.href : (document.currentScript && document.currentScript.src || new URL('c2pa.worker.js', document.baseURI).href)));
        }
        const imports = getImports();

        if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
            input = fetch(input);
        }

        const { instance, module } = await load(await input, imports);

        return finalizeInit(instance, module);
    }

    let wasm;

    const heap = new Array(128).fill(undefined);

    heap.push(undefined, null, true, false);

    function getObject(idx) { return heap[idx]; }

    let heap_next = heap.length;

    function dropObject(idx) {
        if (idx < 132) return;
        heap[idx] = heap_next;
        heap_next = idx;
    }

    function takeObject(idx) {
        const ret = getObject(idx);
        dropObject(idx);
        return ret;
    }

    const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

    if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); }
    let cachedUint8ArrayMemory0 = null;

    function getUint8ArrayMemory0() {
        if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
            cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
        }
        return cachedUint8ArrayMemory0;
    }

    function getStringFromWasm0(ptr, len) {
        ptr = ptr >>> 0;
        return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
    }

    function addHeapObject(obj) {
        if (heap_next === heap.length) heap.push(heap.length + 1);
        const idx = heap_next;
        heap_next = heap[idx];

        heap[idx] = obj;
        return idx;
    }

    function isLikeNone(x) {
        return x === undefined || x === null;
    }

    let cachedDataViewMemory0 = null;

    function getDataViewMemory0() {
        if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
            cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
        }
        return cachedDataViewMemory0;
    }

    let WASM_VECTOR_LEN = 0;

    const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

    const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
        ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
    }
        : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    });

    function passStringToWasm0(arg, malloc, realloc) {

        if (realloc === undefined) {
            const buf = cachedTextEncoder.encode(arg);
            const ptr = malloc(buf.length, 1) >>> 0;
            getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
            WASM_VECTOR_LEN = buf.length;
            return ptr;
        }

        let len = arg.length;
        let ptr = malloc(len, 1) >>> 0;

        const mem = getUint8ArrayMemory0();

        let offset = 0;

        for (; offset < len; offset++) {
            const code = arg.charCodeAt(offset);
            if (code > 0x7F) break;
            mem[ptr + offset] = code;
        }

        if (offset !== len) {
            if (offset !== 0) {
                arg = arg.slice(offset);
            }
            ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
            const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
            const ret = encodeString(arg, view);

            offset += ret.written;
            ptr = realloc(ptr, len, offset, 1) >>> 0;
        }

        WASM_VECTOR_LEN = offset;
        return ptr;
    }

    function debugString(val) {
        // primitive types
        const type = typeof val;
        if (type == 'number' || type == 'boolean' || val == null) {
            return  `${val}`;
        }
        if (type == 'string') {
            return `"${val}"`;
        }
        if (type == 'symbol') {
            const description = val.description;
            if (description == null) {
                return 'Symbol';
            } else {
                return `Symbol(${description})`;
            }
        }
        if (type == 'function') {
            const name = val.name;
            if (typeof name == 'string' && name.length > 0) {
                return `Function(${name})`;
            } else {
                return 'Function';
            }
        }
        // objects
        if (Array.isArray(val)) {
            const length = val.length;
            let debug = '[';
            if (length > 0) {
                debug += debugString(val[0]);
            }
            for(let i = 1; i < length; i++) {
                debug += ', ' + debugString(val[i]);
            }
            debug += ']';
            return debug;
        }
        // Test for built-in
        const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
        let className;
        if (builtInMatches.length > 1) {
            className = builtInMatches[1];
        } else {
            // Failed to match the standard '[object ClassName]'
            return toString.call(val);
        }
        if (className == 'Object') {
            // we're a user defined class or Object
            // JSON.stringify avoids problems with cycles, and is generally much
            // easier than looping through ownProperties of `val`.
            try {
                return 'Object(' + JSON.stringify(val) + ')';
            } catch (_) {
                return 'Object';
            }
        }
        // errors
        if (val instanceof Error) {
            return `${val.name}: ${val.message}\n${val.stack}`;
        }
        // TODO we could test for more things here, like `Set`s and `Map`s.
        return className;
    }

    const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(state => {
        wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b);
    });

    function makeMutClosure(arg0, arg1, dtor, f) {
        const state = { a: arg0, b: arg1, cnt: 1, dtor };
        const real = (...args) => {
            // First up with a closure we increment the internal reference
            // count. This ensures that the Rust closure environment won't
            // be deallocated while we're invoking it.
            state.cnt++;
            const a = state.a;
            state.a = 0;
            try {
                return f(a, state.b, ...args);
            } finally {
                if (--state.cnt === 0) {
                    wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);
                    CLOSURE_DTORS.unregister(state);
                } else {
                    state.a = a;
                }
            }
        };
        real.original = state;
        CLOSURE_DTORS.register(real, state, state);
        return real;
    }
    function __wbg_adapter_42(arg0, arg1, arg2) {
        wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h938fa17df7c25128(arg0, arg1, addHeapObject(arg2));
    }

    /**
    * @param {any} buf
    * @param {string} mime_type
    * @param {string | undefined} [settings]
    * @returns {Promise<any>}
    */
    function getManifestStoreFromArrayBuffer(buf, mime_type, settings) {
        const ptr0 = passStringToWasm0(mime_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(settings) ? 0 : passStringToWasm0(settings, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        const ret = wasm.getManifestStoreFromArrayBuffer(addHeapObject(buf), ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }

    /**
    * @param {any} manifest_buffer
    * @param {any} asset_buffer
    * @param {string} mime_type
    * @param {string | undefined} [settings]
    * @returns {Promise<any>}
    */
    function getManifestStoreFromManifestAndAsset(manifest_buffer, asset_buffer, mime_type, settings) {
        const ptr0 = passStringToWasm0(mime_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(settings) ? 0 : passStringToWasm0(settings, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        const ret = wasm.getManifestStoreFromManifestAndAsset(addHeapObject(manifest_buffer), addHeapObject(asset_buffer), ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }

    function handleError(f, args) {
        try {
            return f.apply(this, args);
        } catch (e) {
            wasm.__wbindgen_exn_store(addHeapObject(e));
        }
    }
    function __wbg_adapter_112(arg0, arg1, arg2, arg3) {
        wasm.wasm_bindgen__convert__closures__invoke2_mut__h3c978312d1805fe6(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
    }

    async function __wbg_load(module, imports) {
        if (typeof Response === 'function' && module instanceof Response) {
            if (typeof WebAssembly.instantiateStreaming === 'function') {
                try {
                    return await WebAssembly.instantiateStreaming(module, imports);

                } catch (e) {
                    if (module.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                    } else {
                        throw e;
                    }
                }
            }

            const bytes = await module.arrayBuffer();
            return await WebAssembly.instantiate(bytes, imports);

        } else {
            const instance = await WebAssembly.instantiate(module, imports);

            if (instance instanceof WebAssembly.Instance) {
                return { instance, module };

            } else {
                return instance;
            }
        }
    }

    function __wbg_get_imports() {
        const imports = {};
        imports.wbg = {};
        imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
            takeObject(arg0);
        };
        imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
            const ret = getStringFromWasm0(arg0, arg1);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_debug_43439dcee3466420 = function(arg0, arg1) {
            console.debug(getObject(arg0), getObject(arg1));
        };
        imports.wbg.__wbg_Window_d319be8204f8a682 = function(arg0) {
            const ret = getObject(arg0).Window;
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_is_undefined = function(arg0) {
            const ret = getObject(arg0) === undefined;
            return ret;
        };
        imports.wbg.__wbg_crypto_9d63c6bc9b9f9772 = function() { return handleError(function (arg0) {
            const ret = getObject(arg0).crypto;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_WorkerGlobalScope_2552e4d472170e3f = function(arg0) {
            const ret = getObject(arg0).WorkerGlobalScope;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_crypto_392f783a590aa184 = function() { return handleError(function (arg0) {
            const ret = getObject(arg0).crypto;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_subtle_26c17db3161dabc0 = function(arg0) {
            const ret = getObject(arg0).subtle;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_new_525245e2b9901204 = function() {
            const ret = new Object();
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_new_a220cf903aa02ca2 = function() {
            const ret = new Array();
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_push_37c89022f34c01ca = function(arg0, arg1) {
            const ret = getObject(arg0).push(getObject(arg1));
            return ret;
        };
        imports.wbg.__wbg_verify_54de2b4adbaa8a97 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = getObject(arg0).verify(getObject(arg1), getObject(arg2), getObject(arg3), getObject(arg4));
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbindgen_is_falsy = function(arg0) {
            const ret = !getObject(arg0);
            return ret;
        };
        imports.wbg.__wbg_newwithlength_ec548f448387c968 = function(arg0) {
            const ret = new Uint8Array(arg0 >>> 0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_length_8339fcf5d8ecd12e = function(arg0) {
            const ret = getObject(arg0).length;
            return ret;
        };
        imports.wbg.__wbg_set_d1e79e2388520f18 = function(arg0, arg1, arg2) {
            getObject(arg0).set(getObject(arg1), arg2 >>> 0);
        };
        imports.wbg.__wbg_buffer_0710d1b9dbe2eea6 = function(arg0) {
            const ret = getObject(arg0).buffer;
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_number_new = function(arg0) {
            const ret = arg0;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_set_673dda6c73d19609 = function(arg0, arg1, arg2) {
            getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
        };
        imports.wbg.__wbg_new_8608a2b51a5f6737 = function() {
            const ret = new Map();
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_set_f975102236d3c502 = function(arg0, arg1, arg2) {
            getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
        };
        imports.wbg.__wbg_set_49185437f0ab06f8 = function(arg0, arg1, arg2) {
            const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_is_string = function(arg0) {
            const ret = typeof(getObject(arg0)) === 'string';
            return ret;
        };
        imports.wbg.__wbg_now_b7a162010a9e75b4 = function() {
            const ret = Date.now();
            return ret;
        };
        imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
            const ret = new Error(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_String_b9412f8799faab3e = function(arg0, arg1) {
            const ret = String(getObject(arg1));
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_new_796382978dfd4fb0 = function(arg0, arg1) {
            const ret = new Error(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_setname_ef058a4c6ff7e6d4 = function(arg0, arg1, arg2) {
            getObject(arg0).name = getStringFromWasm0(arg1, arg2);
        };
        imports.wbg.__wbg_new_b85e72ed1bfd57f9 = function(arg0, arg1) {
            try {
                var state0 = {a: arg0, b: arg1};
                var cb0 = (arg0, arg1) => {
                    const a = state0.a;
                    state0.a = 0;
                    try {
                        return __wbg_adapter_112(a, state0.b, arg0, arg1);
                    } finally {
                        state0.a = a;
                    }
                };
                const ret = new Promise(cb0);
                return addHeapObject(ret);
            } finally {
                state0.a = state0.b = 0;
            }
        };
        imports.wbg.__wbg_new_ea1883e1e5e86686 = function(arg0) {
            const ret = new Uint8Array(getObject(arg0));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_from_0791d740a9d37830 = function(arg0) {
            const ret = Array.from(getObject(arg0));
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
            const ret = BigInt.asUintN(64, arg0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_isArray_8364a5371e9737d8 = function(arg0) {
            const ret = Array.isArray(getObject(arg0));
            return ret;
        };
        imports.wbg.__wbg_length_ae22078168b726f5 = function(arg0) {
            const ret = getObject(arg0).length;
            return ret;
        };
        imports.wbg.__wbg_get_3baa728f9d58d3f6 = function(arg0, arg1) {
            const ret = getObject(arg0)[arg1 >>> 0];
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_isSafeInteger_7f1ed56200d90674 = function(arg0) {
            const ret = Number.isSafeInteger(getObject(arg0));
            return ret;
        };
        imports.wbg.__wbindgen_as_number = function(arg0) {
            const ret = +getObject(arg0);
            return ret;
        };
        imports.wbg.__wbg_new0_65387337a95cf44d = function() {
            const ret = new Date();
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_getTime_91058879093a1589 = function(arg0) {
            const ret = getObject(arg0).getTime();
            return ret;
        };
        imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
            const ret = new Error();
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
            const ret = getObject(arg1).stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            }
        };
        imports.wbg.__wbg_crypto_1d1f22824a6a080c = function(arg0) {
            const ret = getObject(arg0).crypto;
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_is_object = function(arg0) {
            const val = getObject(arg0);
            const ret = typeof(val) === 'object' && val !== null;
            return ret;
        };
        imports.wbg.__wbg_process_4a72847cc503995b = function(arg0) {
            const ret = getObject(arg0).process;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_versions_f686565e586dd935 = function(arg0) {
            const ret = getObject(arg0).versions;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_node_104a2ff8d6ea03a2 = function(arg0) {
            const ret = getObject(arg0).node;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_require_cca90b1a94a0255b = function() { return handleError(function () {
            const ret = module.require;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbindgen_is_function = function(arg0) {
            const ret = typeof(getObject(arg0)) === 'function';
            return ret;
        };
        imports.wbg.__wbg_msCrypto_eb05e62b530a1508 = function(arg0) {
            const ret = getObject(arg0).msCrypto;
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_memory = function() {
            const ret = wasm.memory;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_buffer_b7b08af79b0b0974 = function(arg0) {
            const ret = getObject(arg0).buffer;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_newwithbyteoffsetandlength_8a2cb9ca96b27ec9 = function(arg0, arg1, arg2) {
            const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_randomFillSync_5c9c955aa56b6049 = function() { return handleError(function (arg0, arg1) {
            getObject(arg0).randomFillSync(takeObject(arg1));
        }, arguments) };
        imports.wbg.__wbg_subarray_7c2e3576afe181d1 = function(arg0, arg1, arg2) {
            const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_getRandomValues_3aa56aa6edec874c = function() { return handleError(function (arg0, arg1) {
            getObject(arg0).getRandomValues(getObject(arg1));
        }, arguments) };
        imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
            const ret = getObject(arg0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_call_89af060b4e1523f2 = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_set_eacc7d73fefaafdf = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
            return ret;
        }, arguments) };
        imports.wbg.__wbg_self_3093d5d1f7bcb682 = function() { return handleError(function () {
            const ret = self.self;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_window_3bcfc4d31bc012f8 = function() { return handleError(function () {
            const ret = window.window;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_globalThis_86b222e13bdf32ed = function() { return handleError(function () {
            const ret = globalThis.globalThis;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_global_e5a3fe56f8be9485 = function() { return handleError(function () {
            const ret = global.global;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_newnoargs_76313bd6ff35d0f2 = function(arg0, arg1) {
            const ret = new Function(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_call_1084a111329e68ce = function() { return handleError(function (arg0, arg1) {
            const ret = getObject(arg0).call(getObject(arg1));
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
            const ret = getObject(arg0) == getObject(arg1);
            return ret;
        };
        imports.wbg.__wbindgen_boolean_get = function(arg0) {
            const v = getObject(arg0);
            const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
            return ret;
        };
        imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
            const obj = getObject(arg1);
            const ret = typeof(obj) === 'number' ? obj : undefined;
            getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
        };
        imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
            const obj = getObject(arg1);
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_instanceof_Uint8Array_247a91427532499e = function(arg0) {
            let result;
            try {
                result = getObject(arg0) instanceof Uint8Array;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_instanceof_ArrayBuffer_61dfc3198373c902 = function(arg0) {
            let result;
            try {
                result = getObject(arg0) instanceof ArrayBuffer;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
            const ret = debugString(getObject(arg1));
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbindgen_throw = function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        };
        imports.wbg.__wbg_then_95e6edc0f89b73b1 = function(arg0, arg1) {
            const ret = getObject(arg0).then(getObject(arg1));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_queueMicrotask_12a30234db4045d3 = function(arg0) {
            queueMicrotask(getObject(arg0));
        };
        imports.wbg.__wbg_then_876bb3c633745cc6 = function(arg0, arg1, arg2) {
            const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_queueMicrotask_48421b3cc9052b68 = function(arg0) {
            const ret = getObject(arg0).queueMicrotask;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_resolve_570458cb99d56a43 = function(arg0) {
            const ret = Promise.resolve(getObject(arg0));
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_cb_drop = function(arg0) {
            const obj = takeObject(arg0).original;
            if (obj.cnt-- == 1) {
                obj.a = 0;
                return true;
            }
            const ret = false;
            return ret;
        };
        imports.wbg.__wbg_debug_d7780810b3a93632 = function(arg0, arg1, arg2, arg3) {
            console.debug(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
        };
        imports.wbg.__wbg_error_f02f3d66b42c6251 = function(arg0, arg1, arg2, arg3) {
            console.error(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
        };
        imports.wbg.__wbg_info_123d8c35ec14384a = function(arg0, arg1, arg2, arg3) {
            console.info(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
        };
        imports.wbg.__wbg_log_22aecf4cc2edc319 = function(arg0, arg1, arg2, arg3) {
            console.log(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
        };
        imports.wbg.__wbg_warn_60924fcf321399f0 = function(arg0, arg1, arg2, arg3) {
            console.warn(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
        };
        imports.wbg.__wbg_importKey_d8409a00b24b3452 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            const ret = getObject(arg0).importKey(getStringFromWasm0(arg1, arg2), getObject(arg3), getObject(arg4), arg5 !== 0, getObject(arg6));
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbindgen_closure_wrapper5569 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 297, __wbg_adapter_42);
            return addHeapObject(ret);
        };

        return imports;
    }

    function __wbg_finalize_init(instance, module) {
        wasm = instance.exports;
        __wbg_init.__wbindgen_wasm_module = module;
        cachedDataViewMemory0 = null;
        cachedUint8ArrayMemory0 = null;


        wasm.__wbindgen_start();
        return wasm;
    }

    async function __wbg_init(module_or_path) {
        if (wasm !== undefined) return wasm;


        if (typeof module_or_path !== 'undefined' && Object.getPrototypeOf(module_or_path) === Object.prototype)
        ({module_or_path} = module_or_path);
        else
        console.warn('using deprecated parameters for the initialization function; pass a single object instead');

        if (typeof module_or_path === 'undefined') {
            module_or_path = new URL('toolkit_bg.wasm', (typeof document === 'undefined' && typeof location === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : typeof document === 'undefined' ? location.href : (document.currentScript && document.currentScript.src || new URL('c2pa.worker.js', document.baseURI).href)));
        }
        const imports = __wbg_get_imports();

        if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
            module_or_path = fetch(module_or_path);
        }

        const { instance, module } = await __wbg_load(await module_or_path, imports);

        return __wbg_finalize_init(instance, module);
    }

    /**
     * Copyright 2021 Adobe
     * All Rights Reserved.
     *
     * NOTICE: Adobe permits you to use, modify, and distribute this file in
     * accordance with the terms of the Adobe license agreement accompanying
     * it.
     */
    const worker = {
        async compileWasm(buffer) {
            return WebAssembly.compile(buffer);
        },
        async getReport(wasm, buffer, type, settings) {
            await __wbg_init(wasm);
            return getManifestStoreFromArrayBuffer(buffer, type, settings);
        },
        async getReportFromAssetAndManifestBuffer(wasm, manifestBuffer, asset, settings) {
            await __wbg_init(wasm);
            const assetBuffer = await asset.arrayBuffer();
            return getManifestStoreFromManifestAndAsset(manifestBuffer, assetBuffer, asset.type, settings);
        },
        async scanInput(wasm, buffer) {
            await init(wasm);
            try {
                const offset = await scan_array_buffer(buffer);
                return { found: true, offset };
            }
            catch (err) {
                return { found: false };
            }
        },
    };
    setupWorker(worker);

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYzJwYS53b3JrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvcG9vbC9lcnJvci50cyIsIi4uLy4uL3NyYy9saWIvcG9vbC93b3JrZXIudHMiLCIuLi8uLi9kZXRlY3Rvci9wa2cvZGV0ZWN0b3IuanMiLCIuLi8uLi90b29sa2l0L3BrZy90b29sa2l0LmpzIiwiLi4vLi4vd29ya2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMjMgQWRvYmVcbiAqIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTk9USUNFOiBBZG9iZSBwZXJtaXRzIHlvdSB0byB1c2UsIG1vZGlmeSwgYW5kIGRpc3RyaWJ1dGUgdGhpcyBmaWxlIGluXG4gKiBhY2NvcmRhbmNlIHdpdGggdGhlIHRlcm1zIG9mIHRoZSBBZG9iZSBsaWNlbnNlIGFncmVlbWVudCBhY2NvbXBhbnlpbmdcbiAqIGl0LlxuICovXG5cbmludGVyZmFjZSBTZXJpYWxpemVkRXJyb3Ige1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG59XG5cbi8vIEZyb20gaHR0cHM6Ly9naXRodWIuY29tL2pvc2Rlam9uZy93b3JrZXJwb29sL2Jsb2IvbWFzdGVyL3NyYy93b3JrZXIuanMjTDc2LUw4M1xuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZUVycm9yKGVycm9yOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogU2VyaWFsaXplZEVycm9yIHtcbiAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGVycm9yKS5yZWR1Y2UoZnVuY3Rpb24gKHByb2R1Y3QsIG5hbWUpIHtcbiAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb2R1Y3QsIG5hbWUsIHtcbiAgICAgIHZhbHVlOiBlcnJvcltuYW1lXSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgfSk7XG4gIH0sIHt9KTtcbn1cblxuLy8gRnJvbSBodHRwczovL2dpdGh1Yi5jb20vam9zZGVqb25nL3dvcmtlcnBvb2wvYmxvYi9tYXN0ZXIvc3JjL1dvcmtlckhhbmRsZXIuanMjTDE3OS1MMTkzXG5leHBvcnQgZnVuY3Rpb24gZGVzZXJpYWxpemVFcnJvcihzZXJpYWxpemVkRXJyb3I6IFNlcmlhbGl6ZWRFcnJvcik6IEVycm9yIHtcbiAgdmFyIHRlbXAgPSBuZXcgRXJyb3IoJycpO1xuICB2YXIgcHJvcHMgPSBPYmplY3Qua2V5cyhzZXJpYWxpemVkRXJyb3IpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgdGVtcFtwcm9wc1tpXV0gPSBzZXJpYWxpemVkRXJyb3JbcHJvcHNbaV1dO1xuICB9XG5cbiAgcmV0dXJuIHRlbXA7XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDIzIEFkb2JlXG4gKiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIE5PVElDRTogQWRvYmUgcGVybWl0cyB5b3UgdG8gdXNlLCBtb2RpZnksIGFuZCBkaXN0cmlidXRlIHRoaXMgZmlsZSBpblxuICogYWNjb3JkYW5jZSB3aXRoIHRoZSB0ZXJtcyBvZiB0aGUgQWRvYmUgbGljZW5zZSBhZ3JlZW1lbnQgYWNjb21wYW55aW5nXG4gKiBpdC5cbiAqL1xuXG5pbXBvcnQgeyBzZXJpYWxpemVFcnJvciB9IGZyb20gJy4vZXJyb3InO1xuXG5leHBvcnQgaW50ZXJmYWNlIFdvcmtlclJlcXVlc3Qge1xuICBtZXRob2Q6IHN0cmluZztcbiAgYXJnczogdW5rbm93bltdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdvcmtlclJlc3BvbnNlU3VjY2VzcyB7XG4gIHR5cGU6ICdzdWNjZXNzJztcbiAgZGF0YTogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdvcmtlclJlc3BvbnNlRXJyb3Ige1xuICB0eXBlOiAnZXJyb3InO1xuICBlcnJvcjogYW55O1xufVxuXG5leHBvcnQgdHlwZSBXb3JrZXJSZXNwb25zZSA9IFdvcmtlclJlc3BvbnNlU3VjY2VzcyB8IFdvcmtlclJlc3BvbnNlRXJyb3I7XG5cbnR5cGUgV29ya2VyTWV0aG9kcyA9IFJlY29yZDxzdHJpbmcsICguLi5hcmdzOiBhbnlbXSkgPT4gYW55PjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwV29ya2VyKG1ldGhvZHM6IFdvcmtlck1ldGhvZHMpIHtcbiAgb25tZXNzYWdlID0gYXN5bmMgKGU6IE1lc3NhZ2VFdmVudDxXb3JrZXJSZXF1ZXN0PikgPT4ge1xuICAgIGNvbnN0IHsgYXJncywgbWV0aG9kIH0gPSBlLmRhdGE7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG1ldGhvZHNbbWV0aG9kXSguLi5hcmdzKTtcblxuICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgIGRhdGE6IHJlcyxcbiAgICAgIH0gYXMgV29ya2VyUmVzcG9uc2UpO1xuICAgIH0gY2F0Y2ggKGVycm9yOiB1bmtub3duKSB7XG4gICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIGVycm9yOiBzZXJpYWxpemVFcnJvcihlcnJvciBhcyBFcnJvciksXG4gICAgICB9IGFzIFdvcmtlclJlc3BvbnNlKTtcbiAgICB9XG4gIH07XG59XG4iLCJcbmxldCB3YXNtO1xuXG5jb25zdCBjYWNoZWRUZXh0RGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigndXRmLTgnLCB7IGlnbm9yZUJPTTogdHJ1ZSwgZmF0YWw6IHRydWUgfSk7XG5cbmNhY2hlZFRleHREZWNvZGVyLmRlY29kZSgpO1xuXG5sZXQgY2FjaGVkVWludDhNZW1vcnkwID0gbmV3IFVpbnQ4QXJyYXkoKTtcblxuZnVuY3Rpb24gZ2V0VWludDhNZW1vcnkwKCkge1xuICAgIGlmIChjYWNoZWRVaW50OE1lbW9yeTAuYnl0ZUxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjYWNoZWRVaW50OE1lbW9yeTAgPSBuZXcgVWludDhBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVkVWludDhNZW1vcnkwO1xufVxuXG5mdW5jdGlvbiBnZXRTdHJpbmdGcm9tV2FzbTAocHRyLCBsZW4pIHtcbiAgICByZXR1cm4gY2FjaGVkVGV4dERlY29kZXIuZGVjb2RlKGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgbGVuKSk7XG59XG5cbmxldCBXQVNNX1ZFQ1RPUl9MRU4gPSAwO1xuXG5jb25zdCBjYWNoZWRUZXh0RW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigndXRmLTgnKTtcblxuY29uc3QgZW5jb2RlU3RyaW5nID0gKHR5cGVvZiBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGVJbnRvID09PSAnZnVuY3Rpb24nXG4gICAgPyBmdW5jdGlvbiAoYXJnLCB2aWV3KSB7XG4gICAgcmV0dXJuIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8oYXJnLCB2aWV3KTtcbn1cbiAgICA6IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICBjb25zdCBidWYgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGUoYXJnKTtcbiAgICB2aWV3LnNldChidWYpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlYWQ6IGFyZy5sZW5ndGgsXG4gICAgICAgIHdyaXR0ZW46IGJ1Zi5sZW5ndGhcbiAgICB9O1xufSk7XG5cbmZ1bmN0aW9uIHBhc3NTdHJpbmdUb1dhc20wKGFyZywgbWFsbG9jLCByZWFsbG9jKSB7XG5cbiAgICBpZiAocmVhbGxvYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgICAgICBjb25zdCBwdHIgPSBtYWxsb2MoYnVmLmxlbmd0aCk7XG4gICAgICAgIGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgYnVmLmxlbmd0aCkuc2V0KGJ1Zik7XG4gICAgICAgIFdBU01fVkVDVE9SX0xFTiA9IGJ1Zi5sZW5ndGg7XG4gICAgICAgIHJldHVybiBwdHI7XG4gICAgfVxuXG4gICAgbGV0IGxlbiA9IGFyZy5sZW5ndGg7XG4gICAgbGV0IHB0ciA9IG1hbGxvYyhsZW4pO1xuXG4gICAgY29uc3QgbWVtID0gZ2V0VWludDhNZW1vcnkwKCk7XG5cbiAgICBsZXQgb2Zmc2V0ID0gMDtcblxuICAgIGZvciAoOyBvZmZzZXQgPCBsZW47IG9mZnNldCsrKSB7XG4gICAgICAgIGNvbnN0IGNvZGUgPSBhcmcuY2hhckNvZGVBdChvZmZzZXQpO1xuICAgICAgICBpZiAoY29kZSA+IDB4N0YpIGJyZWFrO1xuICAgICAgICBtZW1bcHRyICsgb2Zmc2V0XSA9IGNvZGU7XG4gICAgfVxuXG4gICAgaWYgKG9mZnNldCAhPT0gbGVuKSB7XG4gICAgICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgICAgICAgIGFyZyA9IGFyZy5zbGljZShvZmZzZXQpO1xuICAgICAgICB9XG4gICAgICAgIHB0ciA9IHJlYWxsb2MocHRyLCBsZW4sIGxlbiA9IG9mZnNldCArIGFyZy5sZW5ndGggKiAzKTtcbiAgICAgICAgY29uc3QgdmlldyA9IGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciArIG9mZnNldCwgcHRyICsgbGVuKTtcbiAgICAgICAgY29uc3QgcmV0ID0gZW5jb2RlU3RyaW5nKGFyZywgdmlldyk7XG5cbiAgICAgICAgb2Zmc2V0ICs9IHJldC53cml0dGVuO1xuICAgIH1cblxuICAgIFdBU01fVkVDVE9SX0xFTiA9IG9mZnNldDtcbiAgICByZXR1cm4gcHRyO1xufVxuXG5mdW5jdGlvbiBpc0xpa2VOb25lKHgpIHtcbiAgICByZXR1cm4geCA9PT0gdW5kZWZpbmVkIHx8IHggPT09IG51bGw7XG59XG5cbmxldCBjYWNoZWRJbnQzMk1lbW9yeTAgPSBuZXcgSW50MzJBcnJheSgpO1xuXG5mdW5jdGlvbiBnZXRJbnQzMk1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZEludDMyTWVtb3J5MC5ieXRlTGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNhY2hlZEludDMyTWVtb3J5MCA9IG5ldyBJbnQzMkFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWRJbnQzMk1lbW9yeTA7XG59XG5cbmxldCBjYWNoZWRGbG9hdDY0TWVtb3J5MCA9IG5ldyBGbG9hdDY0QXJyYXkoKTtcblxuZnVuY3Rpb24gZ2V0RmxvYXQ2NE1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZEZsb2F0NjRNZW1vcnkwLmJ5dGVMZW5ndGggPT09IDApIHtcbiAgICAgICAgY2FjaGVkRmxvYXQ2NE1lbW9yeTAgPSBuZXcgRmxvYXQ2NEFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWRGbG9hdDY0TWVtb3J5MDtcbn1cblxuZnVuY3Rpb24gZGVidWdTdHJpbmcodmFsKSB7XG4gICAgLy8gcHJpbWl0aXZlIHR5cGVzXG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiB2YWw7XG4gICAgaWYgKHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHwgdmFsID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuICBgJHt2YWx9YDtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGBcIiR7dmFsfVwiYDtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSB2YWwuZGVzY3JpcHRpb247XG4gICAgICAgIGlmIChkZXNjcmlwdGlvbiA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1N5bWJvbCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYFN5bWJvbCgke2Rlc2NyaXB0aW9ufSlgO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHZhbC5uYW1lO1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycgJiYgbmFtZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYEZ1bmN0aW9uKCR7bmFtZX0pYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnRnVuY3Rpb24nO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIG9iamVjdHNcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHZhbC5sZW5ndGg7XG4gICAgICAgIGxldCBkZWJ1ZyA9ICdbJztcbiAgICAgICAgaWYgKGxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGRlYnVnICs9IGRlYnVnU3RyaW5nKHZhbFswXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkZWJ1ZyArPSAnLCAnICsgZGVidWdTdHJpbmcodmFsW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBkZWJ1ZyArPSAnXSc7XG4gICAgICAgIHJldHVybiBkZWJ1ZztcbiAgICB9XG4gICAgLy8gVGVzdCBmb3IgYnVpbHQtaW5cbiAgICBjb25zdCBidWlsdEluTWF0Y2hlcyA9IC9cXFtvYmplY3QgKFteXFxdXSspXFxdLy5leGVjKHRvU3RyaW5nLmNhbGwodmFsKSk7XG4gICAgbGV0IGNsYXNzTmFtZTtcbiAgICBpZiAoYnVpbHRJbk1hdGNoZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBjbGFzc05hbWUgPSBidWlsdEluTWF0Y2hlc1sxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGYWlsZWQgdG8gbWF0Y2ggdGhlIHN0YW5kYXJkICdbb2JqZWN0IENsYXNzTmFtZV0nXG4gICAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCk7XG4gICAgfVxuICAgIGlmIChjbGFzc05hbWUgPT0gJ09iamVjdCcpIHtcbiAgICAgICAgLy8gd2UncmUgYSB1c2VyIGRlZmluZWQgY2xhc3Mgb3IgT2JqZWN0XG4gICAgICAgIC8vIEpTT04uc3RyaW5naWZ5IGF2b2lkcyBwcm9ibGVtcyB3aXRoIGN5Y2xlcywgYW5kIGlzIGdlbmVyYWxseSBtdWNoXG4gICAgICAgIC8vIGVhc2llciB0aGFuIGxvb3BpbmcgdGhyb3VnaCBvd25Qcm9wZXJ0aWVzIG9mIGB2YWxgLlxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuICdPYmplY3QoJyArIEpTT04uc3RyaW5naWZ5KHZhbCkgKyAnKSc7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICAgIHJldHVybiAnT2JqZWN0JztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBlcnJvcnNcbiAgICBpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGAke3ZhbC5uYW1lfTogJHt2YWwubWVzc2FnZX1cXG4ke3ZhbC5zdGFja31gO1xuICAgIH1cbiAgICAvLyBUT0RPIHdlIGNvdWxkIHRlc3QgZm9yIG1vcmUgdGhpbmdzIGhlcmUsIGxpa2UgYFNldGBzIGFuZCBgTWFwYHMuXG4gICAgcmV0dXJuIGNsYXNzTmFtZTtcbn1cbi8qKlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWluKCkge1xuICAgIHdhc20ubWFpbigpO1xufVxuXG5mdW5jdGlvbiB0YWtlRnJvbUV4dGVybnJlZlRhYmxlMChpZHgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHdhc20uX193YmluZGdlbl9leHBvcnRfMi5nZXQoaWR4KTtcbiAgICB3YXNtLl9fZXh0ZXJucmVmX3RhYmxlX2RlYWxsb2MoaWR4KTtcbiAgICByZXR1cm4gdmFsdWU7XG59XG4vKipcbiogQHBhcmFtIHthbnl9IGJ1ZlxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBzY2FuX2FycmF5X2J1ZmZlcihidWYpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgd2FzbS5zY2FuX2FycmF5X2J1ZmZlcihyZXRwdHIsIGJ1Zik7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICB2YXIgcjIgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMl07XG4gICAgICAgIGlmIChyMikge1xuICAgICAgICAgICAgdGhyb3cgdGFrZUZyb21FeHRlcm5yZWZUYWJsZTAocjEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByMCA+Pj4gMDtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9hZChtb2R1bGUsIGltcG9ydHMpIHtcbiAgICBpZiAodHlwZW9mIFJlc3BvbnNlID09PSAnZnVuY3Rpb24nICYmIG1vZHVsZSBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGVTdHJlYW1pbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nKG1vZHVsZSwgaW1wb3J0cyk7XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKSAhPSAnYXBwbGljYXRpb24vd2FzbScpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiYFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nYCBmYWlsZWQgYmVjYXVzZSB5b3VyIHNlcnZlciBkb2VzIG5vdCBzZXJ2ZSB3YXNtIHdpdGggYGFwcGxpY2F0aW9uL3dhc21gIE1JTUUgdHlwZS4gRmFsbGluZyBiYWNrIHRvIGBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZWAgd2hpY2ggaXMgc2xvd2VyLiBPcmlnaW5hbCBlcnJvcjpcXG5cIiwgZSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJ5dGVzID0gYXdhaXQgbW9kdWxlLmFycmF5QnVmZmVyKCk7XG4gICAgICAgIHJldHVybiBhd2FpdCBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZShieXRlcywgaW1wb3J0cyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlKG1vZHVsZSwgaW1wb3J0cyk7XG5cbiAgICAgICAgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgV2ViQXNzZW1ibHkuSW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7IGluc3RhbmNlLCBtb2R1bGUgfTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRJbXBvcnRzKCkge1xuICAgIGNvbnN0IGltcG9ydHMgPSB7fTtcbiAgICBpbXBvcnRzLndiZyA9IHt9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2lzQXJyYXlfMjdjNDZjNjdmNDk4ZTE1ZCA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gQXJyYXkuaXNBcnJheShhcmcwKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2xlbmd0aF82ZTNiYmU3YzhiZDRkYmQ4ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBhcmcwLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2dldF81NzI0NWNjN2Q3Yzc2MTlkID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBhcmcwW2FyZzEgPj4+IDBdO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfaXNTYWZlSW50ZWdlcl9kZmEwNTkzZThkN2FjMzVhID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBOdW1iZXIuaXNTYWZlSW50ZWdlcihhcmcwKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fc3RyaW5nX25ldyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzAsIGFyZzEpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3X2FiZGE3NmU4ODNiYThhNWYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IEVycm9yKCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zdGFja182NTgyNzlmZTQ0NTQxY2Y2ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBhcmcxLnN0YWNrO1xuICAgICAgICBjb25zdCBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAocmV0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIGNvbnN0IGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIGdldEludDMyTWVtb3J5MCgpW2FyZzAgLyA0ICsgMV0gPSBsZW4wO1xuICAgICAgICBnZXRJbnQzMk1lbW9yeTAoKVthcmcwIC8gNCArIDBdID0gcHRyMDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2Vycm9yX2Y4NTE2NjdhZjcxYmNmYzYgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShhcmcwLCBhcmcxKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbGVuZ3RoXzllMWFlMTkwMGNiMGZiZDUgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGFyZzAubGVuZ3RoO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9tZW1vcnkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gd2FzbS5tZW1vcnk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19idWZmZXJfM2YzZDc2NGQ0NzQ3ZDU2NCA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gYXJnMC5idWZmZXI7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19uZXdfOGMzZjAwNTIyNzJhNDU3YSA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IFVpbnQ4QXJyYXkoYXJnMCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zZXRfODNkYjk2OTBmOTM1M2U3OSA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICAgICAgYXJnMC5zZXQoYXJnMSwgYXJnMiA+Pj4gMCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19pbnN0YW5jZW9mX1VpbnQ4QXJyYXlfOTcxZWVkYTY5ZWI3NTAwMyA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGFyZzAgaW5zdGFuY2VvZiBVaW50OEFycmF5O1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJldCA9IHJlc3VsdDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2luc3RhbmNlb2ZfQXJyYXlCdWZmZXJfZTVlNDhmNDc2MmM1NjEwYiA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGFyZzAgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcjtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXQgPSByZXN1bHQ7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2pzdmFsX2xvb3NlX2VxID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBhcmcwID09IGFyZzE7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2Jvb2xlYW5fZ2V0ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCB2ID0gYXJnMDtcbiAgICAgICAgY29uc3QgcmV0ID0gdHlwZW9mKHYpID09PSAnYm9vbGVhbicgPyAodiA/IDEgOiAwKSA6IDI7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX3N0cmluZ19nZXQgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IG9iaiA9IGFyZzE7XG4gICAgICAgIGNvbnN0IHJldCA9IHR5cGVvZihvYmopID09PSAnc3RyaW5nJyA/IG9iaiA6IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIHB0cjAgPSBpc0xpa2VOb25lKHJldCkgPyAwIDogcGFzc1N0cmluZ1RvV2FzbTAocmV0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICBnZXRJbnQzMk1lbW9yeTAoKVthcmcwIC8gNCArIDFdID0gbGVuMDtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAwXSA9IHB0cjA7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX251bWJlcl9nZXQgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IG9iaiA9IGFyZzE7XG4gICAgICAgIGNvbnN0IHJldCA9IHR5cGVvZihvYmopID09PSAnbnVtYmVyJyA/IG9iaiA6IHVuZGVmaW5lZDtcbiAgICAgICAgZ2V0RmxvYXQ2NE1lbW9yeTAoKVthcmcwIC8gOCArIDFdID0gaXNMaWtlTm9uZShyZXQpID8gMCA6IHJldDtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAwXSA9ICFpc0xpa2VOb25lKHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2Vycm9yX25ldyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IEVycm9yKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2RlYnVnX3N0cmluZyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZGVidWdTdHJpbmcoYXJnMSk7XG4gICAgICAgIGNvbnN0IHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChyZXQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgY29uc3QgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAxXSA9IGxlbjA7XG4gICAgICAgIGdldEludDMyTWVtb3J5MCgpW2FyZzAgLyA0ICsgMF0gPSBwdHIwO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl90aHJvdyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2luaXRfZXh0ZXJucmVmX3RhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHRhYmxlID0gd2FzbS5fX3diaW5kZ2VuX2V4cG9ydF8yO1xuICAgICAgICBjb25zdCBvZmZzZXQgPSB0YWJsZS5ncm93KDQpO1xuICAgICAgICB0YWJsZS5zZXQoMCwgdW5kZWZpbmVkKTtcbiAgICAgICAgdGFibGUuc2V0KG9mZnNldCArIDAsIHVuZGVmaW5lZCk7XG4gICAgICAgIHRhYmxlLnNldChvZmZzZXQgKyAxLCBudWxsKTtcbiAgICAgICAgdGFibGUuc2V0KG9mZnNldCArIDIsIHRydWUpO1xuICAgICAgICB0YWJsZS5zZXQob2Zmc2V0ICsgMywgZmFsc2UpO1xuICAgICAgICA7XG4gICAgfTtcblxuICAgIHJldHVybiBpbXBvcnRzO1xufVxuXG5mdW5jdGlvbiBpbml0TWVtb3J5KGltcG9ydHMsIG1heWJlX21lbW9yeSkge1xuXG59XG5cbmZ1bmN0aW9uIGZpbmFsaXplSW5pdChpbnN0YW5jZSwgbW9kdWxlKSB7XG4gICAgd2FzbSA9IGluc3RhbmNlLmV4cG9ydHM7XG4gICAgaW5pdC5fX3diaW5kZ2VuX3dhc21fbW9kdWxlID0gbW9kdWxlO1xuICAgIGNhY2hlZEZsb2F0NjRNZW1vcnkwID0gbmV3IEZsb2F0NjRBcnJheSgpO1xuICAgIGNhY2hlZEludDMyTWVtb3J5MCA9IG5ldyBJbnQzMkFycmF5KCk7XG4gICAgY2FjaGVkVWludDhNZW1vcnkwID0gbmV3IFVpbnQ4QXJyYXkoKTtcblxuICAgIHdhc20uX193YmluZGdlbl9zdGFydCgpO1xuICAgIHJldHVybiB3YXNtO1xufVxuXG5mdW5jdGlvbiBpbml0U3luYyhtb2R1bGUpIHtcbiAgICBjb25zdCBpbXBvcnRzID0gZ2V0SW1wb3J0cygpO1xuXG4gICAgaW5pdE1lbW9yeShpbXBvcnRzKTtcblxuICAgIGlmICghKG1vZHVsZSBpbnN0YW5jZW9mIFdlYkFzc2VtYmx5Lk1vZHVsZSkpIHtcbiAgICAgICAgbW9kdWxlID0gbmV3IFdlYkFzc2VtYmx5Lk1vZHVsZShtb2R1bGUpO1xuICAgIH1cblxuICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IFdlYkFzc2VtYmx5Lkluc3RhbmNlKG1vZHVsZSwgaW1wb3J0cyk7XG5cbiAgICByZXR1cm4gZmluYWxpemVJbml0KGluc3RhbmNlLCBtb2R1bGUpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBpbml0KGlucHV0KSB7XG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgaW5wdXQgPSBuZXcgVVJMKCdkZXRlY3Rvcl9iZy53YXNtJywgaW1wb3J0Lm1ldGEudXJsKTtcbiAgICB9XG4gICAgY29uc3QgaW1wb3J0cyA9IGdldEltcG9ydHMoKTtcblxuICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnIHx8ICh0eXBlb2YgUmVxdWVzdCA9PT0gJ2Z1bmN0aW9uJyAmJiBpbnB1dCBpbnN0YW5jZW9mIFJlcXVlc3QpIHx8ICh0eXBlb2YgVVJMID09PSAnZnVuY3Rpb24nICYmIGlucHV0IGluc3RhbmNlb2YgVVJMKSkge1xuICAgICAgICBpbnB1dCA9IGZldGNoKGlucHV0KTtcbiAgICB9XG5cbiAgICBpbml0TWVtb3J5KGltcG9ydHMpO1xuXG4gICAgY29uc3QgeyBpbnN0YW5jZSwgbW9kdWxlIH0gPSBhd2FpdCBsb2FkKGF3YWl0IGlucHV0LCBpbXBvcnRzKTtcblxuICAgIHJldHVybiBmaW5hbGl6ZUluaXQoaW5zdGFuY2UsIG1vZHVsZSk7XG59XG5cbmV4cG9ydCB7IGluaXRTeW5jIH1cbmV4cG9ydCBkZWZhdWx0IGluaXQ7XG4iLCJsZXQgd2FzbTtcblxuY29uc3QgaGVhcCA9IG5ldyBBcnJheSgxMjgpLmZpbGwodW5kZWZpbmVkKTtcblxuaGVhcC5wdXNoKHVuZGVmaW5lZCwgbnVsbCwgdHJ1ZSwgZmFsc2UpO1xuXG5mdW5jdGlvbiBnZXRPYmplY3QoaWR4KSB7IHJldHVybiBoZWFwW2lkeF07IH1cblxubGV0IGhlYXBfbmV4dCA9IGhlYXAubGVuZ3RoO1xuXG5mdW5jdGlvbiBkcm9wT2JqZWN0KGlkeCkge1xuICAgIGlmIChpZHggPCAxMzIpIHJldHVybjtcbiAgICBoZWFwW2lkeF0gPSBoZWFwX25leHQ7XG4gICAgaGVhcF9uZXh0ID0gaWR4O1xufVxuXG5mdW5jdGlvbiB0YWtlT2JqZWN0KGlkeCkge1xuICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChpZHgpO1xuICAgIGRyb3BPYmplY3QoaWR4KTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5jb25zdCBjYWNoZWRUZXh0RGVjb2RlciA9ICh0eXBlb2YgVGV4dERlY29kZXIgIT09ICd1bmRlZmluZWQnID8gbmV3IFRleHREZWNvZGVyKCd1dGYtOCcsIHsgaWdub3JlQk9NOiB0cnVlLCBmYXRhbDogdHJ1ZSB9KSA6IHsgZGVjb2RlOiAoKSA9PiB7IHRocm93IEVycm9yKCdUZXh0RGVjb2RlciBub3QgYXZhaWxhYmxlJykgfSB9ICk7XG5cbmlmICh0eXBlb2YgVGV4dERlY29kZXIgIT09ICd1bmRlZmluZWQnKSB7IGNhY2hlZFRleHREZWNvZGVyLmRlY29kZSgpOyB9O1xuXG5sZXQgY2FjaGVkVWludDhBcnJheU1lbW9yeTAgPSBudWxsO1xuXG5mdW5jdGlvbiBnZXRVaW50OEFycmF5TWVtb3J5MCgpIHtcbiAgICBpZiAoY2FjaGVkVWludDhBcnJheU1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVkVWludDhBcnJheU1lbW9yeTAuYnl0ZUxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjYWNoZWRVaW50OEFycmF5TWVtb3J5MCA9IG5ldyBVaW50OEFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWRVaW50OEFycmF5TWVtb3J5MDtcbn1cblxuZnVuY3Rpb24gZ2V0U3RyaW5nRnJvbVdhc20wKHB0ciwgbGVuKSB7XG4gICAgcHRyID0gcHRyID4+PiAwO1xuICAgIHJldHVybiBjYWNoZWRUZXh0RGVjb2Rlci5kZWNvZGUoZ2V0VWludDhBcnJheU1lbW9yeTAoKS5zdWJhcnJheShwdHIsIHB0ciArIGxlbikpO1xufVxuXG5mdW5jdGlvbiBhZGRIZWFwT2JqZWN0KG9iaikge1xuICAgIGlmIChoZWFwX25leHQgPT09IGhlYXAubGVuZ3RoKSBoZWFwLnB1c2goaGVhcC5sZW5ndGggKyAxKTtcbiAgICBjb25zdCBpZHggPSBoZWFwX25leHQ7XG4gICAgaGVhcF9uZXh0ID0gaGVhcFtpZHhdO1xuXG4gICAgaGVhcFtpZHhdID0gb2JqO1xuICAgIHJldHVybiBpZHg7XG59XG5cbmZ1bmN0aW9uIGlzTGlrZU5vbmUoeCkge1xuICAgIHJldHVybiB4ID09PSB1bmRlZmluZWQgfHwgeCA9PT0gbnVsbDtcbn1cblxubGV0IGNhY2hlZERhdGFWaWV3TWVtb3J5MCA9IG51bGw7XG5cbmZ1bmN0aW9uIGdldERhdGFWaWV3TWVtb3J5MCgpIHtcbiAgICBpZiAoY2FjaGVkRGF0YVZpZXdNZW1vcnkwID09PSBudWxsIHx8IGNhY2hlZERhdGFWaWV3TWVtb3J5MC5idWZmZXIuZGV0YWNoZWQgPT09IHRydWUgfHwgKGNhY2hlZERhdGFWaWV3TWVtb3J5MC5idWZmZXIuZGV0YWNoZWQgPT09IHVuZGVmaW5lZCAmJiBjYWNoZWREYXRhVmlld01lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpKSB7XG4gICAgICAgIGNhY2hlZERhdGFWaWV3TWVtb3J5MCA9IG5ldyBEYXRhVmlldyh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVkRGF0YVZpZXdNZW1vcnkwO1xufVxuXG5sZXQgV0FTTV9WRUNUT1JfTEVOID0gMDtcblxuY29uc3QgY2FjaGVkVGV4dEVuY29kZXIgPSAodHlwZW9mIFRleHRFbmNvZGVyICE9PSAndW5kZWZpbmVkJyA/IG5ldyBUZXh0RW5jb2RlcigndXRmLTgnKSA6IHsgZW5jb2RlOiAoKSA9PiB7IHRocm93IEVycm9yKCdUZXh0RW5jb2RlciBub3QgYXZhaWxhYmxlJykgfSB9ICk7XG5cbmNvbnN0IGVuY29kZVN0cmluZyA9ICh0eXBlb2YgY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlSW50byA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gZnVuY3Rpb24gKGFyZywgdmlldykge1xuICAgIHJldHVybiBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGVJbnRvKGFyZywgdmlldyk7XG59XG4gICAgOiBmdW5jdGlvbiAoYXJnLCB2aWV3KSB7XG4gICAgY29uc3QgYnVmID0gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlKGFyZyk7XG4gICAgdmlldy5zZXQoYnVmKTtcbiAgICByZXR1cm4ge1xuICAgICAgICByZWFkOiBhcmcubGVuZ3RoLFxuICAgICAgICB3cml0dGVuOiBidWYubGVuZ3RoXG4gICAgfTtcbn0pO1xuXG5mdW5jdGlvbiBwYXNzU3RyaW5nVG9XYXNtMChhcmcsIG1hbGxvYywgcmVhbGxvYykge1xuXG4gICAgaWYgKHJlYWxsb2MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBidWYgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGUoYXJnKTtcbiAgICAgICAgY29uc3QgcHRyID0gbWFsbG9jKGJ1Zi5sZW5ndGgsIDEpID4+PiAwO1xuICAgICAgICBnZXRVaW50OEFycmF5TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgYnVmLmxlbmd0aCkuc2V0KGJ1Zik7XG4gICAgICAgIFdBU01fVkVDVE9SX0xFTiA9IGJ1Zi5sZW5ndGg7XG4gICAgICAgIHJldHVybiBwdHI7XG4gICAgfVxuXG4gICAgbGV0IGxlbiA9IGFyZy5sZW5ndGg7XG4gICAgbGV0IHB0ciA9IG1hbGxvYyhsZW4sIDEpID4+PiAwO1xuXG4gICAgY29uc3QgbWVtID0gZ2V0VWludDhBcnJheU1lbW9yeTAoKTtcblxuICAgIGxldCBvZmZzZXQgPSAwO1xuXG4gICAgZm9yICg7IG9mZnNldCA8IGxlbjsgb2Zmc2V0KyspIHtcbiAgICAgICAgY29uc3QgY29kZSA9IGFyZy5jaGFyQ29kZUF0KG9mZnNldCk7XG4gICAgICAgIGlmIChjb2RlID4gMHg3RikgYnJlYWs7XG4gICAgICAgIG1lbVtwdHIgKyBvZmZzZXRdID0gY29kZTtcbiAgICB9XG5cbiAgICBpZiAob2Zmc2V0ICE9PSBsZW4pIHtcbiAgICAgICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgICAgICAgYXJnID0gYXJnLnNsaWNlKG9mZnNldCk7XG4gICAgICAgIH1cbiAgICAgICAgcHRyID0gcmVhbGxvYyhwdHIsIGxlbiwgbGVuID0gb2Zmc2V0ICsgYXJnLmxlbmd0aCAqIDMsIDEpID4+PiAwO1xuICAgICAgICBjb25zdCB2aWV3ID0gZ2V0VWludDhBcnJheU1lbW9yeTAoKS5zdWJhcnJheShwdHIgKyBvZmZzZXQsIHB0ciArIGxlbik7XG4gICAgICAgIGNvbnN0IHJldCA9IGVuY29kZVN0cmluZyhhcmcsIHZpZXcpO1xuXG4gICAgICAgIG9mZnNldCArPSByZXQud3JpdHRlbjtcbiAgICAgICAgcHRyID0gcmVhbGxvYyhwdHIsIGxlbiwgb2Zmc2V0LCAxKSA+Pj4gMDtcbiAgICB9XG5cbiAgICBXQVNNX1ZFQ1RPUl9MRU4gPSBvZmZzZXQ7XG4gICAgcmV0dXJuIHB0cjtcbn1cblxuZnVuY3Rpb24gZGVidWdTdHJpbmcodmFsKSB7XG4gICAgLy8gcHJpbWl0aXZlIHR5cGVzXG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiB2YWw7XG4gICAgaWYgKHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHwgdmFsID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuICBgJHt2YWx9YDtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGBcIiR7dmFsfVwiYDtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSB2YWwuZGVzY3JpcHRpb247XG4gICAgICAgIGlmIChkZXNjcmlwdGlvbiA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1N5bWJvbCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYFN5bWJvbCgke2Rlc2NyaXB0aW9ufSlgO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHZhbC5uYW1lO1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycgJiYgbmFtZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYEZ1bmN0aW9uKCR7bmFtZX0pYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnRnVuY3Rpb24nO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIG9iamVjdHNcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHZhbC5sZW5ndGg7XG4gICAgICAgIGxldCBkZWJ1ZyA9ICdbJztcbiAgICAgICAgaWYgKGxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGRlYnVnICs9IGRlYnVnU3RyaW5nKHZhbFswXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkZWJ1ZyArPSAnLCAnICsgZGVidWdTdHJpbmcodmFsW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBkZWJ1ZyArPSAnXSc7XG4gICAgICAgIHJldHVybiBkZWJ1ZztcbiAgICB9XG4gICAgLy8gVGVzdCBmb3IgYnVpbHQtaW5cbiAgICBjb25zdCBidWlsdEluTWF0Y2hlcyA9IC9cXFtvYmplY3QgKFteXFxdXSspXFxdLy5leGVjKHRvU3RyaW5nLmNhbGwodmFsKSk7XG4gICAgbGV0IGNsYXNzTmFtZTtcbiAgICBpZiAoYnVpbHRJbk1hdGNoZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBjbGFzc05hbWUgPSBidWlsdEluTWF0Y2hlc1sxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGYWlsZWQgdG8gbWF0Y2ggdGhlIHN0YW5kYXJkICdbb2JqZWN0IENsYXNzTmFtZV0nXG4gICAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCk7XG4gICAgfVxuICAgIGlmIChjbGFzc05hbWUgPT0gJ09iamVjdCcpIHtcbiAgICAgICAgLy8gd2UncmUgYSB1c2VyIGRlZmluZWQgY2xhc3Mgb3IgT2JqZWN0XG4gICAgICAgIC8vIEpTT04uc3RyaW5naWZ5IGF2b2lkcyBwcm9ibGVtcyB3aXRoIGN5Y2xlcywgYW5kIGlzIGdlbmVyYWxseSBtdWNoXG4gICAgICAgIC8vIGVhc2llciB0aGFuIGxvb3BpbmcgdGhyb3VnaCBvd25Qcm9wZXJ0aWVzIG9mIGB2YWxgLlxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuICdPYmplY3QoJyArIEpTT04uc3RyaW5naWZ5KHZhbCkgKyAnKSc7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICAgIHJldHVybiAnT2JqZWN0JztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBlcnJvcnNcbiAgICBpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGAke3ZhbC5uYW1lfTogJHt2YWwubWVzc2FnZX1cXG4ke3ZhbC5zdGFja31gO1xuICAgIH1cbiAgICAvLyBUT0RPIHdlIGNvdWxkIHRlc3QgZm9yIG1vcmUgdGhpbmdzIGhlcmUsIGxpa2UgYFNldGBzIGFuZCBgTWFwYHMuXG4gICAgcmV0dXJuIGNsYXNzTmFtZTtcbn1cblxuY29uc3QgQ0xPU1VSRV9EVE9SUyA9ICh0eXBlb2YgRmluYWxpemF0aW9uUmVnaXN0cnkgPT09ICd1bmRlZmluZWQnKVxuICAgID8geyByZWdpc3RlcjogKCkgPT4ge30sIHVucmVnaXN0ZXI6ICgpID0+IHt9IH1cbiAgICA6IG5ldyBGaW5hbGl6YXRpb25SZWdpc3RyeShzdGF0ZSA9PiB7XG4gICAgd2FzbS5fX3diaW5kZ2VuX2V4cG9ydF8yLmdldChzdGF0ZS5kdG9yKShzdGF0ZS5hLCBzdGF0ZS5iKVxufSk7XG5cbmZ1bmN0aW9uIG1ha2VNdXRDbG9zdXJlKGFyZzAsIGFyZzEsIGR0b3IsIGYpIHtcbiAgICBjb25zdCBzdGF0ZSA9IHsgYTogYXJnMCwgYjogYXJnMSwgY250OiAxLCBkdG9yIH07XG4gICAgY29uc3QgcmVhbCA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIC8vIEZpcnN0IHVwIHdpdGggYSBjbG9zdXJlIHdlIGluY3JlbWVudCB0aGUgaW50ZXJuYWwgcmVmZXJlbmNlXG4gICAgICAgIC8vIGNvdW50LiBUaGlzIGVuc3VyZXMgdGhhdCB0aGUgUnVzdCBjbG9zdXJlIGVudmlyb25tZW50IHdvbid0XG4gICAgICAgIC8vIGJlIGRlYWxsb2NhdGVkIHdoaWxlIHdlJ3JlIGludm9raW5nIGl0LlxuICAgICAgICBzdGF0ZS5jbnQrKztcbiAgICAgICAgY29uc3QgYSA9IHN0YXRlLmE7XG4gICAgICAgIHN0YXRlLmEgPSAwO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGYoYSwgc3RhdGUuYiwgLi4uYXJncyk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBpZiAoLS1zdGF0ZS5jbnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZXhwb3J0XzIuZ2V0KHN0YXRlLmR0b3IpKGEsIHN0YXRlLmIpO1xuICAgICAgICAgICAgICAgIENMT1NVUkVfRFRPUlMudW5yZWdpc3RlcihzdGF0ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlLmEgPSBhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICByZWFsLm9yaWdpbmFsID0gc3RhdGU7XG4gICAgQ0xPU1VSRV9EVE9SUy5yZWdpc3RlcihyZWFsLCBzdGF0ZSwgc3RhdGUpO1xuICAgIHJldHVybiByZWFsO1xufVxuZnVuY3Rpb24gX193YmdfYWRhcHRlcl80MihhcmcwLCBhcmcxLCBhcmcyKSB7XG4gICAgd2FzbS5fZHluX2NvcmVfX29wc19fZnVuY3Rpb25fX0ZuTXV0X19BX19fX091dHB1dF9fX1JfYXNfd2FzbV9iaW5kZ2VuX19jbG9zdXJlX19XYXNtQ2xvc3VyZV9fX2Rlc2NyaWJlX19pbnZva2VfX2g5MzhmYTE3ZGY3YzI1MTI4KGFyZzAsIGFyZzEsIGFkZEhlYXBPYmplY3QoYXJnMikpO1xufVxuXG4vKipcbiovXG5leHBvcnQgZnVuY3Rpb24gcnVuKCkge1xuICAgIHdhc20ucnVuKCk7XG59XG5cbi8qKlxuKiBAcGFyYW0ge2FueX0gYnVmXG4qIEBwYXJhbSB7c3RyaW5nfSBtaW1lX3R5cGVcbiogQHBhcmFtIHtzdHJpbmcgfCB1bmRlZmluZWR9IFtzZXR0aW5nc11cbiogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWFuaWZlc3RTdG9yZUZyb21BcnJheUJ1ZmZlcihidWYsIG1pbWVfdHlwZSwgc2V0dGluZ3MpIHtcbiAgICBjb25zdCBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAobWltZV90eXBlLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgY29uc3QgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICB2YXIgcHRyMSA9IGlzTGlrZU5vbmUoc2V0dGluZ3MpID8gMCA6IHBhc3NTdHJpbmdUb1dhc20wKHNldHRpbmdzLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgY29uc3QgcmV0ID0gd2FzbS5nZXRNYW5pZmVzdFN0b3JlRnJvbUFycmF5QnVmZmVyKGFkZEhlYXBPYmplY3QoYnVmKSwgcHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHRha2VPYmplY3QocmV0KTtcbn1cblxuLyoqXG4qIEBwYXJhbSB7YW55fSBtYW5pZmVzdF9idWZmZXJcbiogQHBhcmFtIHthbnl9IGFzc2V0X2J1ZmZlclxuKiBAcGFyYW0ge3N0cmluZ30gbWltZV90eXBlXG4qIEBwYXJhbSB7c3RyaW5nIHwgdW5kZWZpbmVkfSBbc2V0dGluZ3NdXG4qIEByZXR1cm5zIHtQcm9taXNlPGFueT59XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hbmlmZXN0U3RvcmVGcm9tTWFuaWZlc3RBbmRBc3NldChtYW5pZmVzdF9idWZmZXIsIGFzc2V0X2J1ZmZlciwgbWltZV90eXBlLCBzZXR0aW5ncykge1xuICAgIGNvbnN0IHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChtaW1lX3R5cGUsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICBjb25zdCBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gaXNMaWtlTm9uZShzZXR0aW5ncykgPyAwIDogcGFzc1N0cmluZ1RvV2FzbTAoc2V0dGluZ3MsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICBjb25zdCByZXQgPSB3YXNtLmdldE1hbmlmZXN0U3RvcmVGcm9tTWFuaWZlc3RBbmRBc3NldChhZGRIZWFwT2JqZWN0KG1hbmlmZXN0X2J1ZmZlciksIGFkZEhlYXBPYmplY3QoYXNzZXRfYnVmZmVyKSwgcHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7XG4gICAgcmV0dXJuIHRha2VPYmplY3QocmV0KTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlRXJyb3IoZiwgYXJncykge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBmLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2V4bl9zdG9yZShhZGRIZWFwT2JqZWN0KGUpKTtcbiAgICB9XG59XG5mdW5jdGlvbiBfX3diZ19hZGFwdGVyXzExMihhcmcwLCBhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgd2FzbS53YXNtX2JpbmRnZW5fX2NvbnZlcnRfX2Nsb3N1cmVzX19pbnZva2UyX211dF9faDNjOTc4MzEyZDE4MDVmZTYoYXJnMCwgYXJnMSwgYWRkSGVhcE9iamVjdChhcmcyKSwgYWRkSGVhcE9iamVjdChhcmczKSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIF9fd2JnX2xvYWQobW9kdWxlLCBpbXBvcnRzKSB7XG4gICAgaWYgKHR5cGVvZiBSZXNwb25zZSA9PT0gJ2Z1bmN0aW9uJyAmJiBtb2R1bGUgaW5zdGFuY2VvZiBSZXNwb25zZSkge1xuICAgICAgICBpZiAodHlwZW9mIFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZVN0cmVhbWluZyhtb2R1bGUsIGltcG9ydHMpO1xuXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vZHVsZS5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJykgIT0gJ2FwcGxpY2F0aW9uL3dhc20nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZVN0cmVhbWluZ2AgZmFpbGVkIGJlY2F1c2UgeW91ciBzZXJ2ZXIgZG9lcyBub3Qgc2VydmUgd2FzbSB3aXRoIGBhcHBsaWNhdGlvbi93YXNtYCBNSU1FIHR5cGUuIEZhbGxpbmcgYmFjayB0byBgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGVgIHdoaWNoIGlzIHNsb3dlci4gT3JpZ2luYWwgZXJyb3I6XFxuXCIsIGUpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBieXRlcyA9IGF3YWl0IG1vZHVsZS5hcnJheUJ1ZmZlcigpO1xuICAgICAgICByZXR1cm4gYXdhaXQgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGUoYnl0ZXMsIGltcG9ydHMpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBhd2FpdCBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZShtb2R1bGUsIGltcG9ydHMpO1xuXG4gICAgICAgIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFdlYkFzc2VtYmx5Lkluc3RhbmNlKSB7XG4gICAgICAgICAgICByZXR1cm4geyBpbnN0YW5jZSwgbW9kdWxlIH07XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gX193YmdfZ2V0X2ltcG9ydHMoKSB7XG4gICAgY29uc3QgaW1wb3J0cyA9IHt9O1xuICAgIGltcG9ydHMud2JnID0ge307XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9vYmplY3RfZHJvcF9yZWYgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIHRha2VPYmplY3QoYXJnMCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX3N0cmluZ19uZXcgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2RlYnVnXzQzNDM5ZGNlZTM0NjY0MjAgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoZ2V0T2JqZWN0KGFyZzApLCBnZXRPYmplY3QoYXJnMSkpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfV2luZG93X2QzMTliZTgyMDRmOGE2ODIgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5XaW5kb3c7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2lzX3VuZGVmaW5lZCA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApID09PSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19jcnlwdG9fOWQ2M2M2YmM5YjlmOTc3MiA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaGFuZGxlRXJyb3IoZnVuY3Rpb24gKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLmNyeXB0bztcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9LCBhcmd1bWVudHMpIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfV29ya2VyR2xvYmFsU2NvcGVfMjU1MmU0ZDQ3MjE3MGUzZiA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLldvcmtlckdsb2JhbFNjb3BlO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfY3J5cHRvXzM5MmY3ODNhNTkwYWExODQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uIChhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5jcnlwdG87XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfSwgYXJndW1lbnRzKSB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3N1YnRsZV8yNmMxN2RiMzE2MWRhYmMwID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkuc3VidGxlO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3XzUyNTI0NWUyYjk5MDEyMDQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IE9iamVjdCgpO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3X2EyMjBjZjkwM2FhMDJjYTIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IEFycmF5KCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19wdXNoXzM3Yzg5MDIyZjM0YzAxY2EgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5wdXNoKGdldE9iamVjdChhcmcxKSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ192ZXJpZnlfNTRkZTJiNGFkYmFhOGE5NyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaGFuZGxlRXJyb3IoZnVuY3Rpb24gKGFyZzAsIGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLnZlcmlmeShnZXRPYmplY3QoYXJnMSksIGdldE9iamVjdChhcmcyKSwgZ2V0T2JqZWN0KGFyZzMpLCBnZXRPYmplY3QoYXJnNCkpO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2lzX2ZhbHN5ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSAhZ2V0T2JqZWN0KGFyZzApO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3d2l0aGxlbmd0aF9lYzU0OGY0NDgzODdjOTY4ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgVWludDhBcnJheShhcmcwID4+PiAwKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2xlbmd0aF84MzM5ZmNmNWQ4ZWNkMTJlID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkubGVuZ3RoO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193Ymdfc2V0X2QxZTc5ZTIzODg1MjBmMTggPSBmdW5jdGlvbihhcmcwLCBhcmcxLCBhcmcyKSB7XG4gICAgICAgIGdldE9iamVjdChhcmcwKS5zZXQoZ2V0T2JqZWN0KGFyZzEpLCBhcmcyID4+PiAwKTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2J1ZmZlcl8wNzEwZDFiOWRiZTJlZWE2ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkuYnVmZmVyO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9udW1iZXJfbmV3ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBhcmcwO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193Ymdfc2V0XzY3M2RkYTZjNzNkMTk2MDkgPSBmdW5jdGlvbihhcmcwLCBhcmcxLCBhcmcyKSB7XG4gICAgICAgIGdldE9iamVjdChhcmcwKVthcmcxID4+PiAwXSA9IHRha2VPYmplY3QoYXJnMik7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19uZXdfODYwOGEyYjUxYTVmNjczNyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgTWFwKCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zZXRfZjk3NTEwMjIzNmQzYzUwMiA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICAgICAgZ2V0T2JqZWN0KGFyZzApW3Rha2VPYmplY3QoYXJnMSldID0gdGFrZU9iamVjdChhcmcyKTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3NldF80OTE4NTQzN2YwYWIwNmY4ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSwgYXJnMikge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkuc2V0KGdldE9iamVjdChhcmcxKSwgZ2V0T2JqZWN0KGFyZzIpKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5faXNfc3RyaW5nID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSB0eXBlb2YoZ2V0T2JqZWN0KGFyZzApKSA9PT0gJ3N0cmluZyc7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19ub3dfYjdhMTYyMDEwYTllNzViNCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCByZXQgPSBEYXRlLm5vdygpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9lcnJvcl9uZXcgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBFcnJvcihnZXRTdHJpbmdGcm9tV2FzbTAoYXJnMCwgYXJnMSkpO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfU3RyaW5nX2I5NDEyZjg3OTlmYWFiM2UgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IFN0cmluZyhnZXRPYmplY3QoYXJnMSkpO1xuICAgICAgICBjb25zdCBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAocmV0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIGNvbnN0IGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIGdldERhdGFWaWV3TWVtb3J5MCgpLnNldEludDMyKGFyZzAgKyA0ICogMSwgbGVuMSwgdHJ1ZSk7XG4gICAgICAgIGdldERhdGFWaWV3TWVtb3J5MCgpLnNldEludDMyKGFyZzAgKyA0ICogMCwgcHRyMSwgdHJ1ZSk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19uZXdfNzk2MzgyOTc4ZGZkNGZiMCA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IEVycm9yKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zZXRuYW1lX2VmMDU4YTRjNmZmN2U2ZDQgPSBmdW5jdGlvbihhcmcwLCBhcmcxLCBhcmcyKSB7XG4gICAgICAgIGdldE9iamVjdChhcmcwKS5uYW1lID0gZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzEsIGFyZzIpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3X2I4NWU3MmVkMWJmZDU3ZjkgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc3RhdGUwID0ge2E6IGFyZzAsIGI6IGFyZzF9O1xuICAgICAgICAgICAgdmFyIGNiMCA9IChhcmcwLCBhcmcxKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYSA9IHN0YXRlMC5hO1xuICAgICAgICAgICAgICAgIHN0YXRlMC5hID0gMDtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX193YmdfYWRhcHRlcl8xMTIoYSwgc3RhdGUwLmIsIGFyZzAsIGFyZzEpO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlMC5hID0gYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gbmV3IFByb21pc2UoY2IwKTtcbiAgICAgICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBzdGF0ZTAuYSA9IHN0YXRlMC5iID0gMDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3X2VhMTg4M2UxZTVlODY2ODYgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBVaW50OEFycmF5KGdldE9iamVjdChhcmcwKSk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19mcm9tXzA3OTFkNzQwYTlkMzc4MzAgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IEFycmF5LmZyb20oZ2V0T2JqZWN0KGFyZzApKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fYmlnaW50X2Zyb21fdTY0ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBCaWdJbnQuYXNVaW50Tig2NCwgYXJnMCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19pc0FycmF5XzgzNjRhNTM3MWU5NzM3ZDggPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IEFycmF5LmlzQXJyYXkoZ2V0T2JqZWN0KGFyZzApKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2xlbmd0aF9hZTIyMDc4MTY4YjcyNmY1ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkubGVuZ3RoO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfZ2V0XzNiYWE3MjhmOWQ1OGQzZjYgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKVthcmcxID4+PiAwXTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2lzU2FmZUludGVnZXJfN2YxZWQ1NjIwMGQ5MDY3NCA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gTnVtYmVyLmlzU2FmZUludGVnZXIoZ2V0T2JqZWN0KGFyZzApKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fYXNfbnVtYmVyID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSArZ2V0T2JqZWN0KGFyZzApO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3MF82NTM4NzMzN2E5NWNmNDRkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19nZXRUaW1lXzkxMDU4ODc5MDkzYTE1ODkgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5nZXRUaW1lKCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19uZXdfYWJkYTc2ZTg4M2JhOGE1ZiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgRXJyb3IoKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3N0YWNrXzY1ODI3OWZlNDQ1NDFjZjYgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcxKS5zdGFjaztcbiAgICAgICAgY29uc3QgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHJldCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICBjb25zdCBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICBnZXREYXRhVmlld01lbW9yeTAoKS5zZXRJbnQzMihhcmcwICsgNCAqIDEsIGxlbjEsIHRydWUpO1xuICAgICAgICBnZXREYXRhVmlld01lbW9yeTAoKS5zZXRJbnQzMihhcmcwICsgNCAqIDAsIHB0cjEsIHRydWUpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfZXJyb3JfZjg1MTY2N2FmNzFiY2ZjNiA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgbGV0IGRlZmVycmVkMF8wO1xuICAgICAgICBsZXQgZGVmZXJyZWQwXzE7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkZWZlcnJlZDBfMCA9IGFyZzA7XG4gICAgICAgICAgICBkZWZlcnJlZDBfMSA9IGFyZzE7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShkZWZlcnJlZDBfMCwgZGVmZXJyZWQwXzEsIDEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19jcnlwdG9fMWQxZjIyODI0YTZhMDgwYyA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLmNyeXB0bztcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5faXNfb2JqZWN0ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCB2YWwgPSBnZXRPYmplY3QoYXJnMCk7XG4gICAgICAgIGNvbnN0IHJldCA9IHR5cGVvZih2YWwpID09PSAnb2JqZWN0JyAmJiB2YWwgIT09IG51bGw7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19wcm9jZXNzXzRhNzI4NDdjYzUwMzk5NWIgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5wcm9jZXNzO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfdmVyc2lvbnNfZjY4NjU2NWU1ODZkZDkzNSA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLnZlcnNpb25zO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193Ymdfbm9kZV8xMDRhMmZmOGQ2ZWEwM2EyID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkubm9kZTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3JlcXVpcmVfY2NhOTBiMWE5NGEwMjU1YiA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaGFuZGxlRXJyb3IoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCByZXQgPSBtb2R1bGUucmVxdWlyZTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9LCBhcmd1bWVudHMpIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9pc19mdW5jdGlvbiA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gdHlwZW9mKGdldE9iamVjdChhcmcwKSkgPT09ICdmdW5jdGlvbic7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19tc0NyeXB0b19lYjA1ZTYyYjUzMGExNTA4ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkubXNDcnlwdG87XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX21lbW9yeSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCByZXQgPSB3YXNtLm1lbW9yeTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2J1ZmZlcl9iN2IwOGFmNzliMGIwOTc0ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkuYnVmZmVyO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3d2l0aGJ5dGVvZmZzZXRhbmRsZW5ndGhfOGEyY2I5Y2E5NmIyN2VjOSA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IFVpbnQ4QXJyYXkoZ2V0T2JqZWN0KGFyZzApLCBhcmcxID4+PiAwLCBhcmcyID4+PiAwKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3JhbmRvbUZpbGxTeW5jXzVjOWM5NTVhYTU2YjYwNDkgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uIChhcmcwLCBhcmcxKSB7XG4gICAgICAgIGdldE9iamVjdChhcmcwKS5yYW5kb21GaWxsU3luYyh0YWtlT2JqZWN0KGFyZzEpKTtcbiAgICB9LCBhcmd1bWVudHMpIH07XG4gICAgaW1wb3J0cy53YmcuX193Ymdfc3ViYXJyYXlfN2MyZTM1NzZhZmUxODFkMSA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLnN1YmFycmF5KGFyZzEgPj4+IDAsIGFyZzIgPj4+IDApO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfZ2V0UmFuZG9tVmFsdWVzXzNhYTU2YWE2ZWRlYzg3NGMgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uIChhcmcwLCBhcmcxKSB7XG4gICAgICAgIGdldE9iamVjdChhcmcwKS5nZXRSYW5kb21WYWx1ZXMoZ2V0T2JqZWN0KGFyZzEpKTtcbiAgICB9LCBhcmd1bWVudHMpIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9vYmplY3RfY2xvbmVfcmVmID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19jYWxsXzg5YWYwNjBiNGUxNTIzZjIgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uIChhcmcwLCBhcmcxLCBhcmcyKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5jYWxsKGdldE9iamVjdChhcmcxKSwgZ2V0T2JqZWN0KGFyZzIpKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9LCBhcmd1bWVudHMpIH07XG4gICAgaW1wb3J0cy53YmcuX193Ymdfc2V0X2VhY2M3ZDczZmVmYWFmZGYgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uIChhcmcwLCBhcmcxLCBhcmcyKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IFJlZmxlY3Quc2V0KGdldE9iamVjdChhcmcwKSwgZ2V0T2JqZWN0KGFyZzEpLCBnZXRPYmplY3QoYXJnMikpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zZWxmXzMwOTNkNWQxZjdiY2I2ODIgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gc2VsZi5zZWxmO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ193aW5kb3dfM2JjZmM0ZDMxYmMwMTJmOCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaGFuZGxlRXJyb3IoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCByZXQgPSB3aW5kb3cud2luZG93O1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19nbG9iYWxUaGlzXzg2YjIyMmUxM2JkZjMyZWQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2xvYmFsVGhpcy5nbG9iYWxUaGlzO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19nbG9iYWxfZTVhM2ZlNTZmOGJlOTQ4NSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaGFuZGxlRXJyb3IoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCByZXQgPSBnbG9iYWwuZ2xvYmFsO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19uZXdub2FyZ3NfNzYzMTNiZDZmZjM1ZDBmMiA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IEZ1bmN0aW9uKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19jYWxsXzEwODRhMTExMzI5ZTY4Y2UgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uIChhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5jYWxsKGdldE9iamVjdChhcmcxKSk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfSwgYXJndW1lbnRzKSB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fanN2YWxfbG9vc2VfZXEgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKSA9PSBnZXRPYmplY3QoYXJnMSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2Jvb2xlYW5fZ2V0ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCB2ID0gZ2V0T2JqZWN0KGFyZzApO1xuICAgICAgICBjb25zdCByZXQgPSB0eXBlb2YodikgPT09ICdib29sZWFuJyA/ICh2ID8gMSA6IDApIDogMjtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fbnVtYmVyX2dldCA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3Qgb2JqID0gZ2V0T2JqZWN0KGFyZzEpO1xuICAgICAgICBjb25zdCByZXQgPSB0eXBlb2Yob2JqKSA9PT0gJ251bWJlcicgPyBvYmogOiB1bmRlZmluZWQ7XG4gICAgICAgIGdldERhdGFWaWV3TWVtb3J5MCgpLnNldEZsb2F0NjQoYXJnMCArIDggKiAxLCBpc0xpa2VOb25lKHJldCkgPyAwIDogcmV0LCB0cnVlKTtcbiAgICAgICAgZ2V0RGF0YVZpZXdNZW1vcnkwKCkuc2V0SW50MzIoYXJnMCArIDQgKiAwLCAhaXNMaWtlTm9uZShyZXQpLCB0cnVlKTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fc3RyaW5nX2dldCA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3Qgb2JqID0gZ2V0T2JqZWN0KGFyZzEpO1xuICAgICAgICBjb25zdCByZXQgPSB0eXBlb2Yob2JqKSA9PT0gJ3N0cmluZycgPyBvYmogOiB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBwdHIxID0gaXNMaWtlTm9uZShyZXQpID8gMCA6IHBhc3NTdHJpbmdUb1dhc20wKHJldCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgZ2V0RGF0YVZpZXdNZW1vcnkwKCkuc2V0SW50MzIoYXJnMCArIDQgKiAxLCBsZW4xLCB0cnVlKTtcbiAgICAgICAgZ2V0RGF0YVZpZXdNZW1vcnkwKCkuc2V0SW50MzIoYXJnMCArIDQgKiAwLCBwdHIxLCB0cnVlKTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2luc3RhbmNlb2ZfVWludDhBcnJheV8yNDdhOTE0Mjc1MzI0OTllID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBsZXQgcmVzdWx0O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzdWx0ID0gZ2V0T2JqZWN0KGFyZzApIGluc3RhbmNlb2YgVWludDhBcnJheTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmV0ID0gcmVzdWx0O1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfaW5zdGFuY2VvZl9BcnJheUJ1ZmZlcl82MWRmYzMxOTgzNzNjOTAyID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBsZXQgcmVzdWx0O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzdWx0ID0gZ2V0T2JqZWN0KGFyZzApIGluc3RhbmNlb2YgQXJyYXlCdWZmZXI7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJldCA9IHJlc3VsdDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fZGVidWdfc3RyaW5nID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBkZWJ1Z1N0cmluZyhnZXRPYmplY3QoYXJnMSkpO1xuICAgICAgICBjb25zdCBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAocmV0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIGNvbnN0IGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIGdldERhdGFWaWV3TWVtb3J5MCgpLnNldEludDMyKGFyZzAgKyA0ICogMSwgbGVuMSwgdHJ1ZSk7XG4gICAgICAgIGdldERhdGFWaWV3TWVtb3J5MCgpLnNldEludDMyKGFyZzAgKyA0ICogMCwgcHRyMSwgdHJ1ZSk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX3Rocm93ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzAsIGFyZzEpKTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3RoZW5fOTVlNmVkYzBmODliNzNiMSA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLnRoZW4oZ2V0T2JqZWN0KGFyZzEpKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3F1ZXVlTWljcm90YXNrXzEyYTMwMjM0ZGI0MDQ1ZDMgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIHF1ZXVlTWljcm90YXNrKGdldE9iamVjdChhcmcwKSk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ190aGVuXzg3NmJiM2M2MzM3NDVjYzYgPSBmdW5jdGlvbihhcmcwLCBhcmcxLCBhcmcyKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS50aGVuKGdldE9iamVjdChhcmcxKSwgZ2V0T2JqZWN0KGFyZzIpKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3F1ZXVlTWljcm90YXNrXzQ4NDIxYjNjYzkwNTJiNjggPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5xdWV1ZU1pY3JvdGFzaztcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3Jlc29sdmVfNTcwNDU4Y2I5OWQ1NmE0MyA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gUHJvbWlzZS5yZXNvbHZlKGdldE9iamVjdChhcmcwKSk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2NiX2Ryb3AgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IG9iaiA9IHRha2VPYmplY3QoYXJnMCkub3JpZ2luYWw7XG4gICAgICAgIGlmIChvYmouY250LS0gPT0gMSkge1xuICAgICAgICAgICAgb2JqLmEgPSAwO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmV0ID0gZmFsc2U7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19kZWJ1Z19kNzc4MDgxMGIzYTkzNjMyID0gZnVuY3Rpb24oYXJnMCwgYXJnMSwgYXJnMiwgYXJnMykge1xuICAgICAgICBjb25zb2xlLmRlYnVnKGdldE9iamVjdChhcmcwKSwgZ2V0T2JqZWN0KGFyZzEpLCBnZXRPYmplY3QoYXJnMiksIGdldE9iamVjdChhcmczKSk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19lcnJvcl9mMDJmM2Q2NmI0MmM2MjUxID0gZnVuY3Rpb24oYXJnMCwgYXJnMSwgYXJnMiwgYXJnMykge1xuICAgICAgICBjb25zb2xlLmVycm9yKGdldE9iamVjdChhcmcwKSwgZ2V0T2JqZWN0KGFyZzEpLCBnZXRPYmplY3QoYXJnMiksIGdldE9iamVjdChhcmczKSk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19pbmZvXzEyM2Q4YzM1ZWMxNDM4NGEgPSBmdW5jdGlvbihhcmcwLCBhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhnZXRPYmplY3QoYXJnMCksIGdldE9iamVjdChhcmcxKSwgZ2V0T2JqZWN0KGFyZzIpLCBnZXRPYmplY3QoYXJnMykpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbG9nXzIyYWVjZjRjYzJlZGMzMTkgPSBmdW5jdGlvbihhcmcwLCBhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGdldE9iamVjdChhcmcwKSwgZ2V0T2JqZWN0KGFyZzEpLCBnZXRPYmplY3QoYXJnMiksIGdldE9iamVjdChhcmczKSk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ193YXJuXzYwOTI0ZmNmMzIxMzk5ZjAgPSBmdW5jdGlvbihhcmcwLCBhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihnZXRPYmplY3QoYXJnMCksIGdldE9iamVjdChhcmcxKSwgZ2V0T2JqZWN0KGFyZzIpLCBnZXRPYmplY3QoYXJnMykpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfaW1wb3J0S2V5X2Q4NDA5YTAwYjI0YjM0NTIgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uIChhcmcwLCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0LCBhcmc1LCBhcmc2KSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5pbXBvcnRLZXkoZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzEsIGFyZzIpLCBnZXRPYmplY3QoYXJnMyksIGdldE9iamVjdChhcmc0KSwgYXJnNSAhPT0gMCwgZ2V0T2JqZWN0KGFyZzYpKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9LCBhcmd1bWVudHMpIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9jbG9zdXJlX3dyYXBwZXI1NTY5ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSwgYXJnMikge1xuICAgICAgICBjb25zdCByZXQgPSBtYWtlTXV0Q2xvc3VyZShhcmcwLCBhcmcxLCAyOTcsIF9fd2JnX2FkYXB0ZXJfNDIpO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG5cbiAgICByZXR1cm4gaW1wb3J0cztcbn1cblxuZnVuY3Rpb24gX193YmdfaW5pdF9tZW1vcnkoaW1wb3J0cywgbWVtb3J5KSB7XG5cbn1cblxuZnVuY3Rpb24gX193YmdfZmluYWxpemVfaW5pdChpbnN0YW5jZSwgbW9kdWxlKSB7XG4gICAgd2FzbSA9IGluc3RhbmNlLmV4cG9ydHM7XG4gICAgX193YmdfaW5pdC5fX3diaW5kZ2VuX3dhc21fbW9kdWxlID0gbW9kdWxlO1xuICAgIGNhY2hlZERhdGFWaWV3TWVtb3J5MCA9IG51bGw7XG4gICAgY2FjaGVkVWludDhBcnJheU1lbW9yeTAgPSBudWxsO1xuXG5cbiAgICB3YXNtLl9fd2JpbmRnZW5fc3RhcnQoKTtcbiAgICByZXR1cm4gd2FzbTtcbn1cblxuZnVuY3Rpb24gaW5pdFN5bmMobW9kdWxlKSB7XG4gICAgaWYgKHdhc20gIT09IHVuZGVmaW5lZCkgcmV0dXJuIHdhc207XG5cblxuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YobW9kdWxlKSA9PT0gT2JqZWN0LnByb3RvdHlwZSlcbiAgICAoe21vZHVsZX0gPSBtb2R1bGUpXG4gICAgZWxzZVxuICAgIGNvbnNvbGUud2FybigndXNpbmcgZGVwcmVjYXRlZCBwYXJhbWV0ZXJzIGZvciBgaW5pdFN5bmMoKWA7IHBhc3MgYSBzaW5nbGUgb2JqZWN0IGluc3RlYWQnKVxuXG4gICAgY29uc3QgaW1wb3J0cyA9IF9fd2JnX2dldF9pbXBvcnRzKCk7XG5cbiAgICBfX3diZ19pbml0X21lbW9yeShpbXBvcnRzKTtcblxuICAgIGlmICghKG1vZHVsZSBpbnN0YW5jZW9mIFdlYkFzc2VtYmx5Lk1vZHVsZSkpIHtcbiAgICAgICAgbW9kdWxlID0gbmV3IFdlYkFzc2VtYmx5Lk1vZHVsZShtb2R1bGUpO1xuICAgIH1cblxuICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IFdlYkFzc2VtYmx5Lkluc3RhbmNlKG1vZHVsZSwgaW1wb3J0cyk7XG5cbiAgICByZXR1cm4gX193YmdfZmluYWxpemVfaW5pdChpbnN0YW5jZSwgbW9kdWxlKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX193YmdfaW5pdChtb2R1bGVfb3JfcGF0aCkge1xuICAgIGlmICh3YXNtICE9PSB1bmRlZmluZWQpIHJldHVybiB3YXNtO1xuXG5cbiAgICBpZiAodHlwZW9mIG1vZHVsZV9vcl9wYXRoICE9PSAndW5kZWZpbmVkJyAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YobW9kdWxlX29yX3BhdGgpID09PSBPYmplY3QucHJvdG90eXBlKVxuICAgICh7bW9kdWxlX29yX3BhdGh9ID0gbW9kdWxlX29yX3BhdGgpXG4gICAgZWxzZVxuICAgIGNvbnNvbGUud2FybigndXNpbmcgZGVwcmVjYXRlZCBwYXJhbWV0ZXJzIGZvciB0aGUgaW5pdGlhbGl6YXRpb24gZnVuY3Rpb247IHBhc3MgYSBzaW5nbGUgb2JqZWN0IGluc3RlYWQnKVxuXG4gICAgaWYgKHR5cGVvZiBtb2R1bGVfb3JfcGF0aCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbW9kdWxlX29yX3BhdGggPSBuZXcgVVJMKCd0b29sa2l0X2JnLndhc20nLCBpbXBvcnQubWV0YS51cmwpO1xuICAgIH1cbiAgICBjb25zdCBpbXBvcnRzID0gX193YmdfZ2V0X2ltcG9ydHMoKTtcblxuICAgIGlmICh0eXBlb2YgbW9kdWxlX29yX3BhdGggPT09ICdzdHJpbmcnIHx8ICh0eXBlb2YgUmVxdWVzdCA9PT0gJ2Z1bmN0aW9uJyAmJiBtb2R1bGVfb3JfcGF0aCBpbnN0YW5jZW9mIFJlcXVlc3QpIHx8ICh0eXBlb2YgVVJMID09PSAnZnVuY3Rpb24nICYmIG1vZHVsZV9vcl9wYXRoIGluc3RhbmNlb2YgVVJMKSkge1xuICAgICAgICBtb2R1bGVfb3JfcGF0aCA9IGZldGNoKG1vZHVsZV9vcl9wYXRoKTtcbiAgICB9XG5cbiAgICBfX3diZ19pbml0X21lbW9yeShpbXBvcnRzKTtcblxuICAgIGNvbnN0IHsgaW5zdGFuY2UsIG1vZHVsZSB9ID0gYXdhaXQgX193YmdfbG9hZChhd2FpdCBtb2R1bGVfb3JfcGF0aCwgaW1wb3J0cyk7XG5cbiAgICByZXR1cm4gX193YmdfZmluYWxpemVfaW5pdChpbnN0YW5jZSwgbW9kdWxlKTtcbn1cblxuZXhwb3J0IHsgaW5pdFN5bmMgfTtcbmV4cG9ydCBkZWZhdWx0IF9fd2JnX2luaXQ7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDIxIEFkb2JlXG4gKiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIE5PVElDRTogQWRvYmUgcGVybWl0cyB5b3UgdG8gdXNlLCBtb2RpZnksIGFuZCBkaXN0cmlidXRlIHRoaXMgZmlsZSBpblxuICogYWNjb3JkYW5jZSB3aXRoIHRoZSB0ZXJtcyBvZiB0aGUgQWRvYmUgbGljZW5zZSBhZ3JlZW1lbnQgYWNjb21wYW55aW5nXG4gKiBpdC5cbiAqL1xuXG5pbXBvcnQgeyBzZXR1cFdvcmtlciB9IGZyb20gJy4vc3JjL2xpYi9wb29sL3dvcmtlcic7XG5cbmltcG9ydCB7XG4gIGRlZmF1bHQgYXMgaW5pdERldGVjdG9yLFxuICBzY2FuX2FycmF5X2J1ZmZlcixcbn0gZnJvbSAnQGNvbnRlbnRhdXRoL2RldGVjdG9yJztcbmltcG9ydCB7XG4gIE1hbmlmZXN0U3RvcmUsXG4gIGdldE1hbmlmZXN0U3RvcmVGcm9tQXJyYXlCdWZmZXIsXG4gIGdldE1hbmlmZXN0U3RvcmVGcm9tTWFuaWZlc3RBbmRBc3NldCxcbiAgZGVmYXVsdCBhcyBpbml0VG9vbGtpdCxcbn0gZnJvbSAnQGNvbnRlbnRhdXRoL3Rvb2xraXQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElTY2FuUmVzdWx0IHtcbiAgZm91bmQ6IGJvb2xlYW47XG4gIG9mZnNldD86IG51bWJlcjtcbn1cblxuY29uc3Qgd29ya2VyID0ge1xuICBhc3luYyBjb21waWxlV2FzbShidWZmZXI6IEFycmF5QnVmZmVyKTogUHJvbWlzZTxXZWJBc3NlbWJseS5Nb2R1bGU+IHtcbiAgICByZXR1cm4gV2ViQXNzZW1ibHkuY29tcGlsZShidWZmZXIpO1xuICB9LFxuICBhc3luYyBnZXRSZXBvcnQoXG4gICAgd2FzbTogV2ViQXNzZW1ibHkuTW9kdWxlLFxuICAgIGJ1ZmZlcjogQXJyYXlCdWZmZXIsXG4gICAgdHlwZTogc3RyaW5nLFxuICAgIHNldHRpbmdzPzogc3RyaW5nLFxuICApOiBQcm9taXNlPE1hbmlmZXN0U3RvcmU+IHtcbiAgICBhd2FpdCBpbml0VG9vbGtpdCh3YXNtKTtcbiAgICByZXR1cm4gZ2V0TWFuaWZlc3RTdG9yZUZyb21BcnJheUJ1ZmZlcihidWZmZXIsIHR5cGUsIHNldHRpbmdzKTtcbiAgfSxcbiAgYXN5bmMgZ2V0UmVwb3J0RnJvbUFzc2V0QW5kTWFuaWZlc3RCdWZmZXIoXG4gICAgd2FzbTogV2ViQXNzZW1ibHkuTW9kdWxlLFxuICAgIG1hbmlmZXN0QnVmZmVyOiBBcnJheUJ1ZmZlcixcbiAgICBhc3NldDogQmxvYixcbiAgICBzZXR0aW5ncz86IHN0cmluZyxcbiAgKSB7XG4gICAgYXdhaXQgaW5pdFRvb2xraXQod2FzbSk7XG4gICAgY29uc3QgYXNzZXRCdWZmZXIgPSBhd2FpdCBhc3NldC5hcnJheUJ1ZmZlcigpO1xuICAgIHJldHVybiBnZXRNYW5pZmVzdFN0b3JlRnJvbU1hbmlmZXN0QW5kQXNzZXQoXG4gICAgICBtYW5pZmVzdEJ1ZmZlcixcbiAgICAgIGFzc2V0QnVmZmVyLFxuICAgICAgYXNzZXQudHlwZSxcbiAgICAgIHNldHRpbmdzLFxuICAgICk7XG4gIH0sXG4gIGFzeW5jIHNjYW5JbnB1dChcbiAgICB3YXNtOiBXZWJBc3NlbWJseS5Nb2R1bGUsXG4gICAgYnVmZmVyOiBBcnJheUJ1ZmZlcixcbiAgKTogUHJvbWlzZTxJU2NhblJlc3VsdD4ge1xuICAgIGF3YWl0IGluaXREZXRlY3Rvcih3YXNtKTtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gYXdhaXQgc2Nhbl9hcnJheV9idWZmZXIoYnVmZmVyKTtcbiAgICAgIHJldHVybiB7IGZvdW5kOiB0cnVlLCBvZmZzZXQgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IGZvdW5kOiBmYWxzZSB9O1xuICAgIH1cbiAgfSxcbn07XG5cbmV4cG9ydCB0eXBlIFdvcmtlciA9IHR5cGVvZiB3b3JrZXI7XG5cbnNldHVwV29ya2VyKHdvcmtlcik7XG4iXSwibmFtZXMiOlsid2FzbSIsImNhY2hlZFRleHREZWNvZGVyIiwiZ2V0U3RyaW5nRnJvbVdhc20wIiwiV0FTTV9WRUNUT1JfTEVOIiwiY2FjaGVkVGV4dEVuY29kZXIiLCJlbmNvZGVTdHJpbmciLCJwYXNzU3RyaW5nVG9XYXNtMCIsImlzTGlrZU5vbmUiLCJkZWJ1Z1N0cmluZyIsImluaXRUb29sa2l0IiwiaW5pdERldGVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7OztJQU9HO0lBTUg7SUFDTSxTQUFVLGNBQWMsQ0FBQyxLQUEwQixFQUFBO0lBQ3ZELElBQUEsT0FBTyxNQUFNLENBQUMs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
