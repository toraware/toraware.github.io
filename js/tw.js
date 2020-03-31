function validateLimits() {
  var dbStart = document.getElementById("dbStart");
  var dbEnd = document.getElementById("dbEnd");
  if (dbEnd.value < dbStart.value) {
    alert(
      "\n\nERROR:\n\nYour START and END values make no sense.\n(You specified: From '" +
        ppNames[dbStart.value - 1][1] +
        "' to '" +
        ppNames[dbEnd.value - 1][1] +
        "').\n\nThe RANGE limits are therefore being reset to default values."
    );
    dbStart.value = 1;
    dbEnd.value = 88;
    return false;
  }
  var listSize = document.getElementById("hitLimit");
  var numericExpression = /^[0-9]+$/;
  if (!numericExpression.test(listSize.value) || listSize.value < 1) {
    alert(
      "'Hits limit' ERROR.\n(Numbers only > 0.)\n\nThe default limit will be RESET to 35.\n\n"
    );
    listSize.value = "35";
    return false;
  }

  if (navigator.cookieEnabled) {
    sessionStorage.setItem("first", dbStart.value);
    sessionStorage.setItem("second", dbEnd.value);
    sessionStorage.setItem("third", listSize.value);
    //   sessionStorage.setItem("fourth", dbX.value);
  }
  return true;
}

function validateTxt() {
  var tORf = true;
  glUserIP = glUserIP.trim();
  var dataArray = glUserIP.replace(/\s/g, ""); //temp remove spaces
  if (dataArray.length < 1) {
    alert("Error encountered. Nothing entered.");
    tORf = false;
  } else {
    var HebrewChars = new RegExp("^[\u0590-\u05FF]+$");
    if (!HebrewChars.test(dataArray)) {
      alert(
        "Error encountered.\nYou entered: " +
          glUserIP +
          "\n\nEnter Hebrew text only!"
      );
      tORf = false;
    }
  }
  if (tORf == true) {
    switch (anchorHit) {
      case "ww":
        glUserIP = glUserIP.replace(/\s/g, ""); //remove spaces
        document.getElementById("keyTextfield").value = glUserIP;
        break;
      case "ph":
        if (glUserIP.indexOf(" ") < 1) {
          alert("\n\nSorry;\nLess than two words detected!");
          tORf = false;
        }
        break;
    }
  }
  if (tORf == false) {
    document.getElementById("keyTextfield").value = "";
    document.getElementById("keyTextfield").focus();
    return false;
  }
  return true;
}
function matchStrings(pWrd, uWrd, glued, StartEnd) {
  var regex = /[ךםןףץ]/;
  var hPwrd = pWrd;
  var n = hPwrd.search(regex);
  if (n > -1) {
    hPwrd = hPwrd.replace(/ך/, "כ");
    hPwrd = hPwrd.replace(/ם/, "מ");
    hPwrd = hPwrd.replace(/ן/, "נ");
    hPwrd = hPwrd.replace(/ף/, "פ");
    hPwrd = hPwrd.replace(/ץ/, "צ");
  }
  var hUwrd = uWrd;
  n = hUwrd.search(regex);
  if (n > -1) {
    hUwrd = hUwrd.replace(/ך/, "כ");
    hUwrd = hUwrd.replace(/ם/, "מ");
    hUwrd = hUwrd.replace(/ן/, "נ");
    hUwrd = hUwrd.replace(/ף/, "פ");
    hUwrd = hUwrd.replace(/ץ/, "צ");
  }
  var isMatch = false;
  if (glued === false) {
    if (sameUnglued(hPwrd, hUwrd)) {
      isMatch = true;
    } else {
      isMatch = false;
    }
  } else {
    if (sameGlued(hPwrd, hUwrd)) {
      isMatch = true;
    } else {
      isMatch = false;
    }
    if (StartEnd === 1) {
      if (!prefixSame(hPwrd, hUwrd)) isMatch = false;
    }
    if (StartEnd === -1) {
      if (!suffixSame(hPwrd, hUwrd)) isMatch = false;
    }
  }
  return isMatch;
}

function sameUnglued(hPwrd, hUwrd) {
  var pos;
  var clipP = hPwrd;
  var x;
  var u = hUwrd.split("");
  for (x = 0; x < u.length; x++) {
    pos = clipP.indexOf(u[x]);
    if (pos < 0) return false;
    clipP = clipP.substring(pos + 1);
  }
  return true;
}

