const   request = require("request"),
        convert = require("xml-js"),
        wait = require('wait-for-stuff'),
        JsonFind = require('json-find'),
        async = require("async");

const   constants = require(__dirname + "/../constants/constants.js"),
        messages = require(__dirname + "/../messages/messages.js"),
        mysql = require(__dirname + "/../mysql/mysql.js");

request(constants.CIVIL_PROTECTION_URL, (error, response, body) => {

    if (error) {
        messages.throwErrorMessage(error);
        return;
    }

    if (response.statusCode !== 200) messages.throwStatusCodeErrorMessage(response.statusCode, constants.CIVIL_PROTECTION_URL);
    else {
        let civilProtectionArray = [];
        body = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));

        if (!JsonFind(body).checkKey("kml")) {
            messages.throwMissingKeyErrorMessage("kml");
            return;
        }
        if (!JsonFind(body.kml).checkKey("Document")){
            messages.throwMissingKeyErrorMessage("Document");
            return;
        }
        if (!JsonFind(body.kml.Document).checkKey("Folder")) {
            messages.throwMissingKeyErrorMessage("Folder");
            return;
        }

        if (body.kml.Document.Folder.length > 0) {

            if (!JsonFind(body.kml.Document.Folder[0]).checkKey("Placemark")) {
                messages.throwMissingKeyErrorMessage("Placemark");
                return;
            }

            let placemark = body.kml.Document.Folder[0].Placemark;

            for (let i = 0; i < placemark.length; i++) {
                let civilProtectionObject = {};

                if (!JsonFind(placemark[i]).checkKey("name")) {
                    messages.throwMissingKeyErrorMessage("name");
                    return;
                }
                if (!JsonFind(placemark[i].name).checkKey("_text")) {
                    messages.throwMissingKeyErrorMessage("_text");
                    return;
                }

                civilProtectionObject[Object.keys(placemark[i])[0]] = placemark[i].name._text;

                if (!JsonFind(placemark[i]).checkKey("ExtendedData")) {
                    messages.throwMissingKeyErrorMessage("ExtendedData");
                    return;
                }
                if (!JsonFind(placemark[i].ExtendedData).checkKey("Data")) {
                    messages.throwMissingKeyErrorMessage("Data");
                    return;
                }

                for (let j = 0; j < placemark[i].ExtendedData.Data.length; j++) {

                    let data = placemark[i].ExtendedData.Data[j];

                    if (!JsonFind(data).checkKey("_attributes")) {
                        messages.throwMissingKeyErrorMessage("_attributes");
                        return;
                    }
                    if (!JsonFind(data._attributes).checkKey("name")) {
                        messages.throwMissingKeyErrorMessage("name");
                        return;
                    }
                    if (!JsonFind(data).checkKey("value")) {
                        messages.throwMissingKeyErrorMessage("value");
                        return;
                    }

                    civilProtectionObject[data._attributes.name] = (data.value._text ? data.value._text : constants.EMPTY);
                }
                civilProtectionArray.push({"Protecao Civil": civilProtectionObject});
            }
        }

        async.forEach(civilProtectionArray, function(civilProtectionObject, callback) {

            mysql.checkIfExists(
                civilProtectionObject["Protecao Civil"][constants.KML_DATA_ARRAY[0]],
                civilProtectionObject["Protecao Civil"][constants.KML_DATA_ARRAY[1]],
                civilProtectionObject["Protecao Civil"][constants.KML_DATA_ARRAY[2]],
                civilProtectionObject["Protecao Civil"][constants.KML_DATA_ARRAY[3]],
                civilProtectionObject["Protecao Civil"][constants.KML_DATA_ARRAY[4]],
                civilProtectionObject["Protecao Civil"][constants.KML_DATA_ARRAY[5]],
                civilProtectionObject["Protecao Civil"][constants.KML_DATA_ARRAY[6]],
                civilProtectionObject["Protecao Civil"][constants.KML_DATA_ARRAY[7]],
                civilProtectionObject["Protecao Civil"][constants.KML_DATA_ARRAY[8]],
            function (results) {

                if (!results) {
                    let coordinates = civilProtectionObject["Protecao Civil"][constants.KML_DATA_ARRAY[8]].replace(/\s+/g, '').split(",");

                    if (coordinates.length !== 2) {
                        messages.throwDataErrorMessage(coordinates, constants.CIVIL_PROTECTION_URL);
                        return;
                    }
                    let latitude = coordinates[0];
                    let longitude = coordinates[1];

                    let overpassApiRequest = constants.OVERPASS_API_URL +
                        "[out:json][timeout:25];" +
                        "(" +
                        "way" +
                        "(around:20," + latitude + "," + longitude + ")" +
                        "[highway][highway!='pedestrian'][highway!='footway']" +
                        "(if:is_tag(name) || is_tag(alt_name) || is_tag(ref));" +
                        ">;);" +
                        "out body;";

                    request(overpassApiRequest, (error, response, body) => {
                        if (error) {
                            messages.throwErrorMessage(error);
                            return;
                        }

                        if (response.statusCode !== 200) messages.throwStatusCodeErrorMessage(response.statusCode, overpassApiRequest);
                        else {

                            if (JSON.parse(body).elements.length) {
                                let nameArray = [];
                                for (let j in JSON.parse(body).elements) {

                                    if (JSON.parse(body).elements[j].type === 'way') {

                                        if (JSON.parse(body).elements[j].tags.name) {
                                            if(nameArray.indexOf(JSON.parse(body).elements[j].tags.name) === -1) nameArray.push(JSON.parse(body).elements[j].tags.name);
                                        } else if (JSON.parse(body).elements[j].tags.alt_name) {
                                            if(nameArray.indexOf(JSON.parse(body).elements[j].tags.alt_name) === -1) nameArray.push(JSON.parse(body).elements[j].tags.alt_name);
                                        } else if (JSON.parse(body).elements[j].tags.ref) {
                                            if(nameArray.indexOf(JSON.parse(body).elements[j].tags.ref) === -1) nameArray.push(JSON.parse(body).elements[j].tags.ref);
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            });
            wait.for.time(5);
            callback();
        });
    }
});

let getOverpassUrl = function (key, value) {
    console.log(constants.OVERPASS_API_URL +
        "[out:json][timeout:25];" +
        "way[" + key + "=\"" + value + "\"];" +
        "(._;>;);" +
        "out body;");
    return constants.OVERPASS_API_URL +
        "[out:json][timeout:25];" +
        "way[" + key + "=\"" + value + "\"];" +
        "(._;>;);" +
        "out body;";
};
