import React from "react";

export default class Util {
  static makeDescription(word) {
    let desc = "";
    for (var i = 0; i < word.length; i++) {
      let c = word[i];
      let pc = "";
      let nc = "";

      if (i - 1 > 0) {
        pc = word[i - 1];
      }

      if (i + 1 < word.length) {
        nc = word[i + 1];
      }

      if (
        c === c.toUpperCase() &&
        (pc !== pc.toUpperCase() || nc !== nc.toUpperCase())
      ) {
        desc += " " + c;
      } else {
        desc += c;
      }
    }

    return desc;
  }

  static firstCharacterLowerCase(value) {
    console.log(value);
    return value.charAt(0).toLowerCase() + value.slice(1);
  }

  static firstCharacterUpperCase(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  static isArrayNullOrEmpty(array) {
    if (this.isNullOrEmpty(array) || array.length === 0) {
      return true;
    }

    return false;
  }

  static isNullOrEmpty(obj) {
    if (obj === null || obj === undefined) {
      return true;
    }

    return false;
  }

  static uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (
        c ^
        (((crypto.getRandomValues(new Uint8Array(1))[0] & 15) >> c) / 4)
      ).toString(16)
    );
  }

  static generateKey(string) {
    // This was intended to generate a randon (and somewhat unique)
    // key to be used for ui components.
    // The uniqueness of the key caused Input fields to loose focus
    // right after they were selected and therefore I was unable to
    // write any text in these fields.
    return string;
  }

  static getErrorMessage(error) {
    let modalTitle = "";
    let modalMessage = "";

    if (typeof error === "object") {
      modalTitle = `[${error.status}] - ${error.error} ...`;
      modalMessage = `Encountered [${error.message}] while calling [${
        error.path
      }]`;
    } else if (typeof error === "string") {
      modalTitle = `An error ocurred ...`;
      modalMessage = `Encountered [${error}]`;
    }

    return { modalTitle, modalMessage };
  }
}

export const CloseButton = (item, onClick) => {
  return (
    <div className="card-header-actions">
      <button
        className="card-header-action btn btn-new"
        onClick={event => onClick(event, item)}
      >
        X
      </button>
    </div>
  );
};
