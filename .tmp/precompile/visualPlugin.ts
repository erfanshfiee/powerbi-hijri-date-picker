import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var shamisDaePickerCBC4342D1F2F4F3DB80DB2528757FF1C_DEBUG: IVisualPlugin = {
    name: 'shamisDaePickerCBC4342D1F2F4F3DB80DB2528757FF1C_DEBUG',
    displayName: 'shamisDaePicker',
    class: 'Visual',
    apiVersion: '5.3.0',
    create: (options?: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = (<any>globalThis).dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["shamisDaePickerCBC4342D1F2F4F3DB80DB2528757FF1C_DEBUG"] = shamisDaePickerCBC4342D1F2F4F3DB80DB2528757FF1C_DEBUG;
}
export default shamisDaePickerCBC4342D1F2F4F3DB80DB2528757FF1C_DEBUG;