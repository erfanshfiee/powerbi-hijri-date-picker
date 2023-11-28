import powerbi from "powerbi-visuals-api";
import "./../style/visual.less";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import { BasicFilterOperators, IFilter } from "powerbi-models";
export declare class Visual implements IVisual {
    private target;
    private formattingSettings;
    private formattingSettingsService;
    private reactRoot;
    host: powerbi.extensibility.visual.IVisualHost;
    updateOptions: VisualUpdateOptions;
    getUpdateOptions(): VisualUpdateOptions;
    saveDates(dateIds: number[], startAndEndUnixTime: string): void;
    onDatesChange(dateIds: number[], startAndEndUnixTime: string): void;
    onRemoveFilter(): void;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property.
     */
    getFormattingModel(): powerbi.visuals.FormattingModel;
}
export interface IBasicFilter extends IFilter {
    operator: BasicFilterOperators;
    values: (string | number | boolean)[];
}
