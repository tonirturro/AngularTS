import * as angular from "angular"
import { Person } from "../Model/Person";

/*
** Model definition
**/
interface IServerModel {
    message: string;
    items: string[];
    people: Person[];
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
        private $log: angular.ILogService) {
        this._maxId = 0;
        this._people = [];
    }

    /**
     * Initializes the model from the back end data.
     * @param callBack
     */
    readModel(callBack: () => void): void {

        let info: IServerModel;

        this._maxId = 0;
        this.$http.get("REST").then(response => {
            info = <IServerModel>response.data;
            this._message = info.message;
            this._listItems = info.items;
            this._people = info.people;
            for (var i = 0; i < info.people.length; i++) {
                if (this._maxId < info.people[i].id) {
                    this._maxId = info.people[i].id;
                }

                this.$log.info(`Last ID used : ${this._maxId}`);
            }

            callBack();
        });
    }

    /*
    ** Get the message property
    */
    get message(): string {
        return this._message;
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

    
    /**
     * Adds a new user
     * @param givenName
     * @param famillyName
     */
    addUser(givenName: string, famillyName: string):boolean {
        this._people.push(new Person(this._maxId++, givenName, famillyName));
        return true;
    }

    
    /**
     * deletes a new user
     * @param userId : id for the user to delete
     */
    deleteUser(userId: number): boolean {
        for (var i = 0; i < this._people.length; i++) {
            if (this._people[i].id === userId) {
                this._people.splice(i, 1);
                return true;
            }
        }

        return false;
    }
}