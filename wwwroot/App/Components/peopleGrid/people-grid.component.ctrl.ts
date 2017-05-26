import * as angular from "angular";
import { Person } from "../../Model/Person";
import { DataService } from "../../Services/DataService";

/**
 * Handles the bindings inside the component
 */
export class PeopleGridController {
    private people_: Person[];
    private sortOrder_: string;

    constructor(private logService: angular.ILogService,private dataService: DataService)
    {
        this.dataService.readModel(() => {
            this.people_ = this.dataService.people;
        });

        this.sortOrder_ = "+famillyName";
    }

    get people(): Person[] {
        return this.people_;
    }

    get sortOrder(): string {
        return this.sortOrder_;
    }

    set sortOrder(order: string) {
        this.sortOrder_ = order;
    }

    deleteContact(personId: number): void {
        if (this.dataService.deleteUser(personId)) {
            this.people_ = this.dataService.people;
            this.logService.info(`Deleted contact of ID : ${personId}`);
        }
    }
}
