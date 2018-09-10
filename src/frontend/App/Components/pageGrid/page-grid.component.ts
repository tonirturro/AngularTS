import { IComponentOptions } from "angular";
import { PageGridController } from "./page-grid.component.ctrl";

/**
 * Defines the grid to add and delete people
 */
export const PageGrid: IComponentOptions = {
    controller: PageGridController,
    templateUrl: "pageGrid/page-grid.template.htm"
};
