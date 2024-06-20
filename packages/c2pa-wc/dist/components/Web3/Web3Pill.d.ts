/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { LitElement } from 'lit';
declare global {
    interface HTMLElementTagNameMap {
        'cai-web3-pill-dm-plugin': Web3Pill;
    }
    namespace JSX {
        interface IntrinsicElements {
            'cai-web3-pill-dm-plugin': any;
        }
    }
}
declare const Web3Pill_base: (new (...args: any[]) => import("../../mixins/localizable").LocalizableInterface) & typeof LitElement;
export declare class Web3Pill extends Web3Pill_base {
    key: string;
    address: string;
    hidden: boolean;
    constructor();
    static get styles(): import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<1>;
    handleClick: (address: string) => void;
}
export {};
