import Util from '../../Common/Util';

import TypeCategoryType from './TypeCategoryType';
import TypeCategoryModel from './TypeCategoryModel';
import VersionInfo from './VersionInfo';

export default class TypeCategory {
    constructor(obj) {
        if (obj) {
            Object.assign(this, obj);

            if (obj.versionInfo !== null && obj.versionInfo !== undefined) {
                this.versionInfo = VersionInfo.fromJSONWithID(obj.versionInfo, 0);
            } else {
                this.versionInfo = new VersionInfo();
            }

            this.type = [];
            if (obj.type !== null && obj.type !== undefined) {
                if (obj.type.length === 0) {
                    this.type = [new TypeCategoryType()];
                } else {
                    obj.type.forEach(t => {
                        //if (t.typeCode !== "") {
                        let maxtype = this.type.length;
                        let x = TypeCategoryType.fromJSONWithID(t, maxtype);
                        this.type.push(x);
                        //this.addType(x);
                        //}
                    });
                }
            } else {
                this.Type = [new TypeCategoryType()];
            }

            this.model = [];
            if (obj.model === null || obj.model === undefined) {
                this.model = [];
            } else {
                if (obj.model.length === 0) {
                    this.model = [];
                } else {
                    obj.model.forEach(m => {
                        let maxtype = this.model.length;
                        let mm = TypeCategoryModel.fromJSONWithID(m, maxtype);
                        if (mm !== null && mm !== undefined) {
                            this.model.push(mm);
                        }
                    });
                }
            }

            if (this.mlUri === null || this.mlUri === undefined || this.mlUri === "") this.setMLUri();
        } else {

            this.id = 1;
            this.mlUri = "";
            this.typeCategoryName = "";
            this.typeCategoryDescription = "";
            this.typeCategoryIdentifierText = "";
            this.systemIdentifierText = "";
            this.rightSystemName = "";
            this.defaultTypeCode = "";
            this.rightTypeCategoryName = "";

            this.versionInfo = new VersionInfo();

            //let atype = new Type();
            this.type = [new TypeCategoryType()];
            //this.Type.push(new Type());

            this.model = [new TypeCategoryModel()];
        }
    }

    getName() { return 'TypeCategory'; }

    checkRequired() {
        if (this.isNull(this.typeCategoryIdentifierText) || this.isNull(this.typeCategoryName) || this.isNull(this.systemIdentifierText)) {
            return false;
        }

        return true;
    }

    isNull(field) {
        return field === null || field === undefined;
    }

    isNewOrEmpty() {
        if (this.isNull(this.typeCategoryIdentifierText) || this.isNull(this.typeCategoryName) || this.isNull(this.systemIdentifierText)) {
            return true;
        }

        return false;
    }

    get(element) {
        if (element === null || element === undefined) return;

        // Uncomment this line to convert first character to lowercase
        //let e = element[0].toLowerCase() + element.substring(1, element.length);
        let e = element;

        if (e === null || e === undefined) return;

        let value = null;

        switch (e) {
            case 'typeCategoryName':
                value = this.typeCategoryName;
                break;
            case 'typeCategoryDescription':
                value = this.typeCategoryDescription;
                break;
            case 'typeCategoryIdentifierText':
                value = this.typeCategoryIdentifierText;
                break;
            case 'systemIdentifierText':
                value = this.systemIdentifierText;
                break;
            case 'rightSystemName':
                value = this.rightSystemName;
                break;
            case 'defaultTypeCode':
                value = this.defaultTypeCode;
                break;
            case 'rightTypeCategoryName':
                value = this.rightTypeCategoryName;
                break;
            case 'type':
                value = this.type;
                break;
            case 'id':
                value = this.versionInfo.getId();
                break;
            case 'fileVersion':
                value = this.versionInfo.getFileVersion();
                break;
            case 'targettedRelease':
                value = this.versionInfo.getTargettedRelease();
                break;
            case 'loadedBy':
                value = this.versionInfo.getLoadedBy();
                break;
            case 'itemCount':
                value = this.versionInfo.getItemCount();
                break;
            case 'loadDate':
                let _value = this.versionInfo.getLoadDate();
                let _date = (new Date(_value));
                value = _date.toLocaleDateString() + " " + _date.toLocaleTimeString();
                break;
            default:
                break;
        }

        return value;
    }

    set(element) {
        // expecting either array or string
        if (typeof (element) === 'string') {
            return;
        } else if (typeof (element) === 'object') {
            let l = element.length;
            if (l === -1 || l === undefined) return;
            // its an array, so === tagsArray
            if (element[0].getName() === 'TypeCategoryType') {
                this.setType(element);
                return;
            } else {
                return;
            }
        } else {
            return;
        }
    }