function sameGlued(hPwrd, hUwrd) {
  var isTrue = false;
  var x;
  var loopCount = hPwrd.length - hUwrd.length + 1;
  for (x = 0; x < loopCount; x++) {
    if (hUwrd === hPwrd.substr(x, hUwrd.length)) isTrue = true;
  }
  return isTrue;
}

function prefixSame(hPwrd, hUwrd) {
  var isTrue = false;
  var pSeg = hPwrd.substr(0, hUwrd.length);
  if (pSeg === hUwrd) isTrue = true;
  return isTrue;
}

function suffixSame(hPwrd, hUwrd) {
  var isTrue = false;
  var pSeg = hPwrd.substr(hPwrd.length - hUwrd.length);
  if (pSeg === hUwrd) isTrue = true;
  return isTrue;
}

function removeChildrenFromNode(node) {
  if (node.hasChildNodes()) {
    while (node.childNodes.length >= 1) {
      node.removeChild(node.firstChild);
    }
  }
}

function setTitle() {
  var resultHdr = "";
  switch (anchorHit) {
    case "ph":
      resultHdr = resultHdr + "FIND PHRASE";
      if (upperHit === 1) {
        resultHdr = resultHdr + "; CONTAINS my letters; ";
      } else {
        resultHdr = resultHdr + "; ONLY my letters; ";
      }
      if (lowerHit === 1) {
        resultHdr = resultHdr + "ADJACENT words";
      } else {
        resultHdr = resultHdr + "NOT necessarily adjacent";
      }
      break;
    case "ww":
      resultHdr = resultHdr + "FIND WORD; ";
      if (lowerHit === 1) {
        resultHdr = resultHdr + "CONTAINS my letters";
      } else if (lowerHit === 2) {
        resultHdr = resultHdr + "ONLY my letters";
      } else if (lowerHit === 3) {
        resultHdr = resultHdr + "My letters BOUND";
      } else if (lowerHit === 4) {
        resultHdr = resultHdr + "STARTS with my letters";
      } else {
        resultHdr = resultHdr + "ENDS with my letters";
      }
      break;
  }
  return resultHdr;
}

