/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { LitElement } from 'lit';
import '../PanelSection';
declare global {
    interface HTMLElementTagNameMap {
        'cai-produced-by-dm-plugin': ProducedBy;
    }
    namespace JSX {
        interface IntrinsicElements {
            'cai-produced-by-dm-plugin': any;
        }
    }
}
declare const ProducedBy_base: (new (...args: any[]) => import("../../mixins/localizable").LocalizableInterface) & typeof LitElement;
export declare class ProducedBy extends ProducedBy_base {
    static get styles(): import("lit").CSSResult[];
    data: string | undefined;
    render(): import("lit-html").TemplateResult<1>;
}
export {};