    updateValues(entry) {
        switch (entry.attributeName) {
            case 'typeCategoryName':
                this.setTypeCategoryName(entry.attributeValue);
                break;
            case 'typeCategoryDescription':
                this.setTypeCategoryDescription(entry.attributeValue);
                break;
            case 'typeCategoryIdentifierText':
                this.setTypeCategoryIdentifierText(entry.attributeValue);
                this.setMLUri("/" + this.versionInfo.getId() + "/" + this.getTypeCategoryIdentifierText() + ".json");
                break;
            case 'systemIdentifierText':
                this.setSystemIdentifierText(entry.attributeValue);
                break;
            case 'rightSystemName':
                this.setRightSystemName(entry.attributeValue);
                break;
            case 'defaultTypeCode':
                this.setDefaultTypeCode(entry.attributeValue);
                break;
            case 'rightTypeCategoryName':
                this.setRightTypeCategoryName(entry.attributeValue);
                break;
            case 'fileVersion':
                this.versionInfo.setFileVersion(entry.attributeValue);
                break;
            case 'targettedRelease':
                this.versionInfo.setTargettedRelease(entry.attributeValue);
                break;
            default:
                break;
        }

        if (this.type !== null && this.type !== undefined) {
            this.type.forEach(t => { t.updateValues(entry) });
        }
    }

    updateData(entry) {
        if (entry.getName() === 'TypeCategoryType') {
            // do we have it? means update.  If we don't have it, it will be new add
            let found = this.type.filter(t => {
                return t.typeCode === entry.typeCode;
            });

            if (!found || found.length === 0) {
                // add new
                this.type.push(entry);
            } else {
                // do update of found[0]
            }
        }
    }

    makeNew() {
        let tc = new TypeCategory();
        tc.type = [TypeCategoryType.makeNew()];
    }

    delete(record) {
        switch (record.getName()) {
            case 'TypeCategoryType':
                this.removeType(record)
                break;
            default:
                break;
        }
    }

    makeUri(pfx) {
        if (!this.typeCategoryIdentifierText) return undefined;

        return pfx ? "/TypeCategory/" + pfx + ".json" : "/TypeCategory/" + this.typeCategoryIdentifierText + ".json";
    }

    getID() {
        return this.id;
    }

    setID(id) {
        this.id = id;
    }

    getMLUri() {
        return this.mlUri;
    }

    setMLUri(uri) {
        this.mlUri = uri;
        /*
        if (uri === null || uri === undefined || uri.length <= 0) {
            this.mlUri = "/TypeCategory/" + this.typeCategoryIdentifierText + ".json";
        } else {
            this.mlUri = uri;
        }
        */
    }

    getSystemIdentifierText() {
        return this.systemIdentifierText;
    }

    setSystemIdentifierText(SystemIdentifierText) {
        this.systemIdentifierText = SystemIdentifierText;
    }

    getTypeCategoryName() {
        return this.typeCategoryName;
    }

    setTypeCategoryName(TypeCategoryName) {
        this.typeCategoryName = TypeCategoryName;
    }

    getRightSystemName() {
        return this.rightSystemName;
    }

    setRightSystemName(RightSystemName) {
        this.rightSystemName = RightSystemName;
    }

    getDefaultTypeCode() {
        return this.defaultTypeCode;
    }

    setDefaultTypeCode(DefaultTypeCode) {
        this.defaultTypeCode = DefaultTypeCode;
    }

    getRightTypeCategoryName() {
        return this.rightTypeCategoryName;
    }

    setRightTypeCategoryName(RightTypeCategoryName) {
        this.rightTypeCategoryName = RightTypeCategoryName;
    }

    getTypeCategoryIdentifierText() {
        return this.typeCategoryIdentifierText;
    }

    setTypeCategoryIdentifierText(TypeCategoryIdentifierText) {
        this.typeCategoryIdentifierText = TypeCategoryIdentifierText;

        if (this.mlUri === null || this.mlUri === undefined || this.mlUri === "") {
            this.setMLUri();
        }
    }

    getTypeCategoryDescription() {
        return this.typeCategoryDescription;
    }