function executeCode() {
  var parshaStart = Number(document.getElementById("dbStart").value);
  var parshaEnd = Number(document.getElementById("dbEnd").value);
  var opDiv = document.getElementById("optionsDiv");
  var kbdivDiv = document.getElementById("kbDiv");
  removeChildrenFromNode(opDiv);
  removeChildrenFromNode(kbdivDiv);
  var resultTitle = setTitle();
  resultTitle =
    resultTitle +
    "\nRange: <" +
    ppNames[parshaStart - 1][1] +
    " - " +
    ppNames[parshaEnd - 1][1] +
    ">";
  resultTitle = resultTitle + "; User entry (" + glUserIP + ")";
  var listSize = document.getElementById("hitLimit").value;
  resultTitle = resultTitle + "\nList size: " + listSize;
  var rTable = document.createElement("div");
  rTable.setAttribute("id", "rTable");
  var rTableHead = document.createElement("h4");
  rTableHead.setAttribute("id", "rTableHead");
  rTable.appendChild(rTableHead);
  var resultPre = document.createElement("pre"); // PRE tag keeps 2 lines with \n intact
  var dualHeader = document.createTextNode(resultTitle);
  resultPre.appendChild(dualHeader);
  rTableHead.appendChild(resultPre);
  opDiv.appendChild(rTable);
  document.getElementById("GoButton").style.display = "none"; //req'd
  var a, b, c, cc, x, y, words, sentence, isMatch, uWords;
  var newrow;
  var hitCount = 0;
  var ppName;
  var toraLen = tora.length;
  for (y = 0; y < toraLen; y += 1) {
    // y is start's rec number, [0] is its 1st element
    if (tora[y][0] === parshaStart) {
      break;
    }
  }
  var hldWrds;
  switch (anchorHit) {
    case "ph":
      hldWrds = [];
      c = 0; //  INCLUDING/ONLY SWITCH.   re:upperHit  Switch OFF ===> INCLUDING
      uWords = glUserIP.trim().split(" ");
      for (x = y; tora[x][0] <= parshaEnd; x += 1) {
        words = tora[x][3].split(" ");
        if (uWords.length > words.length) continue; //Possuk has too few words
        for (a = 0; a < uWords.length; a += 1) {
          hldWrds = []; // [word,b-index]
          for (b = 0; b < words.length; b += 1) {
            // and uWords.length
            if (upperHit !== 1) c = 1;
            if (c === 1 && words[b].length !== uWords[a].length) continue; //bypass below if he wants EXACT
            if (matchStrings(words[b], uWords[a], false, 0)) {
              if (
                lowerHit === 1 &&
                hldWrds.length > 0 &&
                b - hldWrds[hldWrds.length - 1][1] !== 1
              ) {
                b = hldWrds[hldWrds.length - 1][1]; // start pass thru from after last word entered
                a = 0;
                hldWrds = [];
                continue;
              }
              hldWrds.push([words[b], b]);
              if (hldWrds.length === uWords.length) {
                hitCount = hitCount + 1;
                ppName =
                  ppNames[tora[x][0] - 1][1] +
                  " (" +
                  tora[x][1] +
                  ":" +
                  tora[x][2] +
                  ")";
                sentence = [];
                for (cc = 0; cc < hldWrds.length; cc += 1) {
                  sentence.push(hldWrds[cc][0]);
                }
                newrow = makeEle({
                  tag: "span",
                  id: "tdWhere",
                  dom: [document.createTextNode(hitCount + ") " + ppName)]
                });
                rTable.appendChild(newrow);
                newrow = makeEle({
                  tag: "span",
                  id: "tdRed",
                  attr: { style: "color: red;" },
                  dom: [document.createTextNode(sentence.join(" "))]
                });
                rTable.appendChild(newrow);
                newrow = makeEle({
                  tag: "span",
                  id: "tdResult",
                  dom: [document.createTextNode(tora[x][3])]
                });
                rTable.appendChild(newrow);
                opDiv.appendChild(rTable);
                if (hitCount >= listSize) {
                  newrow = makeEle({
                    tag: "h4",
                    id: "tdWhere",
                    dom: [
                      document.createTextNode(
                        "- Limit set at: " + listSize + " -"
                      )
                    ]
                  });
                  rTable.appendChild(newrow);
                  opDiv.appendChild(rTable);
                  return;
                }
                if (words.length - (hldWrds[0][1] + 1) < uWords.length) break; // too few words left in possuk
                b = hldWrds[0][1];
                a = 0;
                hldWrds = [];
              } else {
                a += 1;
              }
            }
          } // b
          break; // no point continuing
        } // a
      } // x
      break;
    case "ww":
      for (x = y; tora[x][0] <= parshaEnd; x += 1) {
        words = tora[x][3].split(" ");
        for (a = 0; a < words.length; a += 1) {
          isMatch = false;
          if (lowerHit === 1) {
            if (matchStrings(words[a], glUserIP, false, 0)) isMatch = true;
          } else if (lowerHit === 2) {
            if (words[a].length === glUserIP.length) {
              if (matchStrings(words[a], glUserIP, false, 0)) isMatch = true;
            }
          } else if (lowerHit === 3) {
            if (matchStrings(words[a], glUserIP, true, 0)) isMatch = true;
          } else if (lowerHit === 4) {
            if (matchStrings(words[a], glUserIP, true, 1)) isMatch = true;
          } else {
            if (matchStrings(words[a], glUserIP, true, -1)) isMatch = true;
          }
          if (isMatch) {
            hitCount = hitCount + 1;
            ppName =
              ppNames[tora[x][0] - 1][1] +
              " (" +
              tora[x][1] +
              ":" +
              tora[x][2] +
              ")"; //1st parm of tora starts with 1, not 0
            newrow = makeEle({
              tag: "span",
              id: "tdWhere",
              dom: [document.createTextNode(hitCount + ") " + ppName)]
            });
            rTable.appendChild(newrow);
            newrow = makeEle({
              tag: "span",
              id: "tdRed",
              dom: [document.createTextNode(words[a])]
            });
            rTable.appendChild(newrow);
            newrow = makeEle({
              tag: "span",
              id: "tdResult",
              dom: [document.createTextNode(tora[x][3])]
            });
            rTable.appendChild(newrow);
            opDiv.appendChild(rTable);
            if (hitCount >= listSize) {
              newrow = makeEle({
                tag: "h4",
                id: "tdWhere",
                dom: [
                  document.createTextNode("- Limit set at: " + listSize + " -")
                ]
              });
              rTable.appendChild(newrow);
              opDiv.appendChild(rTable);
              return;
            }
          }
        }
      }
      break;
  } // switch
  if (hitCount === 0) {
    newrow = makeEle({
      tag: "p",
      dom: [
        makeEle({
          tag: "span",
          id: "tdWhere",
          dom: [document.createTextNode(" No Finds !")]
        })
      ]
    });
    rTable.appendChild(newrow);
    opDiv.appendChild(rTable);
  }
}

