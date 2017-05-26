import * as angular from "angular";
import { DataService } from "../../Services/DataService";

/**
 * Controls the application information display
 */
export class AppInfoController {

    //
    // Literals
    //
    readonly hideInfoStr = "Hide Info ^";
    readonly showInfoStr = "Show Info >";

    // internal values
    private message_: string;
    private listItems_: string[];
    private infoMessage_: string;
    private infoAvailable_: boolean;
    private seconds_: number;

    /**
     * Initializes a new instance of the AppInfoController class
     * @param intervalService : angular clock services
     * @param dataService : the back end communication service
     */
    constructor(private intervalService: angular.IIntervalService, private dataService: DataService) {
        // Read the model
        dataService.readModel(() => {
            this.message_ = dataService.message;
            this.listItems_ = dataService.listItems;
        });

        // Initialize info status
        this.infoMessage_ = this.hideInfoStr;
        this.infoAvailable_ = true;

        // initialize counter
        this.seconds_ = 0;
        this.intervalService(() => { this.seconds_++; }, 1000);
    }

    // Expose internal values
    get message(): string {
        return this.message_;
    }

    get listItems(): string[] {
        return this.listItems_;
    }

    get infoMessage(): string {
        return this.infoMessage_;
    }

    get infoAvailable(): boolean {
        return this.infoAvailable_;
    }

    get seconds(): number {
        return this.seconds_;
    }

    /**
     * Troggles information visibility
     */
    troggleInfo(): void {
        this.infoAvailable_ = !this.infoAvailable_;
        this.infoMessage_ = this.infoAvailable_ ? this.hideInfoStr : this.showInfoStr;
    }
}