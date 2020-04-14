import TypeCategoryTypeTag from "./TypeCategoryTypeTag";
import Util from "../../Common/Util";

export default class TypeCategoryType {
  constructor(obj) {
    if (obj) {
      Object.assign(this, obj);

      this.tagsArray = [];

      if (obj.tagsArray !== null && obj.tagsArray !== undefined) {
        if (obj.tagsArray.length === 0) {
          this.tagsArray = [new TypeCategoryTypeTag()];
        } else {
          obj.tagsArray.forEach(t => {
            let maxtype = this.tagsArray.length;
            let x = TypeCategoryTypeTag.fromJSONWithID(t, maxtype);
            this.tagsArray.push(x);
          });
        }
      } else {
        this.TagsArray = [new TypeCategoryTypeTag()];
      }
    } else {
      this.id = 1;
      this.rightTypeCode = "";
      this.typeCode = "";
      this.typeName = "";
      this.typeDescription = "";

      this.tagsArray = [new TypeCategoryTypeTag()];
    }
  }

  getName() {
    return "TypeCategoryType";
  }

  checkRequired() {
    return !Util.isNullOrEmpty(this.typeCode);
  }

  isNull(field) {
    return field === null || field === undefined;
  }

  isNewOrEmpty() {
    if (this.isNull(this.typeName)) {
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
      case "rightTypeCode":
        value = this.rightTypeCode;
        break;
      case "typeCode":
        value = this.typeCode;
        break;
      case "typeName":
        value = this.typeName;
        break;
      case "typeDescription":
        value = this.typeDescription;
        break;
      case "tagsArray":
        value = this.tagsArray;
        break;
      default:
        break;
    }

    return value;
  }

  set(element) {
    // expecting either array or string
    if (typeof element === "string") {
      return;
    } else if (typeof element === "object") {
      let l = element.length;
      if (l === -1) return;
      // its an array, so === tagsArray
      if (element[0].getName() === "TypeCategoryTypeTag") {
        this.setTagsArray(element);
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
      case "rightTypeCode":
        this.setRightTypeCode(entry.attributeValue);
        break;
      case "typeCode":
        this.setTypeCode(entry.attributeValue);
        break;
      case "typeName":
        this.setTypeName(entry.attributeValue);
        break;
      case "typeDescription":
        this.setTypeDescription(entry.attributeValue);
        break;
      default:
        break;
    }

    if (this.tagsArray !== null && this.tagsArray !== undefined) {
      this.tagsArray.forEach(t => {
        t.updateValues(entry);
      });
    }
  }

  updateData(entry) {
    if (entry.getName() === "TypeCategoryTypeTag") {
      // do we have it? means update.  If we don't have it, it will be new add
      let found = this.tagsArray.filter(t => {
        return t.tagName === entry.tagName && t.tagValue === entry.tagValue;
      });

      if (!found || found.length === 0) {
        // add new
        this.tagsArray.push(entry);
      } else {
        // do update of found[0]
      }
    }
  }

  delete(record) {
    switch (record.getName()) {
      case "TypeCategoryTypeTag":
        this.removeTag(record);
        break;
      default:
        break;
    }
  }

  makeNew() {
    let tc = new TypeCategoryType();
    tc.setTagsArray([new TypeCategoryTypeTag()]);
    return tc;
  }

  getID() {
    return this.id;
  }

  setID(id) {
    this.id = id;
  }

  getRightTypeCode() {
    return this.rightTypeCode;
  }

  setRightTypeCode(RightTypeCode) {
    this.rightTypeCode = RightTypeCode;
  }

  getTypeName() {
    return this.typeName;
  }

  setTypeName(TypeName) {
    this.typeName = TypeName;
  }

  getTypeDescription() {
    return this.typeDescription;
  }

  setTypeDescription(TypeDescription) {
    this.typeDescription = TypeDescription;
  }

  getTagsArray() {
    return this.tagsArray;
  }

  setTagsArray(tagsArray) {
    this.tagsArray = tagsArray;
  }

  getTypeCode() {
    return this.typeCode;
  }

  setTypeCode(TypeCode) {
    this.typeCode = TypeCode;
  }

  toString() {
    this.asJSON();
  }

  asJSON() {
    return JSON.stringify(this);
  }

  replacer(key, value) {
    if (key === "id") return undefined;
    else return value;
  }

  toJsonWithoutID() {
    return JSON.stringify(this, this.replacer);
  }

  addTag(tagJson) {
    if (typeof tagJson === "object") {
      this.tagsArray.push(tagJson);
      return;
    }

    let maxtag = this.tagsArray ? this.tagsArray.length : 0;

    let tag = TypeCategoryTypeTag.fromJSONWithID(tagJson, maxtag);

    if (tag !== null) {
      this.tagsArray.push(tag);
    }
  }

  removeTag(tag) {
    if (tag !== null) {
      let newTags = this.tagsArray.filter(f => {
        if (!f.equals(tag)) {
          return f;
        }
        return null;
      });
      this.setTagsArray(newTags);
    }
  }

  static fromJSON(json) {
    try {
      let tc = new TypeCategoryType();

      tc = JSON.parse(json);

      return tc;
    } catch (error) {
      console.error("Type.fromJSON: Error: " + error);
    }
  }

  static fromJSONWithID(json, idStartAt) {
    try {
      let tc = new TypeCategoryType(json);

      tc.setID(idStartAt + 1);

      return tc;
    } catch (error) {
      console.error("Type.fromJSON: Error: " + error);
    }
    /*
        try {
          let tc = new TypeCategoryType();

          tc.id = idStartAt + 1;
          tc.RightTypeCode = json.RightTypeCode;
          tc.TypeCode = json.TypeCode;
          tc.TypeName = json.TypeName;
          tc.TypeDescription = json.TypeDescription;

          if (json.TagsArray === null || json.TagsArray === undefined) {
            return tc;
          }

          json.TagsArray.forEach(t => {
            let maxtype = tc.TagsArray.length;

            let tag = TypeCategoryTypeTag.fromJSONWithID(t, maxtype);
            //tc.addTag(tag);
            tc.TagsArray.push(tag);
          });

          return tc;
        } catch (error) {
          console.error("Type.fromJSONWithID: Error: " + error);
        }
        */
  }

  /**
   * Equality check based on required/primary key
   *
   * @param {TypeCategoryType} item
   */
  equals(item) {
    let result = false;

    if (this.typeCode === item.typeCode) {
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

    if (
      this.rightTypeCode === item.rightTypeCode &&
      this.typeCode === item.typeCode &&
      this.typeName === item.typeName &&
      this.typeDescription === item.typeDescription
    ) {
      if (this.tagsArray.length !== item.tagsArray.length) {
        return false;
      }

      this.tagsArray.forEach(t =>
        item.tagsArray.forEach(it => {
          if (t.tagName === it.tagName && t.tagValue === it.tagValue) {
            result = true;
          }
        })
      );
    }

    return result;
  }
}
