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

    private _maxId: number;
    private _message: string;
    private _listItems: string[];
    private _people: Person[];

    constructor(
        private $http: angular.IHttpService, 
        private $log: angular.ILogService)  {
        this._maxId = 0;
    }

     readModel(callBack:() => void): void {

        let info: IModel;

        this._maxId = 0;
        this.$http.get("REST").then(response => {
            info = <IModel>response.data;
            this._message = info._message;
            this._listItems = info._items;
            this._people = info._people;
            for (var i = 0; i < info._people.length; i++) {
                if (this._maxId < info._people[i].id) {
                    this._maxId = info._people[i].id;
                }

                this.$log.info(`Last ID used : ${this._maxId}`);
            }

            callBack();
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

    /*
    ** Get the max id property
    */
    get maxId(): number {
        return this._maxId;
    }
}