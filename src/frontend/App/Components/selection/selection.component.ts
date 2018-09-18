import { IComponentOptions } from "angular";
import { SelectionController } from "./selection.component.ctrl";

export const Selection: IComponentOptions = {
    bindings: {
         options: "<",
         selectedOption: "<",
         updateOption: "&"
     },
     controller: SelectionController,
     templateUrl: "selection/selection.template.htm"
};
