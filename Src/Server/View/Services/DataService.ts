import * as angular from "angular"
import { Person } from "../Model/Person";

/*
** Model definition
**/
interface IModel {
    _message: string;
    _items: string[];
    _people: Person[];
}

/*
** Service to access data from the backend
*/
export class DataService {

    private maxId: number;
    private _message: string;
    private _listItems: string[];
    private _people: Person[];

    constructor(
        private $http: angular.IHttpService, 
        private $log: angular.ILogService)  {
        this.maxId = 0;
    }

     readModel(): void {

        let info: IModel;

        this.maxId = 0;
        this.$http.get("REST").then(response => {
            info = <IModel>response.data;
            this._message = info._message;
            this._listItems = info._items;
            this._people = info._people;
            for (var i = 0; i < info._people.length; i++) {
                if (this.maxId < info._people[i].id) {
                    this.maxId = info._people[i].id;
                }

                this.$log.info(`Last ID used : ${this.maxId}`);
            }
        });
    }

    /*
    ** Get the message property
    */
    get message(): string  {
         return this._message
     }

    /*
    ** Get the listItems property
    */
    get listItems(): string[] {
        return this._listItems;
    }

    /*
    ** Get the people property
    */
    get people(): Person[] {
        return this._people;
    }
}