import WebSocket from 'ws';
import { EventEmitter } from 'node:events';
import Alert from './Alert.js';

export default class TzevaAdom extends EventEmitter {
    constructor() {
        super();
        this.#fetchGeographicData().then(data => {
            this._AllAreas = data.areas;
            this._AllCities = data.cities
        });

        this.#wsConnect().then();
    }

    async #wsConnect() {
        this._ws = this.#createWebSocket();
        let isReconnecting = false;

        const handleReconnect = () => { // handle the reconnection
            this._ws.close();
            if (isReconnecting) return;
            isReconnecting = true;
            setTimeout(this.#wsConnect.bind(this), 5000); // Bind 'this' to the function
        };

        this._ws.onopen = () => {}; // log the connection

        this._ws.onclose = () => handleReconnect(); // reconnect if the connection is closed

        this._ws.onerror = (e) => {
            console.error(e.error);
            handleReconnect();
        }
        this._ws.onmessage = async (m) => {
            this.#handelMessage(m);
        }
    }

     #createWebSocket() {
        const WEBSOCKET_URL = "wss://ws.tzevaadom.co.il:8443/socket?platform=WEB"; // the websocket url
        return new WebSocket(WEBSOCKET_URL, {
            headers: {
                origin: "https://www.tzevaadom.co.il",
            },
        });
    }

    #handelMessage(message){
        if (typeof message.data !== "string") return null;

        const ALERT = new Alert(message, this._AllCities, this._AllAreas);

        if (ALERT.isAlert()) {
            this.emit("onAlert", ALERT);
        }
    }

    async #fetchGeographicData() {
        const versionR = await fetch("https://api.tzevaadom.co.il/lists-versions");
        const versionJson = await versionR.json();
        const version = versionJson.cities;

        let response = await fetch(
            "https://www.tzevaadom.co.il/static/cities.json?v=" + version
        );
        response = await response.json();

        return {cities: response.cities, areas: response.areas};
    }
}