    setTypeCategoryDescription(TypeCategoryDescription) {
        this.typeCategoryDescription = TypeCategoryDescription;
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    getVersionInfo() {
        return this.versionInfo;
    }

    setVersionInfo(vi) {
        this.versionInfo = vi;
    }

    toString() {
        return JSON.stringify(this);
    }

    asJSON() {
        this.setMLUri(null);
        return JSON.stringify(this);
    }

    static replacer(key, value) {
        if (key === "id") return undefined;
        else return value;
    }

    toJsonWithoutID() {
        this.setMLUri(null);
        return JSON.stringify(this, this.replacer);
    }

    addType(typeJson) {
        let maxtype = this.type ? this.type.length : 0;

        let type = TypeCategoryType.fromJSONWithID(typeJson, maxtype);

        if (type !== null) {
            this.type.push(type);
        }
    }

    removeType(type) {
        if (type !== null) {
            let newTypes = this.type.filter(f => {
                if (!f.equals(type)) {
                    return f;
                }
                return undefined;
            });

            this.setType(newTypes);
        }
    }

    toCSV() {
        //TypeCategoryIdentifierText,TypeCategoryName,TypeCategoryDescription,SystemIdentifierText,RightSystemName,RightTypeCategoryName,DefaultTypeCode,TypeCode,TypeDescription,TypeName,RightTypeCode,TagName,TagValue
        let csvLines = "";

        let line = this.typeCategoryIdentifierText + ',' +
            this.typeCategoryName + ',' +
            this.typeCategoryDescription + ',' +
            this.systemIdentifierText + ',' +
            this.rightSystemName + ',' +
            this.rightTypeCategoryName + ',' +
            this.defaultTypeCode + ',';

        this.type.forEach((t) => {
            let typeline = "";
            typeline = t.typeCode + ',' +
                t.typeDescription + ',' +
                t.typeName + ',' + t.rightTypeCode + ',';

            if (!Util.isArrayNullOrEmpty(t.tagsArray)) {
                t.tagsArray.forEach((ta) => {
                    let taLine = "";
                    taLine = ta.tagName + ',' + ta.tagValue;
                    csvLines += line + typeline + taLine + '\r\n';
                });
            } else {
                let empty = "";
                let taLine = "" + empty + "." + empty;
                csvLines += line + typeline + taLine + '\r\n';
            }
        });

        return csvLines;
    }

    isEqual(item) {
        let result = false;

        if (this.typeCategoryName === item.typeCategoryName &&
            this.typeCategoryDescription === item.typeCategoryDescription &&
            this.typeCategoryIdentifierText === item.typeCategoryIdentifierText &&
            this.systemIdentifierText === item.systemIdentifierText &&
            this.rightSystemName === item.rightSystemName &&
            this.defaultTypeCode === item.defaultTypeCode &&
            this.rightTypeCategoryName === item.rightTypeCategoryName) {
            result = true;
        };

        return result;
    }

    deepEqual(item) {
        let result = false;

        if (this.typeCategoryName === item.typeCategoryName &&
            this.typeCategoryDescription === item.typeCategoryDescription &&
            this.typeCategoryIdentifierText === item.typeCategoryIdentifierText &&
            this.systemIdentifierText === item.systemIdentifierText &&
            this.rightSystemName === item.rightSystemName &&
            this.defaultTypeCode === item.defaultTypeCode &&
            this.rightTypeCategoryName === item.rightTypeCategoryName) {

            if (this.type.length !== item.type.length) {
                return false;
            }

            this.type.forEach(t => item.type.forEach(it => {
                if (t.deepEqual(it)) {
                    result = true;
                }
            }))
        };

        return result;
    }

    static csvToJson(result) {
        var csv = result.split('\r\n');
        let i = 1;
        let typeCategories = {};

        // First row is header
        for (i = 1; i < csv.length; i++) {
            let cat = this.csvRecordToJson(typeCategories, csv[i], i);
            if (cat !== null) {
                typeCategories[cat.typeCategoryIdentifierText] = cat;
            }
        };

        let myFinalData = [];

        for (var key in typeCategories) {
            if (key === "NT_ISOCountryCode") {
                console.log(typeCategories[key]);
            }

            let typeArray = [];
            for (var tkey in typeCategories[key].type) {
                typeArray.push(typeCategories[key].type[tkey]);
            }
            typeCategories[key].type = typeArray;

            //
            // Convert to objects
            let tc = TypeCategory.fromJSONObject(typeCategories[key], typeCategories[key].id);

            //myFinalData.push(typeCategories[key]);
            myFinalData.push(tc);

            if (key === "NT_ISOCountryCode") {
                console.log(typeCategories[key]);
            }
        };

        typeCategories = {};

        return myFinalData;
    }

    static csvRecordToJson(categories, record, id) {
        //              0                   1                 2                       3                    4                     5                      6           7            8           9          10          11      12
        // "TypeCategoryIdentifierText,TypeCategoryName,TypeCategoryDescription,SystemIdentifierText,RightTypeCategoryName,RightTypeCategoryName,DefaultTypeCode,TypeCode,TypeDescription,TypeName,RightTypeCode,TagName,TagValue\r\n";
        let fields = record.split(',');

        if (categories[fields[0]]) {
            let tc = categories[fields[0]];

            let storedTypeDict = tc.type;

            if (storedTypeDict[fields[7]]) {
                let atc = storedTypeDict[fields[7]];
                let tagarraylength = atc.tagsArray.length;
                let tags = {};

                tags = {
                    "id": tagarraylength + 1,
                    "tagName": fields[11],
                    "tagValue": fields[12],
                };
                atc.tagsArray.push(tags);
            } else {
                let ctype = {};
                let tags = {};
                let typeCount = Object.keys(storedTypeDict).length + 1;

                tags = {
                    "id": 1,
                    "tagName": fields[11],
                    "tagValue": fields[12],
                };

                ctype = {
                    "id": typeCount,
                    "rightTypeCode": fields[10],
                    "typeName": fields[9],
                    "typeDescription": fields[8],
                    "typeCode": fields[7],
                    "tagsArray": [tags]
                };

                let k = fields[7];
                storedTypeDict[k] = ctype;
                tc.type = storedTypeDict;
            }
        } else {
            let ctype = {};
            let tags = {};

            tags = {
                "id": 1,
                "tagName": fields[11],
                "tagValue": fields[12],
            };

            ctype = {
                "id": 1,
                "rightTypeCode": fields[10],
                "typeName": fields[9],
                "typeDescription": fields[8],
                "typeCode": fields[7],
                "tagsArray": [tags]
            };

            let k = fields[7];
            let typeDict = {};
            typeDict[k] = ctype;
            let typeCategory = {
                "id": id,
                "documentURI": '/TypeCategory/' + fields[0] + '.json',
                "typeCategoryIdentifierText": fields[0],
                "typeCategoryName": fields[1],
                "typeCategoryDescription": fields[2],
                "systemIdentifierText": fields[3],
                "rightSystemName": fields[4],
                "rightTypeCategoryName": fields[5],
                "defaultTypeCode": fields[6],
                "type": typeDict,
            };

            return typeCategory;
        }

        return null;
    }

    static fromJSON(json) {
        try {
            let tc = new TypeCategory();

            tc = JSON.parse(json);

            return tc;
        } catch (error) {
            console.error("TypeCategory.fromJSON: Error: " + error);
        }
    }

    static fromJSONWithID(json, idStartAt) {
        try {
            //let tc = new TypeCategory(JSON.parse(json));
            let tc = new TypeCategory(json);

            tc.setID(idStartAt + 1);

            return tc;
        } catch (error) {
            console.error("TypeCategory.fromJSON: Error: " + error);
        }
    }

    static fromJSONObject(jsonObject, id) {
        // validate jsonObject
        if (jsonObject.typeCategoryName === null &&
            jsonObject.typeCategoryIdentifierText === null &&
            jsonObject.systemIdentifierText === null) {
            return null;
        }

        let tc = new TypeCategory(null);

        tc.id = id;
        tc.typeCategoryIdentifierText = jsonObject.typeCategoryIdentifierText;
        tc.mlUri = jsonObject.mlUri ? jsonObject.mlUri : tc.makeUri();
        tc.systemIdentifierText = jsonObject.systemIdentifierText;
        tc.typeCategoryName = jsonObject.typeCategoryName;
        tc.rightSystemName = jsonObject.rightSystemName;
        tc.defaultTypeCode = jsonObject.defaultTypeCode;
        tc.rightTypeCategoryName = jsonObject.rightTypeCategoryName;
        tc.typeCategoryDescription = jsonObject.rypeCategoryDescription;

        if (jsonObject.type === null || jsonObject.type === undefined) {
            return tc;
        }

        jsonObject.type.forEach(t => {
            let maxtype = tc.type.length;
            let x = TypeCategoryType.fromJSONWithID(t, maxtype);
            tc.type.push(x);
        });

        return tc;
    }

    addModel(model) {
        let found = this.getModelByName(model.name);
        if (found === null || found === undefined) {
            let m = new TypeCategoryModel();
            m.modelName = model.name;
            m.typeCategoryIdentifierText = this.typeCategoryIdentifierText;
            m.typeCategoryName = this.typeCategoryName;
            m.mlUri = this.mlUri;
            m.id = this.model.length + 1;
            this.model.push(m);
        }
    }

    getModelByName(name) {
        if (this.model === null || this.model === undefined) {
            return null;
        }

        if (this.model.length === 0) return null;

        let found = this.model.filter(m => {
            return m.modelName === name;
        });

        if (found.length !== 1) return null;

        return found[0];
    }
}
