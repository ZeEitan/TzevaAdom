export default class Alert {
    constructor(alertMessage, AllCities, AllAreas) {
        this._alertMessage = alertMessage;
        this._AllCities = AllCities;
        this._AllAreas = AllAreas;

        this._alertData = this.#parseAlertData();
        this._alertCities = this._alertData.data.cities;
        this._alertArea = this.#getAlertArea(AllCities, AllAreas);
        this._type = this._alertData.type;
        this._threat = this._alertData.data.threat;
        this._threatName = threatsNames[this._threat];
    }

    isAlert(){
        return this._type === "ALERT";
    }

    #parseAlertData(){
        return JSON.parse(this._alertMessage.data);
    }

    #getAlertArea(){

        if(this.alertCities === undefined) return undefined;

        let alertAreas = new Set();
         this._alertCities.forEach((city) => ( // get the alert areas
            alertAreas = alertAreas.add(this._AllAreas[this._AllCities[city]["area"]]["he"])
        ));
        return Array.from(alertAreas).sort(); // sort the alert areas
    }

    get alertArea() {
        return this._alertArea;
    }

    get alertCities() {
        return this._alertCities;
    }

    get type() {
        return this._type;
    }

    get threat() {
        return this._threat;
    }

    get threatName() {
        return this._threatName;
    }
    get alertData() {
        return this._alertData;
    }
}