function radioButtons() {
  var optionsDiv = document.getElementById("optionsDiv");
  var radios = optionsDiv.getElementsByTagName("input");
  var rcount = radios.length;
  var uppersCount = 0;
  var middlesCount = 0;
  var lowersCount = 0;
  for (var i = 0; i < rcount; i++) {
    // Scan radiobuttons
    if (radios[i].name.indexOf("Upper") !== -1) {
      uppersCount = uppersCount + 1;
      if (radios[i].checked === true) {
        upperHit = uppersCount;
      }
    }
    if (radios[i].name.indexOf("Middle") !== -1) {
      middlesCount = middlesCount + 1;
      if (radios[i].checked === true) {
        middleHit = middlesCount;
      }
    }
    if (radios[i].name.indexOf("Lower") !== -1) {
      lowersCount = lowersCount + 1;
      if (radios[i].checked === true) {
        lowerHit = lowersCount;
      }
    }
  }
}

function go() {
  glUserIP = document.getElementById("keyTextfield").value;
  glUserIP = glUserIP.trim();
  glUserIP = glUserIP.replace(/  +/g, " "); //rep many spaces with one space
  if (validateTxt()) {
    glTitleTxt = glUserIP;
    radioButtons();
    executeCode();
    document.getElementById("GoButton").style.display = "none";
    document.getElementById("BackButton").style.display = "inline";
  }
}

function makeEle(p) {
  var i, e;
  e = document.createElement(p.tag);
  if (p.id) e.id = p.id;
  if (p.className) e.className = p.className;
  var a = p.attr || {};
  for (i in a) {
    e.setAttribute(i, a[i]);
  }
  var s = p.style || {};
  for (i in s) {
    e.style[i] = s[i];
  }
  var h = p.handler || {};
  for (i in h) {
    e[i] = h[i];
  }
  var d = p.dom || [];
  for (i = 0; i < d.length; i++) {
    e.appendChild(d[i]);
  }
  return e;
}

function displayOptions(choice) {
  if (!validateLimits()) {
    return;
  }
  anchorHit = choice;
  document.getElementById("parms").style.display = "none";
  document.getElementById("methods").style.display = "none";
  document.getElementById("BackButton").style.display = "inline";
  document.getElementById("GoButton").style.display = "inline";
  var optionDiv = document.getElementById("optionsDiv");
  var kbDiv = document.getElementById("kbDiv");
  switch (choice) {
    case "ww":
      optionDiv.appendChild(fldsetWW);
      break;
    case "ph":
      optionDiv.appendChild(fldsetPH);
  }
  kbDiv.appendChild(KBinput);
  document.getElementById("keyTextfield").focus();
}

