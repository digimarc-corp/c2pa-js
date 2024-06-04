/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { L2Web3 } from 'c2pa';
import { LitElement } from 'lit';
import '../Icon';
import '../PanelSection';
import './Web3Pill';
declare global {
    interface HTMLElementTagNameMap {
        'cai-web3-dm-plugin': Web3;
    }
    namespace JSX {
        interface IntrinsicElements {
            'cai-web3-dm-plugin': any;
        }
    }
}
declare const Web3_base: (new (...args: any[]) => import("../../mixins/localizable").LocalizableInterface) & typeof LitElement;
export declare class Web3 extends Web3_base {
    static get styles(): import("lit").CSSResult[];
    data: L2Web3 | undefined;
    render(): import("lit-html").TemplateResult<1>;
}
export {};
