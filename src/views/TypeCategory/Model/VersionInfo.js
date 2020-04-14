import Util from '../../Common/Util';
import UserToken from '../../UserToken';

export default class VersionInfo {
    constructor(obj) {
        if (obj) {
            Object.assign(this, obj);
        } else {
            let _date = new Date();

            let user = UserToken.fromSession().user;

            this.id = Util.uuidv4();
            this.fileVersion = "";
            this.targettedRelease = "";
            this.loadedBy = user.username;
            this.loadDate = _date * 1;
            this.itemCount = 0;
        }
    }

    getName() { return 'VersionInfo'; }

    checkRequired() {
        return !Util.isNullOrEmpty(this.id);
    }

    isNull(field) {
        return field === null || field === undefined;
    }

    isNewOrEmpty() {
        if (this.isNull(this.id)) {
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
            case 'id':
                value = this.id;
                break;
            case 'fileVersion':
                value = this.fileVersion;
                break;
            case 'targettedRelease':
                value = this.targettedRelease;
                break;
            case 'loadedBy':
                value = this.loadedBy;
                break;
            case 'loadDate':
                value = this.loadDate;
                break;
            case 'itemCount':
                value = this.itemCount;
                break;
            default:
                break;
        }

        return value;
    }

    set(element) {
        return;
    }

    updateValues(entry) {
        switch (entry.attributeName) {
            case 'id':
                this.setId(entry.attributeValue);
                break;
            case 'fileVersion':
                this.setFileVersion(entry.attributeValue);
                break;
            case 'targettedRelease':
                this.setTargettedRelease(entry.attributeValue);
                break;
            case 'loadedBy':
                this.setLoadedBy(entry.attributeValue);
                break;
            case 'loadDate':
                this.setLoadDate(entry.attributeValue);
                break;
            case 'itemCount':
                this.setItemCount(entry.attributeValue);
                break;
            default:
                break;
        }
    }

    updateData(entry) {
    }

    delete(record) {
    }

    makeNew() {
        let vi = new VersionInfo();
        return vi;
    }


    getItemCount() {
        return this.itemCount;
    }

    setItemCount(itemCount) {
        this.itemCount = itemCount;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getFileVersion() {
        return this.fileVersion;
    }

    setFileVersion(fileVersion) {
        this.fileVersion = fileVersion;
    }

    getTargettedRelease() {
        return this.targettedRelease;
    }

    setTargettedRelease(targettedRelease) {
        this.targettedRelease = targettedRelease;
    }

    getLoadedBy() {
        return this.loadedBy;
    }

    setLoadedBy(loadedBy) {
        this.loadedBy = loadedBy;
    }

    getLoadDate() {
        return this.loadDate;
    }

    setLoadDate(loadDate) {
        if (loadDate.includes("/")) {
            // convert date to long
            let _dt = Date.parse(loadDate);
            this.loadDate = _dt;
            return;
        }

        this.loadDate = loadDate;
    }

    asMap() {
        let props = new Map();
        props.put("id", this.getId());
        props.put("fileVersion", this.getFileVersion());
        props.put("targettedRelease", this.getTargettedRelease());
        props.put("loadedBy", this.getLoadedBy());
        props.put("loadDate", String.valueOf(this.getLoadDate()));

        return props;
    }

    toString() {
        this.asJSON();
    }

    asJSON() {
        return JSON.stringify(this);
    }

    replacer(key, value) {
        return value;
    }

    toJsonWithoutID() {
        return JSON.stringify(this, this.replacer);
    }

    static fromJSON(json) {
        try {
            let vi = new VersionInfo();

            vi = JSON.parse(json);

            return vi;
        } catch (error) {
            console.error("VersionInfo.fromJSON: Error: " + error);
        }
    }

    static fromJSONWithID(json, idStartAt) {
        try {
            let vi = new VersionInfo(json);

            return vi;
        } catch (error) {
            console.error("VersionInfo.fromJSON: Error: " + error);
        }
    }

    /**
     * Equality check based on required/primary key
     *
     * @param {TypeCategoryType} item
     */
    equals(item) {
        let result = false;

        if (this.id === item.id) {
            result = true;
        }

        return result;
    }

    /**
     * Equality check based on all attributes
     *
     * @param {TypeCategoryType} item
     */
    deepEqual(item) {
        let result = false;

        if (this.id === item.id &&
            this.fileVersion === item.fileVersion &&
            this.targettedRelease === item.targettedRelease &&
            this.loadDate === item.loadDate &&
            this.itemCount === item.itemCount &&
            this.loadedBy === item.loadedBy) {
            result = true;
        };

        return result;
    }
}