var anchorHit = "";
var upperHit = 0;
var middleHit = 0;
var lowerHit = 0;
var glUserIP;
var glTitleTxt;
var fldsetWW = makeEle({
  tag: "div",
  attr: { id: "phRadios" },
  dom: [
    makeEle({
      tag: "fieldset",
      attr: { id: "fsOuter" },
      dom: [
        makeEle({
          tag: "legend",
          dom: [document.createTextNode("Find a word - Options")]
        }),

        makeEle({
          tag: "input",
          attr: { type: "radio", id: "w1", name: "wwLowerName", checked: true }
        }),
        makeEle({
          tag: "label",
          attr: { for: "w1", class: "lefty" },
          dom: [document.createTextNode("CONTAINS my letters")]
        }),
        makeEle({
          tag: "label",
          attr: { for: "w1", class: "righty" },
          dom: [document.createTextNode("כולל אותיותי")]
        }),

        makeEle({
          tag: "input",
          attr: { type: "radio", id: "w2", name: "wwLowerName" }
        }),
        makeEle({
          tag: "label",
          attr: { for: "w2", class: "lefty" },
          dom: [document.createTextNode("has ONLY my letters")]
        }),
        makeEle({
          tag: "label",
          attr: { for: "w2", class: "righty" },
          dom: [document.createTextNode("רק אותיותי")]
        }),

        makeEle({
          tag: "input",
          attr: { type: "radio", id: "w3", name: "wwLowerName" }
        }),
        makeEle({
          tag: "label",
          attr: { for: "w3", class: "lefty" },
          dom: [document.createTextNode("my letters BOUND")]
        }),
        makeEle({
          tag: "label",
          attr: { for: "w3", class: "righty" },
          dom: [document.createTextNode("כולל אותיותי בצמד")]
        }),

        makeEle({
          tag: "input",
          attr: { type: "radio", id: "w4", name: "wwLowerName" }
        }),
        makeEle({
          tag: "label",
          attr: { for: "w4", class: "lefty" },
          dom: [document.createTextNode("STARTS with my letters")]
        }),
        makeEle({
          tag: "label",
          attr: { for: "w4", class: "righty" },
          dom: [document.createTextNode("אותיותי המתחילות")]
        }),

        makeEle({
          tag: "input",
          attr: { type: "radio", id: "w5", name: "wwLowerName" }
        }),
        makeEle({
          tag: "label",
          attr: { for: "w5", class: "lefty" },
          dom: [document.createTextNode("ENDS with my letters")]
        }),
        makeEle({
          tag: "label",
          attr: { for: "w5", class: "righty" },
          dom: [document.createTextNode("אותיותי הסופיות")]
        })
      ]
    }),
    makeEle({
      tag: "div",
      attr: { id: "instruct" },
      dom: [
        makeEle({
          tag: "label",
          attr: { class: "lefty" },
          dom: [document.createTextNode("Enter a string of letters ")]
        }),
        makeEle({
          tag: "label",
          attr: { class: "righty" },
          dom: [document.createTextNode("הכנס אותיות לפי סדר")]
        })
      ]
    })
  ]
});
var fldsetPH = makeEle({
  tag: "div",
  attr: { id: "phRadios" },
  dom: [
    makeEle({
      tag: "fieldset",
      attr: { id: "fsOuter" },
      dom: [
        makeEle({
          tag: "legend",
          dom: [document.createTextNode("Find a PHRASE - Options")]
        }),
        makeEle({
          tag: "fieldset",
          attr: { id: "fsInner" },
          dom: [
            makeEle({
              tag: "input",
              attr: {
                type: "radio",
                id: "w6",
                name: "phUpperName",
                checked: true
              }
            }),
            makeEle({
              tag: "label",
              attr: { for: "w6", class: "lefty" },
              dom: [document.createTextNode("words CONTAIN my letters")]
            }),
            makeEle({
              tag: "label",
              attr: { for: "w6", class: "righty" },
              dom: [document.createTextNode("אותיותי נכללות")]
            }),

            makeEle({
              tag: "input",
              attr: { type: "radio", id: "w7", name: "phUpperName" }
            }),
            makeEle({
              tag: "label",
              attr: { for: "w7", class: "lefty" },
              dom: [document.createTextNode("words of ONLY my letters")]
            }),
            makeEle({
              tag: "label",
              attr: { for: "w7", class: "righty" },
              dom: [document.createTextNode("רק האותיות שלי")]
            })
          ]
        }),
        makeEle({
          tag: "fieldset",
          attr: { id: "fsInner" },
          dom: [
            makeEle({
              tag: "input",
              attr: { type: "radio", id: "w8", name: "phLowerName" }
            }),
            makeEle({
              tag: "label",
              attr: { for: "w8", class: "lefty" },
              dom: [document.createTextNode("ADJACENT words")]
            }),
            makeEle({
              tag: "label",
              attr: { for: "w8", class: "righty" },
              dom: [document.createTextNode("מילים ברצף")]
            }),

            makeEle({
              tag: "input",
              attr: {
                type: "radio",
                id: "w9",
                name: "phLowerName",
                checked: true
              }
            }),
            makeEle({
              tag: "label",
              attr: { for: "w9", class: "lefty" },
              dom: [document.createTextNode("NOT necessarily adjacent")]
            }),
            makeEle({
              tag: "label",
              attr: { for: "w9", class: "righty" },
              dom: [document.createTextNode("לאוו דווקה ברצף")]
            })
          ]
        })
      ]
    }),
    makeEle({
      tag: "div",
      attr: { id: "instruct" },
      dom: [
        makeEle({
          tag: "label",
          attr: { class: "lefty" },
          dom: [document.createTextNode("Put a space between words")]
        }),
        makeEle({
          tag: "label",
          attr: { class: "righty" },
          dom: [document.createTextNode("שים רווח בין מיתרי אותיות")]
        })
      ]
    })
  ]
});
var KBinput = makeEle({
  tag: "input",
  id: "keyTextfield",
  attr: { type: "text", size: "35", maxlength: "235" }
});

