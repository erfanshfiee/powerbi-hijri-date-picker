import * as React from "react";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import "./styles";
declare function Index(props: Props): React.JSX.Element;
export default Index;
interface Props {
    onDatesChange(dateIds: number[], startAndEndUnixTime: string): void;
    getUpdateOptions(): VisualUpdateOptions;
    onRemoveFilter(): void;
}
