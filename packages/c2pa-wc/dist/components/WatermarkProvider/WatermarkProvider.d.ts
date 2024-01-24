import { LitElement } from 'lit';
declare global {
    interface HTMLElementTagNameMap {
        'cai-watermark-provider-dm-plugin': WatermarkProvider;
    }
    namespace JSX {
        interface IntrinsicElements {
            'cai-watermark-provider-dm-plugin': any;
        }
    }
}
declare const WatermarkProvider_base: (new (...args: any[]) => import("../../mixins/configurable").ConfigurableInterface<Record<string, any>>) & (new (...args: any[]) => import("../../mixins/panelSection").PanelSectionInterface<string | null | undefined>) & typeof LitElement;
export declare class WatermarkProvider extends WatermarkProvider_base {
    static get styles(): import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<2 | 1>;
}
export {};
