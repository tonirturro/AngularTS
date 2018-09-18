import { ISelectionOption } from "./selection";

export class SelectionController {
    public options: ISelectionOption[];
    public selectedOption: number;
    public updateOption: (option: number) => void;
}
