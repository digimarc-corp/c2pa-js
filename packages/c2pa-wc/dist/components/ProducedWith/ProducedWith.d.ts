/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { L2ClaimGenerator, L2ManifestStore } from 'c2pa';
import { LitElement } from 'lit';
import '../Icon';
import '../PanelSection';
declare global {
    interface HTMLElementTagNameMap {
        'cai-produced-with-dm-plugin': ProducedWith;
    }
    namespace JSX {
        interface IntrinsicElements {
            'cai-produced-with-dm-plugin': any;
        }
    }
}
export interface ProducedWithConfig {
    stringMap: Record<string, string>;
}
declare const ProducedWith_base: (new (...args: any[]) => import("../../mixins/localizable").LocalizableInterface) & typeof LitElement;
export declare class ProducedWith extends ProducedWith_base {
    static get styles(): import("lit").CSSResult[];
    data: L2ClaimGenerator | undefined;
    manifestStore: L2ManifestStore | undefined;
    render(): import("lit-html").TemplateResult<1>;
}
export {};
