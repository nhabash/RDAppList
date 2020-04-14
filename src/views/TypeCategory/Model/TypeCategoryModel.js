export default class TypeCategoryModel {
    constructor(obj) {
        if (obj) {
            Object.assign(this, obj);
        } else {
            this.id = 1;
            this.mlUri = "";
            this.typeCategoryName = "";
            this.typeCategoryIdentifierText = "";
            this.modelName = "";
            this.entities = [];
            /*
            this.entities = [
                {
                    entityName: "",
                    attributes: [
                        {
                            attributeName: ""
                        }
                    ]
                }
            ];
            */
        }
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getMlUri() {
        return this.mlUri;
    }

    setMlUri(mlUri) {
        if (mlUri === null || mlUri === undefined) {
            if (this.typeCategoryIdentifierText === null || this.typeCategoryIdentifierText === undefined) {
                return;
            }

            this.mlUri = "/TypeCategoryMapping/" + this.typeCategoryIdentifierText + ".json";
        } else {
            this.mlUri = mlUri;
        }
    }

    getTypeCategoryName() {
        return this.typeCategoryName;
    }

    setTypeCategoryName(typeCategoryName) {
        this.typeCategoryName = typeCategoryName;
    }

    getTypeCategoryIdentifierText() {
        return this.typeCategoryIdentifierText;
    }

    setTypeCategoryIdentifierText(typeCategoryIdentifierText) {
        this.typeCategoryIdentifierText = typeCategoryIdentifierText;
        this.setMlUri(null);
    }

    getModelName() {
        return this.modelName;
    }

    setModelName(modelName) {
        this.modelName = modelName;
    }

    getEntityName() {
        return this.entityName;
    }

    setEntityName(entityName) {
        this.entityName = entityName;
    }

    getAttributeName() {
        return this.attributeName;
    }

    setAttributeName(attributeName) {
        this.attributeName = attributeName;
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
        return JSON.stringify(this, TypeCategoryModel.replacer);
    }

    isEqual(item) {
        let result = false;

        if (this.typeCategoryName === item.typeCategoryName &&
          this.typeCategoryIdentifierText === item.typeCategoryIdentifierText &&
          this.modelName === item.modelName &&
          this.entityName === item.entityName &&
          this.attributeName === item.attributeName) {
          result = true;
        };

        return result;
      }

      static fromJSON(json, idStartAt) {
        try {
          let tc = new TypeCategoryModel(json);

          if (idStartAt !== null && idStartAt !== undefined) {
            tc.setID(idStartAt + 1);
          }

          return tc;
        } catch (error) {
          console.error("TypeCategoryModel.fromJSON: Error: " + error);
        }
      }

      static fromJSONWithID(json, idStartAt) {
        try {
            //let tc = new TypeCategory(JSON.parse(json));
            let tc = new TypeCategoryModel(json);

            tc.setId(idStartAt + 1);

            return tc;
        } catch (error) {
            console.error("TypeCategory.fromJSON: Error: " + error);
        }
    }

}
