/*
**
** The main controller
**
*/
import { Person } from "./Model/Person";
import { DataService } from "./Services/DataService"

/*
** Scope definition
**/
export interface IMainControllerScope extends ng.IScope {
    message: string;
    listItems: string[];
    people: Person[];
    infoMessage: string;
    infoAvailable: boolean;
    newGivenName: string;
    newFamillyName: string;
    seconds: number;
    troggleInfo: () => void;
    changeGivenName: (string) => void;
    changeFamillyName: (string) => void;
    addContact: () => void;
    deleteContact: (number) => void;
    updateOrder: (string) => void;
    sortOrder: string;
}

/*
** Controller definition
*/
export class MainController {

    //
    // Literals
    //
    private readonly hideInfoStr = "Hide Info";
    private readonly showInfoStr = "Show Info";

    //
    // Fields
    // 
    private maxId: number;

    //
    // Dependencies declaration
    //
    static $inject = ["$scope", "$log", "$interval", "dataService"];

    //
    // Constructor
    // 
    constructor(
        private viewModel: IMainControllerScope,
        private logService: ng.ILogService,
        private intervalService: ng.IIntervalService,
        private dataService: DataService) {

        this.setControllerProperties();
        this.setControllerFunctions();
        this.dataService.readModel(() => {
            this.maxId = this.dataService.maxId;
            this.viewModel.message = this.dataService.message;
            this.viewModel.listItems = this.dataService.listItems;
            this.viewModel.people = this.dataService.people;
        });

        this.setCounter();
    }

    //
    // Controller properties
    // 
   private setControllerProperties(): void {
        this.viewModel.sortOrder = "+famillyName";
        this.viewModel.infoMessage = this.hideInfoStr;
        this.viewModel.infoAvailable = true;
        this.viewModel.newGivenName = "Given Name";
        this.viewModel.newFamillyName = "Familly name";
        this.viewModel.seconds = 0;
    }

    //
    // Controller functions
    //    
    private setControllerFunctions(): void {
        // Troggling info visibility
        this.viewModel.troggleInfo = () => {
            this.viewModel.infoAvailable = !this.viewModel.infoAvailable;
            this.viewModel.infoMessage = this.viewModel.infoAvailable ? this.hideInfoStr : this.showInfoStr;
        }

        // Edit names
        this.viewModel.changeGivenName = newGivenName => {
            this.viewModel.newGivenName = newGivenName;
        }

        this.viewModel.changeFamillyName = newFamillyName => {
            this.viewModel.newFamillyName = newFamillyName;
        }

        // Add Contact
        this.viewModel.addContact = () => {
            this.viewModel.people.push(new Person(++this.maxId, this.viewModel.newGivenName, this.viewModel.newFamillyName));
            this.logService.info(`Added Contact With ID ${this.maxId}`);
        }

        // Delete Contact
        this.viewModel.deleteContact = id => {
            for (var i = 0; i < this.viewModel.people.length; i++) {
                if (this.viewModel.people[i].id === id) {
                    this.viewModel.people.splice(i, 1);
                    break;
                }
            }

            this.logService.info(`Deleted contact of ID : ${id}`);
        }

        // Sort order
        this.viewModel.updateOrder = sortOrder => {
            this.viewModel.sortOrder = sortOrder;
        }
   }

    //
    // Enable Counter
    //
    private setCounter(): void {
        this.intervalService(() => { this.viewModel.seconds++; }, 1000)
    }
}