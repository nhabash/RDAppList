export default class TypeCategoryTypeTag {
  constructor(obj) {
    if (obj) {
      Object.assign(this, obj);
    } else {
      this.id = 1;
      this.tagName = "";
      this.tagValue = "";
    }
  }

  getName() {
    return "TypeCategoryTypeTag";
  }

  checkRequired() {
    return true;
  } // Does not have required fields

  isNull(field) {
    return field === null || field === undefined;
  }

  isNewOrEmpty() {
    if (this.isNull(this.tagName) || this.isNull(this.tagValue)) {
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
      case "tagName":
        value = this.tagName;
        break;
      case "tagValue":
        value = this.tagValue;
        break;
      case "id":
        value = this.id;
        break;
      default:
        break;
    }

    return value;
  }

  makeNew() {
    return new TypeCategoryTypeTag();
  }

  updateValues(entry) {
    switch (entry.attributeName) {
      case "tagName":
        this.setTagName(entry.attributeValue);
        break;
      case "tagValue":
        this.setTagValue(entry.attributeValue);
        break;
      default:
        break;
    }
  }

  getID() {
    return this.id;
  }

  setID(id) {
    this.id = id;
  }

  getTagName() {
    return this.tagName;
  }

  setTagName(value) {
    this.tagName = value;
  }

  getTagValue() {
    return this.tagValue;
  }

  setTagValue(value) {
    this.tagValue = value;
  }

  toString() {
    return this.toJson();
  }

  asJson() {
    return JSON.stringify(this);
  }

  replacer(key, value) {
    if (key === "id") return undefined;
    else return value;
  }

  toJsonWithoutID() {
    return JSON.stringify(this, this.replacer);
  }

  equal(atag) {
    let result = false;

    if (
      this.getTagName() !== atag.getTagName() &&
      this.getTagValue() !== atag.getTagValue()
    ) {
      result = false;
    } else {
      result = true;
    }

    return result;
  }

  static fromJSON(json) {
    try {
      let tc = new TypeCategoryTypeTag();

      tc = JSON.parse(json);

      return tc;
    } catch (error) {
      console.error("Tag.fromJSON: Error: " + error);
    }
  }

  static fromJSONWithID(json, idStartAt) {
    try {
      let tc = new TypeCategoryTypeTag(json);

      tc.id = idStartAt + 1;

      return tc;
    } catch (error) {
      console.error("Tag.fromJSONWithID: Error: " + error);
    }
  }
}
