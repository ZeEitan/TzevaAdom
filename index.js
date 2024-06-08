import TzevaAdom from './TzevaAdom.js'

const tzevaAdom = new TzevaAdom();

tzevaAdom.on("onAlert", (Alert) => {
    console.log(Alert.alertCities);
    console.log(Alert.alertArea);
    console.log(Alert.threatName);
    console.log(Alert.threat);
    console.log(Alert.type);
    console.log(Alert.alertData);
    console.log();
});