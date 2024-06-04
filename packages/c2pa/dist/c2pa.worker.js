
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

    let cachedUint8Memory0$1 = new Uint8Array();

    function getUint8Memory0$1() {
        if (cachedUint8Memory0$1.byteLength === 0) {
            cachedUint8Memory0$1 = new Uint8Array(wasm$1.memory.buffer);
        }
        return cachedUint8Memory0$1;
    }

    function getStringFromWasm0$1(ptr, len) {
        return cachedTextDecoder$1.decode(getUint8Memory0$1().subarray(ptr, ptr + len));
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
            getUint8Memory0$1().subarray(ptr, ptr + buf.length).set(buf);
            WASM_VECTOR_LEN$1 = buf.length;
            return ptr;
        }

        let len = arg.length;
        let ptr = malloc(len);

        const mem = getUint8Memory0$1();

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
            const view = getUint8Memory0$1().subarray(ptr + offset, ptr + len);
            const ret = encodeString$1(arg, view);

            offset += ret.written;
        }

        WASM_VECTOR_LEN$1 = offset;
        return ptr;
    }

    function isLikeNone$1(x) {
        return x === undefined || x === null;
    }

    let cachedInt32Memory0$1 = new Int32Array();

    function getInt32Memory0$1() {
        if (cachedInt32Memory0$1.byteLength === 0) {
            cachedInt32Memory0$1 = new Int32Array(wasm$1.memory.buffer);
        }
        return cachedInt32Memory0$1;
    }

    let cachedFloat64Memory0$1 = new Float64Array();

    function getFloat64Memory0$1() {
        if (cachedFloat64Memory0$1.byteLength === 0) {
            cachedFloat64Memory0$1 = new Float64Array(wasm$1.memory.buffer);
        }
        return cachedFloat64Memory0$1;
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
            var r0 = getInt32Memory0$1()[retptr / 4 + 0];
            var r1 = getInt32Memory0$1()[retptr / 4 + 1];
            var r2 = getInt32Memory0$1()[retptr / 4 + 2];
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
            getInt32Memory0$1()[arg0 / 4 + 1] = len0;
            getInt32Memory0$1()[arg0 / 4 + 0] = ptr0;
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
        imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
            const ret = new Error(getStringFromWasm0$1(arg0, arg1));
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
            getInt32Memory0$1()[arg0 / 4 + 1] = len0;
            getInt32Memory0$1()[arg0 / 4 + 0] = ptr0;
        };
        imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'number' ? obj : undefined;
            getFloat64Memory0$1()[arg0 / 8 + 1] = isLikeNone$1(ret) ? 0 : ret;
            getInt32Memory0$1()[arg0 / 4 + 0] = !isLikeNone$1(ret);
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
        imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
            const ret = debugString$1(arg1);
            const ptr0 = passStringToWasm0$1(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN$1;
            getInt32Memory0$1()[arg0 / 4 + 1] = len0;
            getInt32Memory0$1()[arg0 / 4 + 0] = ptr0;
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
        cachedFloat64Memory0$1 = new Float64Array();
        cachedInt32Memory0$1 = new Int32Array();
        cachedUint8Memory0$1 = new Uint8Array();

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
    let cachedUint8Memory0 = null;

    function getUint8Memory0() {
        if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
            cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
        }
        return cachedUint8Memory0;
    }

    function getStringFromWasm0(ptr, len) {
        ptr = ptr >>> 0;
        return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
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

    let cachedFloat64Memory0 = null;

    function getFloat64Memory0() {
        if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
            cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
        }
        return cachedFloat64Memory0;
    }

    let cachedInt32Memory0 = null;

    function getInt32Memory0() {
        if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
            cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
        }
        return cachedInt32Memory0;
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
            getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
            WASM_VECTOR_LEN = buf.length;
            return ptr;
        }

        let len = arg.length;
        let ptr = malloc(len, 1) >>> 0;

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
            ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
            const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
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
        wasm.wasm_bindgen__convert__closures__invoke1_mut__h051d11a3f3f791ba(arg0, arg1, addHeapObject(arg2));
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
        wasm.wasm_bindgen__convert__closures__invoke2_mut__h0ca97427450634fd(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
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
        imports.wbg.__wbg_debug_9721f1bee7bcd226 = function(arg0, arg1) {
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
        imports.wbg.__wbg_crypto_11bbe2f671f5bc19 = function() { return handleError(function (arg0) {
            const ret = getObject(arg0).crypto;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_WorkerGlobalScope_2552e4d472170e3f = function(arg0) {
            const ret = getObject(arg0).WorkerGlobalScope;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_crypto_88609e89336ce904 = function() { return handleError(function (arg0) {
            const ret = getObject(arg0).crypto;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_subtle_3588877c3898dad1 = function(arg0) {
            const ret = getObject(arg0).subtle;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_new_72fb9a18b5ae2624 = function() {
            const ret = new Object();
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_new_16b304a2cfa7ff4a = function() {
            const ret = new Array();
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_push_a5b05aedc7234f9f = function(arg0, arg1) {
            const ret = getObject(arg0).push(getObject(arg1));
            return ret;
        };
        imports.wbg.__wbg_verify_3f943c5904222a39 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = getObject(arg0).verify(getObject(arg1), getObject(arg2), getObject(arg3), getObject(arg4));
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbindgen_is_falsy = function(arg0) {
            const ret = !getObject(arg0);
            return ret;
        };
        imports.wbg.__wbg_newwithlength_e9b4878cebadb3d3 = function(arg0) {
            const ret = new Uint8Array(arg0 >>> 0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_length_c20a40f15020d68a = function(arg0) {
            const ret = getObject(arg0).length;
            return ret;
        };
        imports.wbg.__wbg_set_a47bac70306a19a7 = function(arg0, arg1, arg2) {
            getObject(arg0).set(getObject(arg1), arg2 >>> 0);
        };
        imports.wbg.__wbg_buffer_dd7f74bc60f1faab = function(arg0) {
            const ret = getObject(arg0).buffer;
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_number_new = function(arg0) {
            const ret = arg0;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_set_d4638f722068f043 = function(arg0, arg1, arg2) {
            getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
        };
        imports.wbg.__wbg_new_d9bc3a0147634640 = function() {
            const ret = new Map();
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_set_f975102236d3c502 = function(arg0, arg1, arg2) {
            getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
        };
        imports.wbg.__wbg_set_8417257aaedc936b = function(arg0, arg1, arg2) {
            const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_is_string = function(arg0) {
            const ret = typeof(getObject(arg0)) === 'string';
            return ret;
        };
        imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
            const ret = BigInt.asUintN(64, arg0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_now_3014639a94423537 = function() {
            const ret = Date.now();
            return ret;
        };
        imports.wbg.__wbg_new_63b92bc8671ed464 = function(arg0) {
            const ret = new Uint8Array(getObject(arg0));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_from_89e3fc3ba5e6fb48 = function(arg0) {
            const ret = Array.from(getObject(arg0));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_String_b9412f8799faab3e = function(arg0, arg1) {
            const ret = String(getObject(arg1));
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len1;
            getInt32Memory0()[arg0 / 4 + 0] = ptr1;
        };
        imports.wbg.__wbg_new_28c511d9baebfa89 = function(arg0, arg1) {
            const ret = new Error(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_setname_c145a9049d9af5bf = function(arg0, arg1, arg2) {
            getObject(arg0).name = getStringFromWasm0(arg1, arg2);
        };
        imports.wbg.__wbg_new_81740750da40724f = function(arg0, arg1) {
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
        imports.wbg.__wbg_isArray_2ab64d95e09ea0ae = function(arg0) {
            const ret = Array.isArray(getObject(arg0));
            return ret;
        };
        imports.wbg.__wbg_length_cd7af8117672b8b8 = function(arg0) {
            const ret = getObject(arg0).length;
            return ret;
        };
        imports.wbg.__wbg_get_bd8e338fbd5f5cc8 = function(arg0, arg1) {
            const ret = getObject(arg0)[arg1 >>> 0];
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_isSafeInteger_f7b04ef02296c4d2 = function(arg0) {
            const ret = Number.isSafeInteger(getObject(arg0));
            return ret;
        };
        imports.wbg.__wbindgen_as_number = function(arg0) {
            const ret = +getObject(arg0);
            return ret;
        };
        imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
            const ret = new Error(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_new0_7d84e5b2cd9fdc73 = function() {
            const ret = new Date();
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_getTime_2bc4375165f02d15 = function(arg0) {
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
            getInt32Memory0()[arg0 / 4 + 1] = len1;
            getInt32Memory0()[arg0 / 4 + 0] = ptr1;
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
        imports.wbg.__wbg_subarray_a1f73cd4b5b42fe1 = function(arg0, arg1, arg2) {
            const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_getRandomValues_7e42b4fb8779dc6d = function() { return handleError(function (arg0, arg1) {
            getObject(arg0).getRandomValues(getObject(arg1));
        }, arguments) };
        imports.wbg.__wbindgen_memory = function() {
            const ret = wasm.memory;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_buffer_12d079cc21e14bdb = function(arg0) {
            const ret = getObject(arg0).buffer;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb = function(arg0, arg1, arg2) {
            const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_randomFillSync_b70ccbdf4926a99d = function() { return handleError(function (arg0, arg1) {
            getObject(arg0).randomFillSync(takeObject(arg1));
        }, arguments) };
        imports.wbg.__wbg_crypto_d05b68a3572bb8ca = function(arg0) {
            const ret = getObject(arg0).crypto;
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_is_object = function(arg0) {
            const val = getObject(arg0);
            const ret = typeof(val) === 'object' && val !== null;
            return ret;
        };
        imports.wbg.__wbg_process_b02b3570280d0366 = function(arg0) {
            const ret = getObject(arg0).process;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_versions_c1cb42213cedf0f5 = function(arg0) {
            const ret = getObject(arg0).versions;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_node_43b1089f407e4ec2 = function(arg0) {
            const ret = getObject(arg0).node;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_require_9a7e0f667ead4995 = function() { return handleError(function () {
            const ret = module.require;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbindgen_is_function = function(arg0) {
            const ret = typeof(getObject(arg0)) === 'function';
            return ret;
        };
        imports.wbg.__wbg_msCrypto_10fc94afee92bd76 = function(arg0) {
            const ret = getObject(arg0).msCrypto;
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
            const ret = getObject(arg0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_self_ce0dbfc45cf2f5be = function() { return handleError(function () {
            const ret = self.self;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_window_c6fb939a7f436783 = function() { return handleError(function () {
            const ret = window.window;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_globalThis_d1e6af4856ba331b = function() { return handleError(function () {
            const ret = globalThis.globalThis;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_global_207b558942527489 = function() { return handleError(function () {
            const ret = global.global;
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_newnoargs_e258087cd0daa0ea = function(arg0, arg1) {
            const ret = new Function(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_call_27c0f87801dedf93 = function() { return handleError(function (arg0, arg1) {
            const ret = getObject(arg0).call(getObject(arg1));
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_call_b3ca7c6051f9bec1 = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_set_1f9b04f170055d33 = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
            return ret;
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
            getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
            getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
        };
        imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
            const obj = getObject(arg1);
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len1;
            getInt32Memory0()[arg0 / 4 + 0] = ptr1;
        };
        imports.wbg.__wbg_instanceof_Uint8Array_2b3bbecd033d19f6 = function(arg0) {
            let result;
            try {
                result = getObject(arg0) instanceof Uint8Array;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_instanceof_ArrayBuffer_836825be07d4c9d2 = function(arg0) {
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
            getInt32Memory0()[arg0 / 4 + 1] = len1;
            getInt32Memory0()[arg0 / 4 + 0] = ptr1;
        };
        imports.wbg.__wbindgen_throw = function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        };
        imports.wbg.__wbg_then_a73caa9a87991566 = function(arg0, arg1, arg2) {
            const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
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
        imports.wbg.__wbg_then_0c86a60e8fcfe9f6 = function(arg0, arg1) {
            const ret = getObject(arg0).then(getObject(arg1));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_queueMicrotask_481971b0d87f3dd4 = function(arg0) {
            queueMicrotask(getObject(arg0));
        };
        imports.wbg.__wbg_queueMicrotask_3cbae2ec6b6cd3d6 = function(arg0) {
            const ret = getObject(arg0).queueMicrotask;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_resolve_b0083a7967828ec8 = function(arg0) {
            const ret = Promise.resolve(getObject(arg0));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_debug_7d879afce6cf56cb = function(arg0, arg1, arg2, arg3) {
            console.debug(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
        };
        imports.wbg.__wbg_error_696630710900ec44 = function(arg0, arg1, arg2, arg3) {
            console.error(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
        };
        imports.wbg.__wbg_info_80803d9a3f0aad16 = function(arg0, arg1, arg2, arg3) {
            console.info(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
        };
        imports.wbg.__wbg_log_151eb4333ef0fe39 = function(arg0, arg1, arg2, arg3) {
            console.log(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
        };
        imports.wbg.__wbg_warn_5d3f783b0bae8943 = function(arg0, arg1, arg2, arg3) {
            console.warn(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
        };
        imports.wbg.__wbg_importKey_ffc13175d345168c = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            const ret = getObject(arg0).importKey(getStringFromWasm0(arg1, arg2), getObject(arg3), getObject(arg4), arg5 !== 0, getObject(arg6));
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbindgen_closure_wrapper5465 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 186, __wbg_adapter_42);
            return addHeapObject(ret);
        };

        return imports;
    }

    function __wbg_finalize_init(instance, module) {
        wasm = instance.exports;
        __wbg_init.__wbindgen_wasm_module = module;
        cachedFloat64Memory0 = null;
        cachedInt32Memory0 = null;
        cachedUint8Memory0 = null;

        wasm.__wbindgen_start();
        return wasm;
    }

    async function __wbg_init(input) {
        if (wasm !== undefined) return wasm;

        if (typeof input === 'undefined') {
            input = new URL('toolkit_bg.wasm', (typeof document === 'undefined' && typeof location === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : typeof document === 'undefined' ? location.href : (document.currentScript && document.currentScript.src || new URL('c2pa.worker.js', document.baseURI).href)));
        }
        const imports = __wbg_get_imports();

        if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
            input = fetch(input);
        }

        const { instance, module } = await __wbg_load(await input, imports);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYzJwYS53b3JrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvcG9vbC9lcnJvci50cyIsIi4uLy4uL3NyYy9saWIvcG9vbC93b3JrZXIudHMiLCIuLi8uLi9kZXRlY3Rvci9wa2cvZGV0ZWN0b3IuanMiLCIuLi8uLi90b29sa2l0L3BrZy90b29sa2l0LmpzIiwiLi4vLi4vd29ya2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMjMgQWRvYmVcbiAqIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTk9USUNFOiBBZG9iZSBwZXJtaXRzIHlvdSB0byB1c2UsIG1vZGlmeSwgYW5kIGRpc3RyaWJ1dGUgdGhpcyBmaWxlIGluXG4gKiBhY2NvcmRhbmNlIHdpdGggdGhlIHRlcm1zIG9mIHRoZSBBZG9iZSBsaWNlbnNlIGFncmVlbWVudCBhY2NvbXBhbnlpbmdcbiAqIGl0LlxuICovXG5cbmludGVyZmFjZSBTZXJpYWxpemVkRXJyb3Ige1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG59XG5cbi8vIEZyb20gaHR0cHM6Ly9naXRodWIuY29tL2pvc2Rlam9uZy93b3JrZXJwb29sL2Jsb2IvbWFzdGVyL3NyYy93b3JrZXIuanMjTDc2LUw4M1xuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZUVycm9yKGVycm9yOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogU2VyaWFsaXplZEVycm9yIHtcbiAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGVycm9yKS5yZWR1Y2UoZnVuY3Rpb24gKHByb2R1Y3QsIG5hbWUpIHtcbiAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb2R1Y3QsIG5hbWUsIHtcbiAgICAgIHZhbHVlOiBlcnJvcltuYW1lXSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgfSk7XG4gIH0sIHt9KTtcbn1cblxuLy8gRnJvbSBodHRwczovL2dpdGh1Yi5jb20vam9zZGVqb25nL3dvcmtlcnBvb2wvYmxvYi9tYXN0ZXIvc3JjL1dvcmtlckhhbmRsZXIuanMjTDE3OS1MMTkzXG5leHBvcnQgZnVuY3Rpb24gZGVzZXJpYWxpemVFcnJvcihzZXJpYWxpemVkRXJyb3I6IFNlcmlhbGl6ZWRFcnJvcik6IEVycm9yIHtcbiAgdmFyIHRlbXAgPSBuZXcgRXJyb3IoJycpO1xuICB2YXIgcHJvcHMgPSBPYmplY3Qua2V5cyhzZXJpYWxpemVkRXJyb3IpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgdGVtcFtwcm9wc1tpXV0gPSBzZXJpYWxpemVkRXJyb3JbcHJvcHNbaV1dO1xuICB9XG5cbiAgcmV0dXJuIHRlbXA7XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDIzIEFkb2JlXG4gKiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIE5PVElDRTogQWRvYmUgcGVybWl0cyB5b3UgdG8gdXNlLCBtb2RpZnksIGFuZCBkaXN0cmlidXRlIHRoaXMgZmlsZSBpblxuICogYWNjb3JkYW5jZSB3aXRoIHRoZSB0ZXJtcyBvZiB0aGUgQWRvYmUgbGljZW5zZSBhZ3JlZW1lbnQgYWNjb21wYW55aW5nXG4gKiBpdC5cbiAqL1xuXG5pbXBvcnQgeyBzZXJpYWxpemVFcnJvciB9IGZyb20gJy4vZXJyb3InO1xuXG5leHBvcnQgaW50ZXJmYWNlIFdvcmtlclJlcXVlc3Qge1xuICBtZXRob2Q6IHN0cmluZztcbiAgYXJnczogdW5rbm93bltdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdvcmtlclJlc3BvbnNlU3VjY2VzcyB7XG4gIHR5cGU6ICdzdWNjZXNzJztcbiAgZGF0YTogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdvcmtlclJlc3BvbnNlRXJyb3Ige1xuICB0eXBlOiAnZXJyb3InO1xuICBlcnJvcjogYW55O1xufVxuXG5leHBvcnQgdHlwZSBXb3JrZXJSZXNwb25zZSA9IFdvcmtlclJlc3BvbnNlU3VjY2VzcyB8IFdvcmtlclJlc3BvbnNlRXJyb3I7XG5cbnR5cGUgV29ya2VyTWV0aG9kcyA9IFJlY29yZDxzdHJpbmcsICguLi5hcmdzOiBhbnlbXSkgPT4gYW55PjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwV29ya2VyKG1ldGhvZHM6IFdvcmtlck1ldGhvZHMpIHtcbiAgb25tZXNzYWdlID0gYXN5bmMgKGU6IE1lc3NhZ2VFdmVudDxXb3JrZXJSZXF1ZXN0PikgPT4ge1xuICAgIGNvbnN0IHsgYXJncywgbWV0aG9kIH0gPSBlLmRhdGE7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG1ldGhvZHNbbWV0aG9kXSguLi5hcmdzKTtcblxuICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgIGRhdGE6IHJlcyxcbiAgICAgIH0gYXMgV29ya2VyUmVzcG9uc2UpO1xuICAgIH0gY2F0Y2ggKGVycm9yOiB1bmtub3duKSB7XG4gICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIGVycm9yOiBzZXJpYWxpemVFcnJvcihlcnJvciBhcyBFcnJvciksXG4gICAgICB9IGFzIFdvcmtlclJlc3BvbnNlKTtcbiAgICB9XG4gIH07XG59XG4iLCJcbmxldCB3YXNtO1xuXG5jb25zdCBjYWNoZWRUZXh0RGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigndXRmLTgnLCB7IGlnbm9yZUJPTTogdHJ1ZSwgZmF0YWw6IHRydWUgfSk7XG5cbmNhY2hlZFRleHREZWNvZGVyLmRlY29kZSgpO1xuXG5sZXQgY2FjaGVkVWludDhNZW1vcnkwID0gbmV3IFVpbnQ4QXJyYXkoKTtcblxuZnVuY3Rpb24gZ2V0VWludDhNZW1vcnkwKCkge1xuICAgIGlmIChjYWNoZWRVaW50OE1lbW9yeTAuYnl0ZUxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjYWNoZWRVaW50OE1lbW9yeTAgPSBuZXcgVWludDhBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVkVWludDhNZW1vcnkwO1xufVxuXG5mdW5jdGlvbiBnZXRTdHJpbmdGcm9tV2FzbTAocHRyLCBsZW4pIHtcbiAgICByZXR1cm4gY2FjaGVkVGV4dERlY29kZXIuZGVjb2RlKGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgbGVuKSk7XG59XG5cbmxldCBXQVNNX1ZFQ1RPUl9MRU4gPSAwO1xuXG5jb25zdCBjYWNoZWRUZXh0RW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigndXRmLTgnKTtcblxuY29uc3QgZW5jb2RlU3RyaW5nID0gKHR5cGVvZiBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGVJbnRvID09PSAnZnVuY3Rpb24nXG4gICAgPyBmdW5jdGlvbiAoYXJnLCB2aWV3KSB7XG4gICAgcmV0dXJuIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8oYXJnLCB2aWV3KTtcbn1cbiAgICA6IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICBjb25zdCBidWYgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGUoYXJnKTtcbiAgICB2aWV3LnNldChidWYpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlYWQ6IGFyZy5sZW5ndGgsXG4gICAgICAgIHdyaXR0ZW46IGJ1Zi5sZW5ndGhcbiAgICB9O1xufSk7XG5cbmZ1bmN0aW9uIHBhc3NTdHJpbmdUb1dhc20wKGFyZywgbWFsbG9jLCByZWFsbG9jKSB7XG5cbiAgICBpZiAocmVhbGxvYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgICAgICBjb25zdCBwdHIgPSBtYWxsb2MoYnVmLmxlbmd0aCk7XG4gICAgICAgIGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgYnVmLmxlbmd0aCkuc2V0KGJ1Zik7XG4gICAgICAgIFdBU01fVkVDVE9SX0xFTiA9IGJ1Zi5sZW5ndGg7XG4gICAgICAgIHJldHVybiBwdHI7XG4gICAgfVxuXG4gICAgbGV0IGxlbiA9IGFyZy5sZW5ndGg7XG4gICAgbGV0IHB0ciA9IG1hbGxvYyhsZW4pO1xuXG4gICAgY29uc3QgbWVtID0gZ2V0VWludDhNZW1vcnkwKCk7XG5cbiAgICBsZXQgb2Zmc2V0ID0gMDtcblxuICAgIGZvciAoOyBvZmZzZXQgPCBsZW47IG9mZnNldCsrKSB7XG4gICAgICAgIGNvbnN0IGNvZGUgPSBhcmcuY2hhckNvZGVBdChvZmZzZXQpO1xuICAgICAgICBpZiAoY29kZSA+IDB4N0YpIGJyZWFrO1xuICAgICAgICBtZW1bcHRyICsgb2Zmc2V0XSA9IGNvZGU7XG4gICAgfVxuXG4gICAgaWYgKG9mZnNldCAhPT0gbGVuKSB7XG4gICAgICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgICAgICAgIGFyZyA9IGFyZy5zbGljZShvZmZzZXQpO1xuICAgICAgICB9XG4gICAgICAgIHB0ciA9IHJlYWxsb2MocHRyLCBsZW4sIGxlbiA9IG9mZnNldCArIGFyZy5sZW5ndGggKiAzKTtcbiAgICAgICAgY29uc3QgdmlldyA9IGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciArIG9mZnNldCwgcHRyICsgbGVuKTtcbiAgICAgICAgY29uc3QgcmV0ID0gZW5jb2RlU3RyaW5nKGFyZywgdmlldyk7XG5cbiAgICAgICAgb2Zmc2V0ICs9IHJldC53cml0dGVuO1xuICAgIH1cblxuICAgIFdBU01fVkVDVE9SX0xFTiA9IG9mZnNldDtcbiAgICByZXR1cm4gcHRyO1xufVxuXG5mdW5jdGlvbiBpc0xpa2VOb25lKHgpIHtcbiAgICByZXR1cm4geCA9PT0gdW5kZWZpbmVkIHx8IHggPT09IG51bGw7XG59XG5cbmxldCBjYWNoZWRJbnQzMk1lbW9yeTAgPSBuZXcgSW50MzJBcnJheSgpO1xuXG5mdW5jdGlvbiBnZXRJbnQzMk1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZEludDMyTWVtb3J5MC5ieXRlTGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNhY2hlZEludDMyTWVtb3J5MCA9IG5ldyBJbnQzMkFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWRJbnQzMk1lbW9yeTA7XG59XG5cbmxldCBjYWNoZWRGbG9hdDY0TWVtb3J5MCA9IG5ldyBGbG9hdDY0QXJyYXkoKTtcblxuZnVuY3Rpb24gZ2V0RmxvYXQ2NE1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZEZsb2F0NjRNZW1vcnkwLmJ5dGVMZW5ndGggPT09IDApIHtcbiAgICAgICAgY2FjaGVkRmxvYXQ2NE1lbW9yeTAgPSBuZXcgRmxvYXQ2NEFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWRGbG9hdDY0TWVtb3J5MDtcbn1cblxuZnVuY3Rpb24gZGVidWdTdHJpbmcodmFsKSB7XG4gICAgLy8gcHJpbWl0aXZlIHR5cGVzXG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiB2YWw7XG4gICAgaWYgKHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHwgdmFsID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuICBgJHt2YWx9YDtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGBcIiR7dmFsfVwiYDtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSB2YWwuZGVzY3JpcHRpb247XG4gICAgICAgIGlmIChkZXNjcmlwdGlvbiA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1N5bWJvbCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYFN5bWJvbCgke2Rlc2NyaXB0aW9ufSlgO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHZhbC5uYW1lO1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycgJiYgbmFtZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYEZ1bmN0aW9uKCR7bmFtZX0pYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnRnVuY3Rpb24nO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIG9iamVjdHNcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHZhbC5sZW5ndGg7XG4gICAgICAgIGxldCBkZWJ1ZyA9ICdbJztcbiAgICAgICAgaWYgKGxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGRlYnVnICs9IGRlYnVnU3RyaW5nKHZhbFswXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkZWJ1ZyArPSAnLCAnICsgZGVidWdTdHJpbmcodmFsW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBkZWJ1ZyArPSAnXSc7XG4gICAgICAgIHJldHVybiBkZWJ1ZztcbiAgICB9XG4gICAgLy8gVGVzdCBmb3IgYnVpbHQtaW5cbiAgICBjb25zdCBidWlsdEluTWF0Y2hlcyA9IC9cXFtvYmplY3QgKFteXFxdXSspXFxdLy5leGVjKHRvU3RyaW5nLmNhbGwodmFsKSk7XG4gICAgbGV0IGNsYXNzTmFtZTtcbiAgICBpZiAoYnVpbHRJbk1hdGNoZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBjbGFzc05hbWUgPSBidWlsdEluTWF0Y2hlc1sxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGYWlsZWQgdG8gbWF0Y2ggdGhlIHN0YW5kYXJkICdbb2JqZWN0IENsYXNzTmFtZV0nXG4gICAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCk7XG4gICAgfVxuICAgIGlmIChjbGFzc05hbWUgPT0gJ09iamVjdCcpIHtcbiAgICAgICAgLy8gd2UncmUgYSB1c2VyIGRlZmluZWQgY2xhc3Mgb3IgT2JqZWN0XG4gICAgICAgIC8vIEpTT04uc3RyaW5naWZ5IGF2b2lkcyBwcm9ibGVtcyB3aXRoIGN5Y2xlcywgYW5kIGlzIGdlbmVyYWxseSBtdWNoXG4gICAgICAgIC8vIGVhc2llciB0aGFuIGxvb3BpbmcgdGhyb3VnaCBvd25Qcm9wZXJ0aWVzIG9mIGB2YWxgLlxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuICdPYmplY3QoJyArIEpTT04uc3RyaW5naWZ5KHZhbCkgKyAnKSc7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICAgIHJldHVybiAnT2JqZWN0JztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBlcnJvcnNcbiAgICBpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGAke3ZhbC5uYW1lfTogJHt2YWwubWVzc2FnZX1cXG4ke3ZhbC5zdGFja31gO1xuICAgIH1cbiAgICAvLyBUT0RPIHdlIGNvdWxkIHRlc3QgZm9yIG1vcmUgdGhpbmdzIGhlcmUsIGxpa2UgYFNldGBzIGFuZCBgTWFwYHMuXG4gICAgcmV0dXJuIGNsYXNzTmFtZTtcbn1cbi8qKlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWluKCkge1xuICAgIHdhc20ubWFpbigpO1xufVxuXG5mdW5jdGlvbiB0YWtlRnJvbUV4dGVybnJlZlRhYmxlMChpZHgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHdhc20uX193YmluZGdlbl9leHBvcnRfMi5nZXQoaWR4KTtcbiAgICB3YXNtLl9fZXh0ZXJucmVmX3RhYmxlX2RlYWxsb2MoaWR4KTtcbiAgICByZXR1cm4gdmFsdWU7XG59XG4vKipcbiogQHBhcmFtIHthbnl9IGJ1ZlxuKiBAcmV0dXJucyB7bnVtYmVyfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBzY2FuX2FycmF5X2J1ZmZlcihidWYpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgd2FzbS5zY2FuX2FycmF5X2J1ZmZlcihyZXRwdHIsIGJ1Zik7XG4gICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICB2YXIgcjIgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMl07XG4gICAgICAgIGlmIChyMikge1xuICAgICAgICAgICAgdGhyb3cgdGFrZUZyb21FeHRlcm5yZWZUYWJsZTAocjEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByMCA+Pj4gMDtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9hZChtb2R1bGUsIGltcG9ydHMpIHtcbiAgICBpZiAodHlwZW9mIFJlc3BvbnNlID09PSAnZnVuY3Rpb24nICYmIG1vZHVsZSBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGVTdHJlYW1pbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nKG1vZHVsZSwgaW1wb3J0cyk7XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKSAhPSAnYXBwbGljYXRpb24vd2FzbScpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiYFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nYCBmYWlsZWQgYmVjYXVzZSB5b3VyIHNlcnZlciBkb2VzIG5vdCBzZXJ2ZSB3YXNtIHdpdGggYGFwcGxpY2F0aW9uL3dhc21gIE1JTUUgdHlwZS4gRmFsbGluZyBiYWNrIHRvIGBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZWAgd2hpY2ggaXMgc2xvd2VyLiBPcmlnaW5hbCBlcnJvcjpcXG5cIiwgZSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJ5dGVzID0gYXdhaXQgbW9kdWxlLmFycmF5QnVmZmVyKCk7XG4gICAgICAgIHJldHVybiBhd2FpdCBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZShieXRlcywgaW1wb3J0cyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlKG1vZHVsZSwgaW1wb3J0cyk7XG5cbiAgICAgICAgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgV2ViQXNzZW1ibHkuSW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7IGluc3RhbmNlLCBtb2R1bGUgfTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRJbXBvcnRzKCkge1xuICAgIGNvbnN0IGltcG9ydHMgPSB7fTtcbiAgICBpbXBvcnRzLndiZyA9IHt9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2lzQXJyYXlfMjdjNDZjNjdmNDk4ZTE1ZCA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gQXJyYXkuaXNBcnJheShhcmcwKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2xlbmd0aF82ZTNiYmU3YzhiZDRkYmQ4ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBhcmcwLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2dldF81NzI0NWNjN2Q3Yzc2MTlkID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBhcmcwW2FyZzEgPj4+IDBdO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfaXNTYWZlSW50ZWdlcl9kZmEwNTkzZThkN2FjMzVhID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBOdW1iZXIuaXNTYWZlSW50ZWdlcihhcmcwKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fc3RyaW5nX25ldyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzAsIGFyZzEpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3X2FiZGE3NmU4ODNiYThhNWYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IEVycm9yKCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zdGFja182NTgyNzlmZTQ0NTQxY2Y2ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBhcmcxLnN0YWNrO1xuICAgICAgICBjb25zdCBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAocmV0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIGNvbnN0IGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIGdldEludDMyTWVtb3J5MCgpW2FyZzAgLyA0ICsgMV0gPSBsZW4wO1xuICAgICAgICBnZXRJbnQzMk1lbW9yeTAoKVthcmcwIC8gNCArIDBdID0gcHRyMDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2Vycm9yX2Y4NTE2NjdhZjcxYmNmYzYgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShhcmcwLCBhcmcxKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbGVuZ3RoXzllMWFlMTkwMGNiMGZiZDUgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGFyZzAubGVuZ3RoO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9tZW1vcnkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gd2FzbS5tZW1vcnk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19idWZmZXJfM2YzZDc2NGQ0NzQ3ZDU2NCA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gYXJnMC5idWZmZXI7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19uZXdfOGMzZjAwNTIyNzJhNDU3YSA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IFVpbnQ4QXJyYXkoYXJnMCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zZXRfODNkYjk2OTBmOTM1M2U3OSA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICAgICAgYXJnMC5zZXQoYXJnMSwgYXJnMiA+Pj4gMCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2Vycm9yX25ldyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IEVycm9yKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2pzdmFsX2xvb3NlX2VxID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBhcmcwID09IGFyZzE7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2Jvb2xlYW5fZ2V0ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCB2ID0gYXJnMDtcbiAgICAgICAgY29uc3QgcmV0ID0gdHlwZW9mKHYpID09PSAnYm9vbGVhbicgPyAodiA/IDEgOiAwKSA6IDI7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX3N0cmluZ19nZXQgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IG9iaiA9IGFyZzE7XG4gICAgICAgIGNvbnN0IHJldCA9IHR5cGVvZihvYmopID09PSAnc3RyaW5nJyA/IG9iaiA6IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIHB0cjAgPSBpc0xpa2VOb25lKHJldCkgPyAwIDogcGFzc1N0cmluZ1RvV2FzbTAocmV0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICBnZXRJbnQzMk1lbW9yeTAoKVthcmcwIC8gNCArIDFdID0gbGVuMDtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAwXSA9IHB0cjA7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX251bWJlcl9nZXQgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IG9iaiA9IGFyZzE7XG4gICAgICAgIGNvbnN0IHJldCA9IHR5cGVvZihvYmopID09PSAnbnVtYmVyJyA/IG9iaiA6IHVuZGVmaW5lZDtcbiAgICAgICAgZ2V0RmxvYXQ2NE1lbW9yeTAoKVthcmcwIC8gOCArIDFdID0gaXNMaWtlTm9uZShyZXQpID8gMCA6IHJldDtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAwXSA9ICFpc0xpa2VOb25lKHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19pbnN0YW5jZW9mX1VpbnQ4QXJyYXlfOTcxZWVkYTY5ZWI3NTAwMyA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGFyZzAgaW5zdGFuY2VvZiBVaW50OEFycmF5O1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJldCA9IHJlc3VsdDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2luc3RhbmNlb2ZfQXJyYXlCdWZmZXJfZTVlNDhmNDc2MmM1NjEwYiA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGFyZzAgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcjtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXQgPSByZXN1bHQ7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2RlYnVnX3N0cmluZyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZGVidWdTdHJpbmcoYXJnMSk7XG4gICAgICAgIGNvbnN0IHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChyZXQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgY29uc3QgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAxXSA9IGxlbjA7XG4gICAgICAgIGdldEludDMyTWVtb3J5MCgpW2FyZzAgLyA0ICsgMF0gPSBwdHIwO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl90aHJvdyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2luaXRfZXh0ZXJucmVmX3RhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHRhYmxlID0gd2FzbS5fX3diaW5kZ2VuX2V4cG9ydF8yO1xuICAgICAgICBjb25zdCBvZmZzZXQgPSB0YWJsZS5ncm93KDQpO1xuICAgICAgICB0YWJsZS5zZXQoMCwgdW5kZWZpbmVkKTtcbiAgICAgICAgdGFibGUuc2V0KG9mZnNldCArIDAsIHVuZGVmaW5lZCk7XG4gICAgICAgIHRhYmxlLnNldChvZmZzZXQgKyAxLCBudWxsKTtcbiAgICAgICAgdGFibGUuc2V0KG9mZnNldCArIDIsIHRydWUpO1xuICAgICAgICB0YWJsZS5zZXQob2Zmc2V0ICsgMywgZmFsc2UpO1xuICAgICAgICA7XG4gICAgfTtcblxuICAgIHJldHVybiBpbXBvcnRzO1xufVxuXG5mdW5jdGlvbiBpbml0TWVtb3J5KGltcG9ydHMsIG1heWJlX21lbW9yeSkge1xuXG59XG5cbmZ1bmN0aW9uIGZpbmFsaXplSW5pdChpbnN0YW5jZSwgbW9kdWxlKSB7XG4gICAgd2FzbSA9IGluc3RhbmNlLmV4cG9ydHM7XG4gICAgaW5pdC5fX3diaW5kZ2VuX3dhc21fbW9kdWxlID0gbW9kdWxlO1xuICAgIGNhY2hlZEZsb2F0NjRNZW1vcnkwID0gbmV3IEZsb2F0NjRBcnJheSgpO1xuICAgIGNhY2hlZEludDMyTWVtb3J5MCA9IG5ldyBJbnQzMkFycmF5KCk7XG4gICAgY2FjaGVkVWludDhNZW1vcnkwID0gbmV3IFVpbnQ4QXJyYXkoKTtcblxuICAgIHdhc20uX193YmluZGdlbl9zdGFydCgpO1xuICAgIHJldHVybiB3YXNtO1xufVxuXG5mdW5jdGlvbiBpbml0U3luYyhtb2R1bGUpIHtcbiAgICBjb25zdCBpbXBvcnRzID0gZ2V0SW1wb3J0cygpO1xuXG4gICAgaW5pdE1lbW9yeShpbXBvcnRzKTtcblxuICAgIGlmICghKG1vZHVsZSBpbnN0YW5jZW9mIFdlYkFzc2VtYmx5Lk1vZHVsZSkpIHtcbiAgICAgICAgbW9kdWxlID0gbmV3IFdlYkFzc2VtYmx5Lk1vZHVsZShtb2R1bGUpO1xuICAgIH1cblxuICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IFdlYkFzc2VtYmx5Lkluc3RhbmNlKG1vZHVsZSwgaW1wb3J0cyk7XG5cbiAgICByZXR1cm4gZmluYWxpemVJbml0KGluc3RhbmNlLCBtb2R1bGUpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBpbml0KGlucHV0KSB7XG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgaW5wdXQgPSBuZXcgVVJMKCdkZXRlY3Rvcl9iZy53YXNtJywgaW1wb3J0Lm1ldGEudXJsKTtcbiAgICB9XG4gICAgY29uc3QgaW1wb3J0cyA9IGdldEltcG9ydHMoKTtcblxuICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnIHx8ICh0eXBlb2YgUmVxdWVzdCA9PT0gJ2Z1bmN0aW9uJyAmJiBpbnB1dCBpbnN0YW5jZW9mIFJlcXVlc3QpIHx8ICh0eXBlb2YgVVJMID09PSAnZnVuY3Rpb24nICYmIGlucHV0IGluc3RhbmNlb2YgVVJMKSkge1xuICAgICAgICBpbnB1dCA9IGZldGNoKGlucHV0KTtcbiAgICB9XG5cbiAgICBpbml0TWVtb3J5KGltcG9ydHMpO1xuXG4gICAgY29uc3QgeyBpbnN0YW5jZSwgbW9kdWxlIH0gPSBhd2FpdCBsb2FkKGF3YWl0IGlucHV0LCBpbXBvcnRzKTtcblxuICAgIHJldHVybiBmaW5hbGl6ZUluaXQoaW5zdGFuY2UsIG1vZHVsZSk7XG59XG5cbmV4cG9ydCB7IGluaXRTeW5jIH1cbmV4cG9ydCBkZWZhdWx0IGluaXQ7XG4iLCJsZXQgd2FzbTtcblxuY29uc3QgaGVhcCA9IG5ldyBBcnJheSgxMjgpLmZpbGwodW5kZWZpbmVkKTtcblxuaGVhcC5wdXNoKHVuZGVmaW5lZCwgbnVsbCwgdHJ1ZSwgZmFsc2UpO1xuXG5mdW5jdGlvbiBnZXRPYmplY3QoaWR4KSB7IHJldHVybiBoZWFwW2lkeF07IH1cblxubGV0IGhlYXBfbmV4dCA9IGhlYXAubGVuZ3RoO1xuXG5mdW5jdGlvbiBkcm9wT2JqZWN0KGlkeCkge1xuICAgIGlmIChpZHggPCAxMzIpIHJldHVybjtcbiAgICBoZWFwW2lkeF0gPSBoZWFwX25leHQ7XG4gICAgaGVhcF9uZXh0ID0gaWR4O1xufVxuXG5mdW5jdGlvbiB0YWtlT2JqZWN0KGlkeCkge1xuICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChpZHgpO1xuICAgIGRyb3BPYmplY3QoaWR4KTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5jb25zdCBjYWNoZWRUZXh0RGVjb2RlciA9ICh0eXBlb2YgVGV4dERlY29kZXIgIT09ICd1bmRlZmluZWQnID8gbmV3IFRleHREZWNvZGVyKCd1dGYtOCcsIHsgaWdub3JlQk9NOiB0cnVlLCBmYXRhbDogdHJ1ZSB9KSA6IHsgZGVjb2RlOiAoKSA9PiB7IHRocm93IEVycm9yKCdUZXh0RGVjb2RlciBub3QgYXZhaWxhYmxlJykgfSB9ICk7XG5cbmlmICh0eXBlb2YgVGV4dERlY29kZXIgIT09ICd1bmRlZmluZWQnKSB7IGNhY2hlZFRleHREZWNvZGVyLmRlY29kZSgpOyB9O1xuXG5sZXQgY2FjaGVkVWludDhNZW1vcnkwID0gbnVsbDtcblxuZnVuY3Rpb24gZ2V0VWludDhNZW1vcnkwKCkge1xuICAgIGlmIChjYWNoZWRVaW50OE1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVkVWludDhNZW1vcnkwLmJ5dGVMZW5ndGggPT09IDApIHtcbiAgICAgICAgY2FjaGVkVWludDhNZW1vcnkwID0gbmV3IFVpbnQ4QXJyYXkod2FzbS5tZW1vcnkuYnVmZmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY2hlZFVpbnQ4TWVtb3J5MDtcbn1cblxuZnVuY3Rpb24gZ2V0U3RyaW5nRnJvbVdhc20wKHB0ciwgbGVuKSB7XG4gICAgcHRyID0gcHRyID4+PiAwO1xuICAgIHJldHVybiBjYWNoZWRUZXh0RGVjb2Rlci5kZWNvZGUoZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyLCBwdHIgKyBsZW4pKTtcbn1cblxuZnVuY3Rpb24gYWRkSGVhcE9iamVjdChvYmopIHtcbiAgICBpZiAoaGVhcF9uZXh0ID09PSBoZWFwLmxlbmd0aCkgaGVhcC5wdXNoKGhlYXAubGVuZ3RoICsgMSk7XG4gICAgY29uc3QgaWR4ID0gaGVhcF9uZXh0O1xuICAgIGhlYXBfbmV4dCA9IGhlYXBbaWR4XTtcblxuICAgIGhlYXBbaWR4XSA9IG9iajtcbiAgICByZXR1cm4gaWR4O1xufVxuXG5mdW5jdGlvbiBpc0xpa2VOb25lKHgpIHtcbiAgICByZXR1cm4geCA9PT0gdW5kZWZpbmVkIHx8IHggPT09IG51bGw7XG59XG5cbmxldCBjYWNoZWRGbG9hdDY0TWVtb3J5MCA9IG51bGw7XG5cbmZ1bmN0aW9uIGdldEZsb2F0NjRNZW1vcnkwKCkge1xuICAgIGlmIChjYWNoZWRGbG9hdDY0TWVtb3J5MCA9PT0gbnVsbCB8fCBjYWNoZWRGbG9hdDY0TWVtb3J5MC5ieXRlTGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNhY2hlZEZsb2F0NjRNZW1vcnkwID0gbmV3IEZsb2F0NjRBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVkRmxvYXQ2NE1lbW9yeTA7XG59XG5cbmxldCBjYWNoZWRJbnQzMk1lbW9yeTAgPSBudWxsO1xuXG5mdW5jdGlvbiBnZXRJbnQzMk1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZEludDMyTWVtb3J5MCA9PT0gbnVsbCB8fCBjYWNoZWRJbnQzMk1lbW9yeTAuYnl0ZUxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjYWNoZWRJbnQzMk1lbW9yeTAgPSBuZXcgSW50MzJBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVkSW50MzJNZW1vcnkwO1xufVxuXG5sZXQgV0FTTV9WRUNUT1JfTEVOID0gMDtcblxuY29uc3QgY2FjaGVkVGV4dEVuY29kZXIgPSAodHlwZW9mIFRleHRFbmNvZGVyICE9PSAndW5kZWZpbmVkJyA/IG5ldyBUZXh0RW5jb2RlcigndXRmLTgnKSA6IHsgZW5jb2RlOiAoKSA9PiB7IHRocm93IEVycm9yKCdUZXh0RW5jb2RlciBub3QgYXZhaWxhYmxlJykgfSB9ICk7XG5cbmNvbnN0IGVuY29kZVN0cmluZyA9ICh0eXBlb2YgY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlSW50byA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gZnVuY3Rpb24gKGFyZywgdmlldykge1xuICAgIHJldHVybiBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGVJbnRvKGFyZywgdmlldyk7XG59XG4gICAgOiBmdW5jdGlvbiAoYXJnLCB2aWV3KSB7XG4gICAgY29uc3QgYnVmID0gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlKGFyZyk7XG4gICAgdmlldy5zZXQoYnVmKTtcbiAgICByZXR1cm4ge1xuICAgICAgICByZWFkOiBhcmcubGVuZ3RoLFxuICAgICAgICB3cml0dGVuOiBidWYubGVuZ3RoXG4gICAgfTtcbn0pO1xuXG5mdW5jdGlvbiBwYXNzU3RyaW5nVG9XYXNtMChhcmcsIG1hbGxvYywgcmVhbGxvYykge1xuXG4gICAgaWYgKHJlYWxsb2MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBidWYgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGUoYXJnKTtcbiAgICAgICAgY29uc3QgcHRyID0gbWFsbG9jKGJ1Zi5sZW5ndGgsIDEpID4+PiAwO1xuICAgICAgICBnZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIsIHB0ciArIGJ1Zi5sZW5ndGgpLnNldChidWYpO1xuICAgICAgICBXQVNNX1ZFQ1RPUl9MRU4gPSBidWYubGVuZ3RoO1xuICAgICAgICByZXR1cm4gcHRyO1xuICAgIH1cblxuICAgIGxldCBsZW4gPSBhcmcubGVuZ3RoO1xuICAgIGxldCBwdHIgPSBtYWxsb2MobGVuLCAxKSA+Pj4gMDtcblxuICAgIGNvbnN0IG1lbSA9IGdldFVpbnQ4TWVtb3J5MCgpO1xuXG4gICAgbGV0IG9mZnNldCA9IDA7XG5cbiAgICBmb3IgKDsgb2Zmc2V0IDwgbGVuOyBvZmZzZXQrKykge1xuICAgICAgICBjb25zdCBjb2RlID0gYXJnLmNoYXJDb2RlQXQob2Zmc2V0KTtcbiAgICAgICAgaWYgKGNvZGUgPiAweDdGKSBicmVhaztcbiAgICAgICAgbWVtW3B0ciArIG9mZnNldF0gPSBjb2RlO1xuICAgIH1cblxuICAgIGlmIChvZmZzZXQgIT09IGxlbikge1xuICAgICAgICBpZiAob2Zmc2V0ICE9PSAwKSB7XG4gICAgICAgICAgICBhcmcgPSBhcmcuc2xpY2Uob2Zmc2V0KTtcbiAgICAgICAgfVxuICAgICAgICBwdHIgPSByZWFsbG9jKHB0ciwgbGVuLCBsZW4gPSBvZmZzZXQgKyBhcmcubGVuZ3RoICogMywgMSkgPj4+IDA7XG4gICAgICAgIGNvbnN0IHZpZXcgPSBnZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIgKyBvZmZzZXQsIHB0ciArIGxlbik7XG4gICAgICAgIGNvbnN0IHJldCA9IGVuY29kZVN0cmluZyhhcmcsIHZpZXcpO1xuXG4gICAgICAgIG9mZnNldCArPSByZXQud3JpdHRlbjtcbiAgICAgICAgcHRyID0gcmVhbGxvYyhwdHIsIGxlbiwgb2Zmc2V0LCAxKSA+Pj4gMDtcbiAgICB9XG5cbiAgICBXQVNNX1ZFQ1RPUl9MRU4gPSBvZmZzZXQ7XG4gICAgcmV0dXJuIHB0cjtcbn1cblxuZnVuY3Rpb24gZGVidWdTdHJpbmcodmFsKSB7XG4gICAgLy8gcHJpbWl0aXZlIHR5cGVzXG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiB2YWw7XG4gICAgaWYgKHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHwgdmFsID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuICBgJHt2YWx9YDtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGBcIiR7dmFsfVwiYDtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSB2YWwuZGVzY3JpcHRpb247XG4gICAgICAgIGlmIChkZXNjcmlwdGlvbiA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1N5bWJvbCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYFN5bWJvbCgke2Rlc2NyaXB0aW9ufSlgO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHZhbC5uYW1lO1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycgJiYgbmFtZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYEZ1bmN0aW9uKCR7bmFtZX0pYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnRnVuY3Rpb24nO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIG9iamVjdHNcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHZhbC5sZW5ndGg7XG4gICAgICAgIGxldCBkZWJ1ZyA9ICdbJztcbiAgICAgICAgaWYgKGxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGRlYnVnICs9IGRlYnVnU3RyaW5nKHZhbFswXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkZWJ1ZyArPSAnLCAnICsgZGVidWdTdHJpbmcodmFsW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBkZWJ1ZyArPSAnXSc7XG4gICAgICAgIHJldHVybiBkZWJ1ZztcbiAgICB9XG4gICAgLy8gVGVzdCBmb3IgYnVpbHQtaW5cbiAgICBjb25zdCBidWlsdEluTWF0Y2hlcyA9IC9cXFtvYmplY3QgKFteXFxdXSspXFxdLy5leGVjKHRvU3RyaW5nLmNhbGwodmFsKSk7XG4gICAgbGV0IGNsYXNzTmFtZTtcbiAgICBpZiAoYnVpbHRJbk1hdGNoZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBjbGFzc05hbWUgPSBidWlsdEluTWF0Y2hlc1sxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGYWlsZWQgdG8gbWF0Y2ggdGhlIHN0YW5kYXJkICdbb2JqZWN0IENsYXNzTmFtZV0nXG4gICAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCk7XG4gICAgfVxuICAgIGlmIChjbGFzc05hbWUgPT0gJ09iamVjdCcpIHtcbiAgICAgICAgLy8gd2UncmUgYSB1c2VyIGRlZmluZWQgY2xhc3Mgb3IgT2JqZWN0XG4gICAgICAgIC8vIEpTT04uc3RyaW5naWZ5IGF2b2lkcyBwcm9ibGVtcyB3aXRoIGN5Y2xlcywgYW5kIGlzIGdlbmVyYWxseSBtdWNoXG4gICAgICAgIC8vIGVhc2llciB0aGFuIGxvb3BpbmcgdGhyb3VnaCBvd25Qcm9wZXJ0aWVzIG9mIGB2YWxgLlxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuICdPYmplY3QoJyArIEpTT04uc3RyaW5naWZ5KHZhbCkgKyAnKSc7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICAgIHJldHVybiAnT2JqZWN0JztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBlcnJvcnNcbiAgICBpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGAke3ZhbC5uYW1lfTogJHt2YWwubWVzc2FnZX1cXG4ke3ZhbC5zdGFja31gO1xuICAgIH1cbiAgICAvLyBUT0RPIHdlIGNvdWxkIHRlc3QgZm9yIG1vcmUgdGhpbmdzIGhlcmUsIGxpa2UgYFNldGBzIGFuZCBgTWFwYHMuXG4gICAgcmV0dXJuIGNsYXNzTmFtZTtcbn1cblxuY29uc3QgQ0xPU1VSRV9EVE9SUyA9ICh0eXBlb2YgRmluYWxpemF0aW9uUmVnaXN0cnkgPT09ICd1bmRlZmluZWQnKVxuICAgID8geyByZWdpc3RlcjogKCkgPT4ge30sIHVucmVnaXN0ZXI6ICgpID0+IHt9IH1cbiAgICA6IG5ldyBGaW5hbGl6YXRpb25SZWdpc3RyeShzdGF0ZSA9PiB7XG4gICAgd2FzbS5fX3diaW5kZ2VuX2V4cG9ydF8yLmdldChzdGF0ZS5kdG9yKShzdGF0ZS5hLCBzdGF0ZS5iKVxufSk7XG5cbmZ1bmN0aW9uIG1ha2VNdXRDbG9zdXJlKGFyZzAsIGFyZzEsIGR0b3IsIGYpIHtcbiAgICBjb25zdCBzdGF0ZSA9IHsgYTogYXJnMCwgYjogYXJnMSwgY250OiAxLCBkdG9yIH07XG4gICAgY29uc3QgcmVhbCA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIC8vIEZpcnN0IHVwIHdpdGggYSBjbG9zdXJlIHdlIGluY3JlbWVudCB0aGUgaW50ZXJuYWwgcmVmZXJlbmNlXG4gICAgICAgIC8vIGNvdW50LiBUaGlzIGVuc3VyZXMgdGhhdCB0aGUgUnVzdCBjbG9zdXJlIGVudmlyb25tZW50IHdvbid0XG4gICAgICAgIC8vIGJlIGRlYWxsb2NhdGVkIHdoaWxlIHdlJ3JlIGludm9raW5nIGl0LlxuICAgICAgICBzdGF0ZS5jbnQrKztcbiAgICAgICAgY29uc3QgYSA9IHN0YXRlLmE7XG4gICAgICAgIHN0YXRlLmEgPSAwO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGYoYSwgc3RhdGUuYiwgLi4uYXJncyk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBpZiAoLS1zdGF0ZS5jbnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZXhwb3J0XzIuZ2V0KHN0YXRlLmR0b3IpKGEsIHN0YXRlLmIpO1xuICAgICAgICAgICAgICAgIENMT1NVUkVfRFRPUlMudW5yZWdpc3RlcihzdGF0ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlLmEgPSBhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICByZWFsLm9yaWdpbmFsID0gc3RhdGU7XG4gICAgQ0xPU1VSRV9EVE9SUy5yZWdpc3RlcihyZWFsLCBzdGF0ZSwgc3RhdGUpO1xuICAgIHJldHVybiByZWFsO1xufVxuZnVuY3Rpb24gX193YmdfYWRhcHRlcl80MihhcmcwLCBhcmcxLCBhcmcyKSB7XG4gICAgd2FzbS53YXNtX2JpbmRnZW5fX2NvbnZlcnRfX2Nsb3N1cmVzX19pbnZva2UxX211dF9faDA1MWQxMWEzZjNmNzkxYmEoYXJnMCwgYXJnMSwgYWRkSGVhcE9iamVjdChhcmcyKSk7XG59XG5cbi8qKlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBydW4oKSB7XG4gICAgd2FzbS5ydW4oKTtcbn1cblxuLyoqXG4qIEBwYXJhbSB7YW55fSBidWZcbiogQHBhcmFtIHtzdHJpbmd9IG1pbWVfdHlwZVxuKiBAcGFyYW0ge3N0cmluZyB8IHVuZGVmaW5lZH0gW3NldHRpbmdzXVxuKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYW5pZmVzdFN0b3JlRnJvbUFycmF5QnVmZmVyKGJ1ZiwgbWltZV90eXBlLCBzZXR0aW5ncykge1xuICAgIGNvbnN0IHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChtaW1lX3R5cGUsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICBjb25zdCBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIHZhciBwdHIxID0gaXNMaWtlTm9uZShzZXR0aW5ncykgPyAwIDogcGFzc1N0cmluZ1RvV2FzbTAoc2V0dGluZ3MsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICBjb25zdCByZXQgPSB3YXNtLmdldE1hbmlmZXN0U3RvcmVGcm9tQXJyYXlCdWZmZXIoYWRkSGVhcE9iamVjdChidWYpLCBwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICByZXR1cm4gdGFrZU9iamVjdChyZXQpO1xufVxuXG4vKipcbiogQHBhcmFtIHthbnl9IG1hbmlmZXN0X2J1ZmZlclxuKiBAcGFyYW0ge2FueX0gYXNzZXRfYnVmZmVyXG4qIEBwYXJhbSB7c3RyaW5nfSBtaW1lX3R5cGVcbiogQHBhcmFtIHtzdHJpbmcgfCB1bmRlZmluZWR9IFtzZXR0aW5nc11cbiogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWFuaWZlc3RTdG9yZUZyb21NYW5pZmVzdEFuZEFzc2V0KG1hbmlmZXN0X2J1ZmZlciwgYXNzZXRfYnVmZmVyLCBtaW1lX3R5cGUsIHNldHRpbmdzKSB7XG4gICAgY29uc3QgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKG1pbWVfdHlwZSwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIGNvbnN0IGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgdmFyIHB0cjEgPSBpc0xpa2VOb25lKHNldHRpbmdzKSA/IDAgOiBwYXNzU3RyaW5nVG9XYXNtMChzZXR0aW5ncywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIGNvbnN0IHJldCA9IHdhc20uZ2V0TWFuaWZlc3RTdG9yZUZyb21NYW5pZmVzdEFuZEFzc2V0KGFkZEhlYXBPYmplY3QobWFuaWZlc3RfYnVmZmVyKSwgYWRkSGVhcE9iamVjdChhc3NldF9idWZmZXIpLCBwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTtcbiAgICByZXR1cm4gdGFrZU9iamVjdChyZXQpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVFcnJvcihmLCBhcmdzKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGYuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZXhuX3N0b3JlKGFkZEhlYXBPYmplY3QoZSkpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIF9fd2JnX2FkYXB0ZXJfMTEyKGFyZzAsIGFyZzEsIGFyZzIsIGFyZzMpIHtcbiAgICB3YXNtLndhc21fYmluZGdlbl9fY29udmVydF9fY2xvc3VyZXNfX2ludm9rZTJfbXV0X19oMGNhOTc0Mjc0NTA2MzRmZChhcmcwLCBhcmcxLCBhZGRIZWFwT2JqZWN0KGFyZzIpLCBhZGRIZWFwT2JqZWN0KGFyZzMpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX193YmdfbG9hZChtb2R1bGUsIGltcG9ydHMpIHtcbiAgICBpZiAodHlwZW9mIFJlc3BvbnNlID09PSAnZnVuY3Rpb24nICYmIG1vZHVsZSBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGVTdHJlYW1pbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nKG1vZHVsZSwgaW1wb3J0cyk7XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKSAhPSAnYXBwbGljYXRpb24vd2FzbScpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiYFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nYCBmYWlsZWQgYmVjYXVzZSB5b3VyIHNlcnZlciBkb2VzIG5vdCBzZXJ2ZSB3YXNtIHdpdGggYGFwcGxpY2F0aW9uL3dhc21gIE1JTUUgdHlwZS4gRmFsbGluZyBiYWNrIHRvIGBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZWAgd2hpY2ggaXMgc2xvd2VyLiBPcmlnaW5hbCBlcnJvcjpcXG5cIiwgZSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJ5dGVzID0gYXdhaXQgbW9kdWxlLmFycmF5QnVmZmVyKCk7XG4gICAgICAgIHJldHVybiBhd2FpdCBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZShieXRlcywgaW1wb3J0cyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlKG1vZHVsZSwgaW1wb3J0cyk7XG5cbiAgICAgICAgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgV2ViQXNzZW1ibHkuSW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7IGluc3RhbmNlLCBtb2R1bGUgfTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBfX3diZ19nZXRfaW1wb3J0cygpIHtcbiAgICBjb25zdCBpbXBvcnRzID0ge307XG4gICAgaW1wb3J0cy53YmcgPSB7fTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX29iamVjdF9kcm9wX3JlZiA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgdGFrZU9iamVjdChhcmcwKTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fc3RyaW5nX25ldyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzAsIGFyZzEpO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfZGVidWdfOTcyMWYxYmVlN2JjZDIyNiA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhnZXRPYmplY3QoYXJnMCksIGdldE9iamVjdChhcmcxKSk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19XaW5kb3dfZDMxOWJlODIwNGY4YTY4MiA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLldpbmRvdztcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5faXNfdW5kZWZpbmVkID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2NyeXB0b18xMWJiZTJmNjcxZjViYzE5ID0gZnVuY3Rpb24oKSB7IHJldHVybiBoYW5kbGVFcnJvcihmdW5jdGlvbiAoYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkuY3J5cHRvO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19Xb3JrZXJHbG9iYWxTY29wZV8yNTUyZTRkNDcyMTcwZTNmID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkuV29ya2VyR2xvYmFsU2NvcGU7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19jcnlwdG9fODg2MDllODkzMzZjZTkwNCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaGFuZGxlRXJyb3IoZnVuY3Rpb24gKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLmNyeXB0bztcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9LCBhcmd1bWVudHMpIH07XG4gICAgaW1wb3J0cy53YmcuX193Ymdfc3VidGxlXzM1ODg4NzdjMzg5OGRhZDEgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5zdWJ0bGU7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19uZXdfNzJmYjlhMThiNWFlMjYyNCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgT2JqZWN0KCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19uZXdfMTZiMzA0YTJjZmE3ZmY0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3B1c2hfYTViMDVhZWRjNzIzNGY5ZiA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLnB1c2goZ2V0T2JqZWN0KGFyZzEpKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3ZlcmlmeV8zZjk0M2M1OTA0MjIyYTM5ID0gZnVuY3Rpb24oKSB7IHJldHVybiBoYW5kbGVFcnJvcihmdW5jdGlvbiAoYXJnMCwgYXJnMSwgYXJnMiwgYXJnMywgYXJnNCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkudmVyaWZ5KGdldE9iamVjdChhcmcxKSwgZ2V0T2JqZWN0KGFyZzIpLCBnZXRPYmplY3QoYXJnMyksIGdldE9iamVjdChhcmc0KSk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfSwgYXJndW1lbnRzKSB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5faXNfZmFsc3kgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9ICFnZXRPYmplY3QoYXJnMCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19uZXd3aXRobGVuZ3RoX2U5YjQ4NzhjZWJhZGIzZDMgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBVaW50OEFycmF5KGFyZzAgPj4+IDApO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbGVuZ3RoX2MyMGE0MGYxNTAyMGQ2OGEgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5sZW5ndGg7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zZXRfYTQ3YmFjNzAzMDZhMTlhNyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICAgICAgZ2V0T2JqZWN0KGFyZzApLnNldChnZXRPYmplY3QoYXJnMSksIGFyZzIgPj4+IDApO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfYnVmZmVyX2RkN2Y3NGJjNjBmMWZhYWIgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5idWZmZXI7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX251bWJlcl9uZXcgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGFyZzA7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zZXRfZDQ2MzhmNzIyMDY4ZjA0MyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICAgICAgZ2V0T2JqZWN0KGFyZzApW2FyZzEgPj4+IDBdID0gdGFrZU9iamVjdChhcmcyKTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX25ld19kOWJjM2EwMTQ3NjM0NjQwID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBNYXAoKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3NldF9mOTc1MTAyMjM2ZDNjNTAyID0gZnVuY3Rpb24oYXJnMCwgYXJnMSwgYXJnMikge1xuICAgICAgICBnZXRPYmplY3QoYXJnMClbdGFrZU9iamVjdChhcmcxKV0gPSB0YWtlT2JqZWN0KGFyZzIpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193Ymdfc2V0Xzg0MTcyNTdhYWVkYzkzNmIgPSBmdW5jdGlvbihhcmcwLCBhcmcxLCBhcmcyKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5zZXQoZ2V0T2JqZWN0KGFyZzEpLCBnZXRPYmplY3QoYXJnMikpO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9pc19zdHJpbmcgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IHR5cGVvZihnZXRPYmplY3QoYXJnMCkpID09PSAnc3RyaW5nJztcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fYmlnaW50X2Zyb21fdTY0ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBCaWdJbnQuYXNVaW50Tig2NCwgYXJnMCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19ub3dfMzAxNDYzOWE5NDQyMzUzNyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCByZXQgPSBEYXRlLm5vdygpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3XzYzYjkyYmM4NjcxZWQ0NjQgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBVaW50OEFycmF5KGdldE9iamVjdChhcmcwKSk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19mcm9tXzg5ZTNmYzNiYTVlNmZiNDggPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IEFycmF5LmZyb20oZ2V0T2JqZWN0KGFyZzApKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX1N0cmluZ19iOTQxMmY4Nzk5ZmFhYjNlID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBTdHJpbmcoZ2V0T2JqZWN0KGFyZzEpKTtcbiAgICAgICAgY29uc3QgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHJldCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICBjb25zdCBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICBnZXRJbnQzMk1lbW9yeTAoKVthcmcwIC8gNCArIDFdID0gbGVuMTtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAwXSA9IHB0cjE7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19uZXdfMjhjNTExZDliYWViZmE4OSA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IEVycm9yKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zZXRuYW1lX2MxNDVhOTA0OWQ5YWY1YmYgPSBmdW5jdGlvbihhcmcwLCBhcmcxLCBhcmcyKSB7XG4gICAgICAgIGdldE9iamVjdChhcmcwKS5uYW1lID0gZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzEsIGFyZzIpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3XzgxNzQwNzUwZGE0MDcyNGYgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc3RhdGUwID0ge2E6IGFyZzAsIGI6IGFyZzF9O1xuICAgICAgICAgICAgdmFyIGNiMCA9IChhcmcwLCBhcmcxKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYSA9IHN0YXRlMC5hO1xuICAgICAgICAgICAgICAgIHN0YXRlMC5hID0gMDtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX193YmdfYWRhcHRlcl8xMTIoYSwgc3RhdGUwLmIsIGFyZzAsIGFyZzEpO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlMC5hID0gYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gbmV3IFByb21pc2UoY2IwKTtcbiAgICAgICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBzdGF0ZTAuYSA9IHN0YXRlMC5iID0gMDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfaXNBcnJheV8yYWI2NGQ5NWUwOWVhMGFlID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBBcnJheS5pc0FycmF5KGdldE9iamVjdChhcmcwKSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19sZW5ndGhfY2Q3YWY4MTE3NjcyYjhiOCA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2dldF9iZDhlMzM4ZmJkNWY1Y2M4ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMClbYXJnMSA+Pj4gMF07XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19pc1NhZmVJbnRlZ2VyX2Y3YjA0ZWYwMjI5NmM0ZDIgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IE51bWJlci5pc1NhZmVJbnRlZ2VyKGdldE9iamVjdChhcmcwKSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2FzX251bWJlciA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gK2dldE9iamVjdChhcmcwKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fZXJyb3JfbmV3ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgRXJyb3IoZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzAsIGFyZzEpKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX25ldzBfN2Q4NGU1YjJjZDlmZGM3MyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfZ2V0VGltZV8yYmM0Mzc1MTY1ZjAyZDE1ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkuZ2V0VGltZSgpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3X2FiZGE3NmU4ODNiYThhNWYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IEVycm9yKCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zdGFja182NTgyNzlmZTQ0NTQxY2Y2ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMSkuc3RhY2s7XG4gICAgICAgIGNvbnN0IHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChyZXQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgY29uc3QgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAxXSA9IGxlbjE7XG4gICAgICAgIGdldEludDMyTWVtb3J5MCgpW2FyZzAgLyA0ICsgMF0gPSBwdHIxO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfZXJyb3JfZjg1MTY2N2FmNzFiY2ZjNiA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgbGV0IGRlZmVycmVkMF8wO1xuICAgICAgICBsZXQgZGVmZXJyZWQwXzE7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkZWZlcnJlZDBfMCA9IGFyZzA7XG4gICAgICAgICAgICBkZWZlcnJlZDBfMSA9IGFyZzE7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShkZWZlcnJlZDBfMCwgZGVmZXJyZWQwXzEsIDEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zdWJhcnJheV9hMWY3M2NkNGI1YjQyZmUxID0gZnVuY3Rpb24oYXJnMCwgYXJnMSwgYXJnMikge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkuc3ViYXJyYXkoYXJnMSA+Pj4gMCwgYXJnMiA+Pj4gMCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19nZXRSYW5kb21WYWx1ZXNfN2U0MmI0ZmI4Nzc5ZGM2ZCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaGFuZGxlRXJyb3IoZnVuY3Rpb24gKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgZ2V0T2JqZWN0KGFyZzApLmdldFJhbmRvbVZhbHVlcyhnZXRPYmplY3QoYXJnMSkpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX21lbW9yeSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCByZXQgPSB3YXNtLm1lbW9yeTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2J1ZmZlcl8xMmQwNzljYzIxZTE0YmRiID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkuYnVmZmVyO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3d2l0aGJ5dGVvZmZzZXRhbmRsZW5ndGhfYWE0YTE3YzMzYTA2ZTVjYiA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IFVpbnQ4QXJyYXkoZ2V0T2JqZWN0KGFyZzApLCBhcmcxID4+PiAwLCBhcmcyID4+PiAwKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3JhbmRvbUZpbGxTeW5jX2I3MGNjYmRmNDkyNmE5OWQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uIChhcmcwLCBhcmcxKSB7XG4gICAgICAgIGdldE9iamVjdChhcmcwKS5yYW5kb21GaWxsU3luYyh0YWtlT2JqZWN0KGFyZzEpKTtcbiAgICB9LCBhcmd1bWVudHMpIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfY3J5cHRvX2QwNWI2OGEzNTcyYmI4Y2EgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5jcnlwdG87XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2lzX29iamVjdCA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgdmFsID0gZ2V0T2JqZWN0KGFyZzApO1xuICAgICAgICBjb25zdCByZXQgPSB0eXBlb2YodmFsKSA9PT0gJ29iamVjdCcgJiYgdmFsICE9PSBudWxsO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfcHJvY2Vzc19iMDJiMzU3MDI4MGQwMzY2ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkucHJvY2VzcztcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3ZlcnNpb25zX2MxY2I0MjIxM2NlZGYwZjUgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS52ZXJzaW9ucztcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX25vZGVfNDNiMTA4OWY0MDdlNGVjMiA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLm5vZGU7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19yZXF1aXJlXzlhN2UwZjY2N2VhZDQ5OTUgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbW9kdWxlLnJlcXVpcmU7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfSwgYXJndW1lbnRzKSB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5faXNfZnVuY3Rpb24gPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IHR5cGVvZihnZXRPYmplY3QoYXJnMCkpID09PSAnZnVuY3Rpb24nO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbXNDcnlwdG9fMTBmYzk0YWZlZTkyYmQ3NiA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLm1zQ3J5cHRvO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9vYmplY3RfY2xvbmVfcmVmID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zZWxmX2NlMGRiZmM0NWNmMmY1YmUgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gc2VsZi5zZWxmO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ193aW5kb3dfYzZmYjkzOWE3ZjQzNjc4MyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaGFuZGxlRXJyb3IoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCByZXQgPSB3aW5kb3cud2luZG93O1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19nbG9iYWxUaGlzX2QxZTZhZjQ4NTZiYTMzMWIgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2xvYmFsVGhpcy5nbG9iYWxUaGlzO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19nbG9iYWxfMjA3YjU1ODk0MjUyNzQ4OSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaGFuZGxlRXJyb3IoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCByZXQgPSBnbG9iYWwuZ2xvYmFsO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19uZXdub2FyZ3NfZTI1ODA4N2NkMGRhYTBlYSA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IEZ1bmN0aW9uKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19jYWxsXzI3YzBmODc4MDFkZWRmOTMgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uIChhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5jYWxsKGdldE9iamVjdChhcmcxKSk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfSwgYXJndW1lbnRzKSB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2NhbGxfYjNjYTdjNjA1MWY5YmVjMSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaGFuZGxlRXJyb3IoZnVuY3Rpb24gKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLmNhbGwoZ2V0T2JqZWN0KGFyZzEpLCBnZXRPYmplY3QoYXJnMikpO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH0sIGFyZ3VtZW50cykgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zZXRfMWY5YjA0ZjE3MDA1NWQzMyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaGFuZGxlRXJyb3IoZnVuY3Rpb24gKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gUmVmbGVjdC5zZXQoZ2V0T2JqZWN0KGFyZzApLCBnZXRPYmplY3QoYXJnMSksIGdldE9iamVjdChhcmcyKSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfSwgYXJndW1lbnRzKSB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fanN2YWxfbG9vc2VfZXEgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKSA9PSBnZXRPYmplY3QoYXJnMSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2Jvb2xlYW5fZ2V0ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCB2ID0gZ2V0T2JqZWN0KGFyZzApO1xuICAgICAgICBjb25zdCByZXQgPSB0eXBlb2YodikgPT09ICdib29sZWFuJyA/ICh2ID8gMSA6IDApIDogMjtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fbnVtYmVyX2dldCA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3Qgb2JqID0gZ2V0T2JqZWN0KGFyZzEpO1xuICAgICAgICBjb25zdCByZXQgPSB0eXBlb2Yob2JqKSA9PT0gJ251bWJlcicgPyBvYmogOiB1bmRlZmluZWQ7XG4gICAgICAgIGdldEZsb2F0NjRNZW1vcnkwKClbYXJnMCAvIDggKyAxXSA9IGlzTGlrZU5vbmUocmV0KSA/IDAgOiByZXQ7XG4gICAgICAgIGdldEludDMyTWVtb3J5MCgpW2FyZzAgLyA0ICsgMF0gPSAhaXNMaWtlTm9uZShyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9zdHJpbmdfZ2V0ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCBvYmogPSBnZXRPYmplY3QoYXJnMSk7XG4gICAgICAgIGNvbnN0IHJldCA9IHR5cGVvZihvYmopID09PSAnc3RyaW5nJyA/IG9iaiA6IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIHB0cjEgPSBpc0xpa2VOb25lKHJldCkgPyAwIDogcGFzc1N0cmluZ1RvV2FzbTAocmV0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICBnZXRJbnQzMk1lbW9yeTAoKVthcmcwIC8gNCArIDFdID0gbGVuMTtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAwXSA9IHB0cjE7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19pbnN0YW5jZW9mX1VpbnQ4QXJyYXlfMmIzYmJlY2QwMzNkMTlmNiA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGdldE9iamVjdChhcmcwKSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJldCA9IHJlc3VsdDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2luc3RhbmNlb2ZfQXJyYXlCdWZmZXJfODM2ODI1YmUwN2Q0YzlkMiA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGdldE9iamVjdChhcmcwKSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXQgPSByZXN1bHQ7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2RlYnVnX3N0cmluZyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZGVidWdTdHJpbmcoZ2V0T2JqZWN0KGFyZzEpKTtcbiAgICAgICAgY29uc3QgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHJldCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICBjb25zdCBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICBnZXRJbnQzMk1lbW9yeTAoKVthcmcwIC8gNCArIDFdID0gbGVuMTtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAwXSA9IHB0cjE7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX3Rocm93ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzAsIGFyZzEpKTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3RoZW5fYTczY2FhOWE4Nzk5MTU2NiA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLnRoZW4oZ2V0T2JqZWN0KGFyZzEpLCBnZXRPYmplY3QoYXJnMikpO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9jYl9kcm9wID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCBvYmogPSB0YWtlT2JqZWN0KGFyZzApLm9yaWdpbmFsO1xuICAgICAgICBpZiAob2JqLmNudC0tID09IDEpIHtcbiAgICAgICAgICAgIG9iai5hID0gMDtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJldCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfdGhlbl8wYzg2YTYwZThmY2ZlOWY2ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkudGhlbihnZXRPYmplY3QoYXJnMSkpO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfcXVldWVNaWNyb3Rhc2tfNDgxOTcxYjBkODdmM2RkNCA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgcXVldWVNaWNyb3Rhc2soZ2V0T2JqZWN0KGFyZzApKTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3F1ZXVlTWljcm90YXNrXzNjYmFlMmVjNmI2Y2QzZDYgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5xdWV1ZU1pY3JvdGFzaztcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX3Jlc29sdmVfYjAwODNhNzk2NzgyOGVjOCA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gUHJvbWlzZS5yZXNvbHZlKGdldE9iamVjdChhcmcwKSk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19kZWJ1Z183ZDg3OWFmY2U2Y2Y1NmNiID0gZnVuY3Rpb24oYXJnMCwgYXJnMSwgYXJnMiwgYXJnMykge1xuICAgICAgICBjb25zb2xlLmRlYnVnKGdldE9iamVjdChhcmcwKSwgZ2V0T2JqZWN0KGFyZzEpLCBnZXRPYmplY3QoYXJnMiksIGdldE9iamVjdChhcmczKSk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19lcnJvcl82OTY2MzA3MTA5MDBlYzQ0ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSwgYXJnMiwgYXJnMykge1xuICAgICAgICBjb25zb2xlLmVycm9yKGdldE9iamVjdChhcmcwKSwgZ2V0T2JqZWN0KGFyZzEpLCBnZXRPYmplY3QoYXJnMiksIGdldE9iamVjdChhcmczKSk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19pbmZvXzgwODAzZDlhM2YwYWFkMTYgPSBmdW5jdGlvbihhcmcwLCBhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhnZXRPYmplY3QoYXJnMCksIGdldE9iamVjdChhcmcxKSwgZ2V0T2JqZWN0KGFyZzIpLCBnZXRPYmplY3QoYXJnMykpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbG9nXzE1MWViNDMzM2VmMGZlMzkgPSBmdW5jdGlvbihhcmcwLCBhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGdldE9iamVjdChhcmcwKSwgZ2V0T2JqZWN0KGFyZzEpLCBnZXRPYmplY3QoYXJnMiksIGdldE9iamVjdChhcmczKSk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ193YXJuXzVkM2Y3ODNiMGJhZTg5NDMgPSBmdW5jdGlvbihhcmcwLCBhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihnZXRPYmplY3QoYXJnMCksIGdldE9iamVjdChhcmcxKSwgZ2V0T2JqZWN0KGFyZzIpLCBnZXRPYmplY3QoYXJnMykpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfaW1wb3J0S2V5X2ZmYzEzMTc1ZDM0NTE2OGMgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uIChhcmcwLCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0LCBhcmc1LCBhcmc2KSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5pbXBvcnRLZXkoZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzEsIGFyZzIpLCBnZXRPYmplY3QoYXJnMyksIGdldE9iamVjdChhcmc0KSwgYXJnNSAhPT0gMCwgZ2V0T2JqZWN0KGFyZzYpKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9LCBhcmd1bWVudHMpIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9jbG9zdXJlX3dyYXBwZXI1NDY1ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSwgYXJnMikge1xuICAgICAgICBjb25zdCByZXQgPSBtYWtlTXV0Q2xvc3VyZShhcmcwLCBhcmcxLCAxODYsIF9fd2JnX2FkYXB0ZXJfNDIpO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG5cbiAgICByZXR1cm4gaW1wb3J0cztcbn1cblxuZnVuY3Rpb24gX193YmdfaW5pdF9tZW1vcnkoaW1wb3J0cywgbWF5YmVfbWVtb3J5KSB7XG5cbn1cblxuZnVuY3Rpb24gX193YmdfZmluYWxpemVfaW5pdChpbnN0YW5jZSwgbW9kdWxlKSB7XG4gICAgd2FzbSA9IGluc3RhbmNlLmV4cG9ydHM7XG4gICAgX193YmdfaW5pdC5fX3diaW5kZ2VuX3dhc21fbW9kdWxlID0gbW9kdWxlO1xuICAgIGNhY2hlZEZsb2F0NjRNZW1vcnkwID0gbnVsbDtcbiAgICBjYWNoZWRJbnQzMk1lbW9yeTAgPSBudWxsO1xuICAgIGNhY2hlZFVpbnQ4TWVtb3J5MCA9IG51bGw7XG5cbiAgICB3YXNtLl9fd2JpbmRnZW5fc3RhcnQoKTtcbiAgICByZXR1cm4gd2FzbTtcbn1cblxuZnVuY3Rpb24gaW5pdFN5bmMobW9kdWxlKSB7XG4gICAgaWYgKHdhc20gIT09IHVuZGVmaW5lZCkgcmV0dXJuIHdhc207XG5cbiAgICBjb25zdCBpbXBvcnRzID0gX193YmdfZ2V0X2ltcG9ydHMoKTtcblxuICAgIF9fd2JnX2luaXRfbWVtb3J5KGltcG9ydHMpO1xuXG4gICAgaWYgKCEobW9kdWxlIGluc3RhbmNlb2YgV2ViQXNzZW1ibHkuTW9kdWxlKSkge1xuICAgICAgICBtb2R1bGUgPSBuZXcgV2ViQXNzZW1ibHkuTW9kdWxlKG1vZHVsZSk7XG4gICAgfVxuXG4gICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgV2ViQXNzZW1ibHkuSW5zdGFuY2UobW9kdWxlLCBpbXBvcnRzKTtcblxuICAgIHJldHVybiBfX3diZ19maW5hbGl6ZV9pbml0KGluc3RhbmNlLCBtb2R1bGUpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBfX3diZ19pbml0KGlucHV0KSB7XG4gICAgaWYgKHdhc20gIT09IHVuZGVmaW5lZCkgcmV0dXJuIHdhc207XG5cbiAgICBpZiAodHlwZW9mIGlucHV0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpbnB1dCA9IG5ldyBVUkwoJ3Rvb2xraXRfYmcud2FzbScsIGltcG9ydC5tZXRhLnVybCk7XG4gICAgfVxuICAgIGNvbnN0IGltcG9ydHMgPSBfX3diZ19nZXRfaW1wb3J0cygpO1xuXG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgfHwgKHR5cGVvZiBSZXF1ZXN0ID09PSAnZnVuY3Rpb24nICYmIGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkgfHwgKHR5cGVvZiBVUkwgPT09ICdmdW5jdGlvbicgJiYgaW5wdXQgaW5zdGFuY2VvZiBVUkwpKSB7XG4gICAgICAgIGlucHV0ID0gZmV0Y2goaW5wdXQpO1xuICAgIH1cblxuICAgIF9fd2JnX2luaXRfbWVtb3J5KGltcG9ydHMpO1xuXG4gICAgY29uc3QgeyBpbnN0YW5jZSwgbW9kdWxlIH0gPSBhd2FpdCBfX3diZ19sb2FkKGF3YWl0IGlucHV0LCBpbXBvcnRzKTtcblxuICAgIHJldHVybiBfX3diZ19maW5hbGl6ZV9pbml0KGluc3RhbmNlLCBtb2R1bGUpO1xufVxuXG5leHBvcnQgeyBpbml0U3luYyB9XG5leHBvcnQgZGVmYXVsdCBfX3diZ19pbml0O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAyMSBBZG9iZVxuICogQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBOT1RJQ0U6IEFkb2JlIHBlcm1pdHMgeW91IHRvIHVzZSwgbW9kaWZ5LCBhbmQgZGlzdHJpYnV0ZSB0aGlzIGZpbGUgaW5cbiAqIGFjY29yZGFuY2Ugd2l0aCB0aGUgdGVybXMgb2YgdGhlIEFkb2JlIGxpY2Vuc2UgYWdyZWVtZW50IGFjY29tcGFueWluZ1xuICogaXQuXG4gKi9cblxuaW1wb3J0IHsgc2V0dXBXb3JrZXIgfSBmcm9tICcuL3NyYy9saWIvcG9vbC93b3JrZXInO1xuXG5pbXBvcnQge1xuICBkZWZhdWx0IGFzIGluaXREZXRlY3RvcixcbiAgc2Nhbl9hcnJheV9idWZmZXIsXG59IGZyb20gJ0Bjb250ZW50YXV0aC9kZXRlY3Rvcic7XG5pbXBvcnQge1xuICBNYW5pZmVzdFN0b3JlLFxuICBnZXRNYW5pZmVzdFN0b3JlRnJvbUFycmF5QnVmZmVyLFxuICBnZXRNYW5pZmVzdFN0b3JlRnJvbU1hbmlmZXN0QW5kQXNzZXQsXG4gIGRlZmF1bHQgYXMgaW5pdFRvb2xraXQsXG59IGZyb20gJ0Bjb250ZW50YXV0aC90b29sa2l0JztcblxuZXhwb3J0IGludGVyZmFjZSBJU2NhblJlc3VsdCB7XG4gIGZvdW5kOiBib29sZWFuO1xuICBvZmZzZXQ/OiBudW1iZXI7XG59XG5cbmNvbnN0IHdvcmtlciA9IHtcbiAgYXN5bmMgY29tcGlsZVdhc20oYnVmZmVyOiBBcnJheUJ1ZmZlcik6IFByb21pc2U8V2ViQXNzZW1ibHkuTW9kdWxlPiB7XG4gICAgcmV0dXJuIFdlYkFzc2VtYmx5LmNvbXBpbGUoYnVmZmVyKTtcbiAgfSxcbiAgYXN5bmMgZ2V0UmVwb3J0KFxuICAgIHdhc206IFdlYkFzc2VtYmx5Lk1vZHVsZSxcbiAgICBidWZmZXI6IEFycmF5QnVmZmVyLFxuICAgIHR5cGU6IHN0cmluZyxcbiAgICBzZXR0aW5ncz86IHN0cmluZyxcbiAgKTogUHJvbWlzZTxNYW5pZmVzdFN0b3JlPiB7XG4gICAgYXdhaXQgaW5pdFRvb2xraXQod2FzbSk7XG4gICAgcmV0dXJuIGdldE1hbmlmZXN0U3RvcmVGcm9tQXJyYXlCdWZmZXIoYnVmZmVyLCB0eXBlLCBzZXR0aW5ncyk7XG4gIH0sXG4gIGFzeW5jIGdldFJlcG9ydEZyb21Bc3NldEFuZE1hbmlmZXN0QnVmZmVyKFxuICAgIHdhc206IFdlYkFzc2VtYmx5Lk1vZHVsZSxcbiAgICBtYW5pZmVzdEJ1ZmZlcjogQXJyYXlCdWZmZXIsXG4gICAgYXNzZXQ6IEJsb2IsXG4gICAgc2V0dGluZ3M/OiBzdHJpbmcsXG4gICkge1xuICAgIGF3YWl0IGluaXRUb29sa2l0KHdhc20pO1xuICAgIGNvbnN0IGFzc2V0QnVmZmVyID0gYXdhaXQgYXNzZXQuYXJyYXlCdWZmZXIoKTtcbiAgICByZXR1cm4gZ2V0TWFuaWZlc3RTdG9yZUZyb21NYW5pZmVzdEFuZEFzc2V0KFxuICAgICAgbWFuaWZlc3RCdWZmZXIsXG4gICAgICBhc3NldEJ1ZmZlcixcbiAgICAgIGFzc2V0LnR5cGUsXG4gICAgICBzZXR0aW5ncyxcbiAgICApO1xuICB9LFxuICBhc3luYyBzY2FuSW5wdXQoXG4gICAgd2FzbTogV2ViQXNzZW1ibHkuTW9kdWxlLFxuICAgIGJ1ZmZlcjogQXJyYXlCdWZmZXIsXG4gICk6IFByb21pc2U8SVNjYW5SZXN1bHQ+IHtcbiAgICBhd2FpdCBpbml0RGV0ZWN0b3Iod2FzbSk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG9mZnNldCA9IGF3YWl0IHNjYW5fYXJyYXlfYnVmZmVyKGJ1ZmZlcik7XG4gICAgICByZXR1cm4geyBmb3VuZDogdHJ1ZSwgb2Zmc2V0IH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyBmb3VuZDogZmFsc2UgfTtcbiAgICB9XG4gIH0sXG59O1xuXG5leHBvcnQgdHlwZSBXb3JrZXIgPSB0eXBlb2Ygd29ya2VyO1xuXG5zZXR1cFdvcmtlcih3b3JrZXIpO1xuIl0sIm5hbWVzIjpbIndhc20iLCJjYWNoZWRUZXh0RGVjb2RlciIsImNhY2hlZFVpbnQ4TWVtb3J5MCIsImdldFVpbnQ4TWVtb3J5MCIsImdldFN0cmluZ0Zyb21XYXNtMCIsIldBU01fVkVDVE9SX0xFTiIsImNhY2hlZFRleHRFbmNvZGVyIiwiZW5jb2RlU3RyaW5nIiwicGFzc1N0cmluZ1RvV2FzbTAiLCJpc0xpa2VOb25lIiwiY2FjaGVkSW50MzJNZW1vcnkwIiwiZ2V0SW50MzJNZW1vcnkwIiwiY2FjaGVkRmxvYXQ2NE1lbW9yeTAiLCJnZXRGbG9hdDY0TWVtb3J5MCIsImRlYnVnU3RyaW5nIiwiaW5pdFRvb2xraXQiLCJpbml0RGV0ZWN0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7O0lBT0c7SUFNSDtJQUNNLFNBQVUsY0FBYyxDQUFDLEtBQTBCLEVBQUE7SUFDdkQsSUFBQSxPQUFPLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxPQUFPLEVBQUUsSUFBSSxFQUFBO0lBQ3JFLFFBQUEsT0FBTyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7SUFDMUMsWUFBQSxLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNsQixZQUFBLFVBQVUsRUFBRSxJQUFJO0lBQ2pCLFNBQUEsQ0FBQyxDQUFDO1NBQ0osRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNUOztJQ3JCQTs7Ozs7OztJQU9HO0lBdUJHLFNBQVUsV0FBVyxDQUFDLE9BQXNCLEVBQUE7SUFDaEQsSUFBQSxTQUFTLEdBQUcsT0FBTyxDQUE4QixLQUFJO1lBQ25ELE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNoQyxJQUFJO2dCQUNGLE1BQU0sR0FBRyxHQUFHLE1BQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFFM0MsWUFBQSxXQUFXLENBQUM7SUFDVixnQkFBQSxJQUFJLEVBQUUsU0FBUztJQUNmLGdCQUFBLElBQUksRUFBRSxHQUFHO0lBQ1EsYUFBQSxDQUFDLENBQUM7SUFDdEIsU0FBQTtJQUFDLFFBQUEsT0FBTyxL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
