document.addEventListener("DOMContentLoaded", function () {
  var keyboard = document.querySelector(".keyboard");
  var output = document.getElementById("typedOutput");
  var shiftEnabled = false;

  if (!keyboard || !output) {
    return;
  }

  keyboard.addEventListener("click", function (event) {
    var keyButton = event.target.closest("button");

    if (!keyButton || !keyboard.contains(keyButton)) {
      return;
    }

    var key = resolveKeyValue(keyButton, shiftEnabled);

    if (!key) {
      return;
    }

    if (key === "SHIFT") {
      shiftEnabled = !shiftEnabled;
      return;
    }

    if (key === "BACKSPACE") {
      output.value = output.value.slice(0, -1);
      if (shiftEnabled) {
        shiftEnabled = false;
      }
      return;
    }

    if (key === "SPACE") {
      output.value += " ";
      if (shiftEnabled) {
        shiftEnabled = false;
      }
      return;
    }

    if (key === "TAB") {
      output.value += "\t";
      if (shiftEnabled) {
        shiftEnabled = false;
      }
      return;
    }

    if (key === "ENTER") {
      output.value += "\n";
      if (shiftEnabled) {
        shiftEnabled = false;
      }
      return;
    }

    output.value += key;

    if (shiftEnabled) {
      shiftEnabled = false;
    }
  });
});

function resolveKeyValue(button, shiftEnabled) {
  var label = normalize(button.textContent);

  if (!label) {
    return "";
  }

  var upperLabel = label.toUpperCase();

  if (upperLabel.indexOf("BKSP") !== -1) {
    return "BACKSPACE";
  }

  if (upperLabel === "TAB") {
    return "TAB";
  }

  if (upperLabel.indexOf("ENTER") !== -1) {
    return "ENTER";
  }

  if (upperLabel === "SHIFT") {
    return "SHIFT";
  }

  if (
    button.id === "last" &&
    label.replace(/\s/g, "") === "______________________________________"
  ) {
    return "SPACE";
  }

  var ignoredKeys = [
    "SHIFT",
    "CAPS",
    "CTRL",
    "ALT",
    "FN",
    "ESC",
    "NUM LOCK",
    "PRT SC",
    "HOME",
    "END",
    "PG UP",
    "PG DN",
    "DELETE",
  ];

  if (ignoredKeys.indexOf(upperLabel) !== -1) {
    return "";
  }

  var dualValue = getDualValue(button);

  if (dualValue) {
    return shiftEnabled ? dualValue.top : dualValue.bottom;
  }

  var decoratedMatch = label.match(/^([0-9./*+\-])\s+(HOME|END|PG UP|PGDN|INS|DEL)$/i);

  if (decoratedMatch) {
    return decoratedMatch[1];
  }

  return label;
}

function normalize(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function getDualValue(button) {
  var sub = button.querySelector("sub, SUB");

  if (!sub) {
    return null;
  }

  var bottom = normalize(sub.textContent);
  var clone = button.cloneNode(true);
  var cloneSubs = clone.querySelectorAll("sub, SUB");

  cloneSubs.forEach(function (node) {
    node.remove();
  });

  var top = normalize(clone.textContent);

  if (!top && !bottom) {
    return null;
  }

  var annotations = ["HOME", "END", "PG UP", "PGDN", "INS", "DEL"];

  if (annotations.indexOf(bottom.toUpperCase()) !== -1) {
    return {
      top: top || bottom,
      bottom: top || bottom,
    };
  }

  return {
    top: top || bottom,
    bottom: bottom || top,
  };
}
