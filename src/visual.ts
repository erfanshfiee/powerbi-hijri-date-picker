"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";
import Index from "./components/Index";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import { VisualFormattingSettingsModel } from "./settings";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BasicFilterOperators, FilterType, IFilter } from "powerbi-models";
import VisualObjectInstance = powerbi.VisualObjectInstance;
export class Visual implements IVisual {
  private target: HTMLElement;
  private formattingSettings: VisualFormattingSettingsModel;
  private formattingSettingsService: FormattingSettingsService;
  private reactRoot: React.JSX.Element;
  host: powerbi.extensibility.visual.IVisualHost;
  updateOptions: VisualUpdateOptions;

  getUpdateOptions() {
    return this.updateOptions;
  }

  saveDates(dateIds: number[], startAndEndUnixTime: string) {
    const instance: VisualObjectInstance = {
      objectName: "selectedDates",
      selector: undefined,
      properties: {
        selectedDates:
          dateIds[0].toString() + "_" + dateIds[dateIds.length - 1].toString(),
        startAndEndUnixTime,
      },
    };

    this.host.persistProperties({
      merge: [instance],
    });
  }

  onDatesChange(dateIds: number[], startAndEndUnixTime: string) {
    const filter: IBasicFilter = {
      $schema: "http://powerbi.com/product/schema#basic",
      target: {
        table: `MRS3 DimDate`,
        column: "DateID",
      },
      operator: "In",
      filterType: FilterType.Basic,
      values: dateIds,
    };
    this.host.applyJsonFilter(
      filter,
      "general",
      "filter",
      powerbi.FilterAction.merge
    );
    this.saveDates(dateIds, startAndEndUnixTime);
  }

  onRemoveFilter() {
    this.host.applyJsonFilter(
      null,
      "general",
      "filter",
      powerbi.FilterAction.merge
    );
    const instance: VisualObjectInstance = {
      objectName: "selectedDates",
      selector: undefined,
      properties: {
        selectedDates: "",
        startAndEndUnixTime: "",
      },
    };
    this.host.persistProperties({
      merge: [instance],
    });
  }

  constructor(options: VisualConstructorOptions) {
    this.target = options.element;
    this.host = options.host;
    this.reactRoot = React.createElement(Index, {
      onDatesChange: this.onDatesChange.bind(this),
      getUpdateOptions: this.getUpdateOptions.bind(this),
      onRemoveFilter: this.onRemoveFilter.bind(this),
    });

    ReactDOM.render(this.reactRoot, this.target);
  }

  public update(options: VisualUpdateOptions) {
    this.updateOptions = options;
  }

  /**
   * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
   * This method is called once every time we open properties pane or when the user edit any format property.
   */
  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(
      this.formattingSettings
    );
  }
}
export interface IBasicFilter extends IFilter {
  operator: BasicFilterOperators;
  values: (string | number | boolean)[];
}