var ppNames = [
  // global
  [1, "Braishit"],
  [2, "Noah"],
  [3, "Lech Lecha"],
  [4, "Vayera"],
  [5, "Chayei Sara"],
  [6, "Toldos"],
  [7, "Vayetzei"],
  [8, "Vayishlach"],
  [9, "Vayeshev"],
  [10, "Miketz"],
  [11, "Vayigash"],
  [12, "Vaychi"],
  [13, "Shmot"],
  [14, "Vaaiyra"],
  [15, "Bo"],
  [16, "Beshalach"],
  [17, "Yitro"],
  [18, "Mishpatim"],
  [19, "Truma"],
  [20, "Tetzaveh"],
  [21, "KiTisa"],
  [22, "Vayakhel"],
  [23, "Pikudei"],
  [24, "Vayikra"],
  [25, "Tzav"],
  [26, "Shmini"],
  [27, "Tazria"],
  [28, "Metzora"],
  [29, "Achrei Mot"],
  [30, "Kedoshim"],
  [31, "Emor"],
  [32, "Behar"],
  [33, "Bechukosai"],
  [34, "Bamidbar"],
  [35, "Naso"],
  [36, "Behaalotcha"],
  [37, "Shlach"],
  [38, "Korach"],
  [39, "Chukat"],
  [40, "Balak"],
  [41, "Pinchas"],
  [42, "Matot"],
  [43, "Masei"],
  [44, "Devarim"],
  [45, "Veetchanan"],
  [46, "Eikev"],
  [47, "Reay"],
  [48, "Shoftim"],
  [49, "Ki Taitzai"],
  [50, "Ki Tavo"],
  [51, "Netzavim"],
  [52, "Vayelech"],
  [53, "Haazinu"],
  [54, "Vezot Habracha"],
  [55, "Yehoshua"],
  [56, "Sefer Shoftim"],
  [57, "Shmuel A"],
  [58, "Shmuel B"],
  [59, "Melachim A"],
  [60, "Melachim B"],
  [61, "Tehilim"],
  [62, "Yeshayahu"],
  [63, "Yirmiyahu"],
  [64, "Yechezkel"],
  [65, "Hoshea"],
  [66, "Yoel"],
  [67, "Amos"],
  [68, "Ovadia"],
  [69, "Shir Hashirim"],
  [70, "Esther"],
  [71, "Yonah"],
  [72, "Michah"],
  [73, "Nachum"],
  [74, "Havakuk"],
  [75, "Zefania"],
  [76, "Hagai"],
  [77, "Zecharia"],
  [78, "Malachi"],
  [79, "Koheles"],
  [80, "Eichah"],
  [81, "Mishlei"],
  [82, "Ruth"],
  [83, "Iyov"],
  [84, "Daniel"],
  [85, "Ezra"],
  [86, "Nehemia"],
  [87, "Divrei Hayomim A"],
  [88, "Divrei Hayomim B"]
];

window.onload = function() {
  var dbStart = document.getElementById("dbStart");
  var dbEnd = document.getElementById("dbEnd");
  var listLimit = document.getElementById("hitLimit");
  if (navigator.cookieEnabled) {
    if (sessionStorage.getItem("first") !== null) {
      dbStart.value = sessionStorage.getItem("first");
      dbEnd.value = sessionStorage.getItem("second");
      listLimit.value = sessionStorage.getItem("third");
    }
  }
  var bGo = document.createElement("button");
  bGo.innerHTML = "Go";
  bGo.id = "GoButton";
  document.getElementById("buttons").appendChild(bGo);
  bGo.style.display = "none";
  bGo.addEventListener("click", goRoutine);
  var bBack = document.createElement("button");
  bBack.innerHTML = "Back";
  bBack.id = "BackButton";
  document.getElementById("buttons").appendChild(bBack);
  bBack.style.display = "none";
  document.onkeypress = enterPressed; // inactivate Enter key
  bBack.addEventListener("click", backRoutine);
};
function backRoutine() {
  var goButton = document.getElementById("GoButton");
  if (goButton.style.display === "inline") {
    var opDiv = document.getElementById("optionsDiv");
    var kbdivDiv = document.getElementById("kbDiv");
    removeChildrenFromNode(opDiv);
    removeChildrenFromNode(kbdivDiv);
    window.location.reload();
  } else {
    var resultsDiv = document.getElementById("optionsDiv");
    removeChildrenFromNode(resultsDiv);
    displayOptions(anchorHit);
  }
}
function goRoutine() {
  go();
}

function enterPressed(e) {
  if (window.event && window.event.keyCode === 13) {
    return false;
  } else {
    if (e && e.keyCode === 13) {
      return false;
    }
  }
}
