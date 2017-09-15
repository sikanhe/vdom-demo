/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony export (immutable) */ __webpack_exports__[\"a\"] = createElement;\n/* harmony export (immutable) */ __webpack_exports__[\"b\"] = render;\n// Represention for a DOM Node\n// {\n//   type: 'div',\n//   props: {\n//     className: \"some-class\",\n//     otherAttribute: \"foo\"\n//   },\n//   children: [...other vdom nodes]\n// }\nfunction createElement(type, props, children) {\n  return {\n    type,\n    props,\n    children\n  };\n}\n\nconst EVENTS = {\n  onClick: \"click\",\n  onKeyDown: \"keydown\",\n  onKeyUp: \"keyup\",\n  onScroll: \"scroll\",\n  onChange: \"change\"\n};\n\nfunction toDomNode(el) {\n  if (typeof el === \"string\") {\n    return document.createTextNode(el);\n  }\n\n  const node = document.createElement(el.type);\n  const { props } = el;\n\n  Object.keys(props).forEach(key => {\n    if (EVENTS[key]) {\n      node.addEventListener(EVENTS[key], props[key]);\n    } else {\n      node.setAttribute(key, props[key]);\n    }\n  });\n\n  el.children.forEach(el => node.appendChild(toDomNode(el)));\n  return node;\n}\n\nfunction hasChanged(e1, e2) {\n  return typeof e1 !== typeof e2 || typeof e1 === \"string\" && e1 !== e2 || e1.type !== e2.type;\n}\n\nfunction updateProps(domNode, { props: oldProps }, { props: newProps }) {\n  const props = Object.assign({}, oldProps, newProps);\n\n  Object.keys(props).forEach(key => {\n    if (!domNode.hasAttribute(key) || oldProps[key] !== newProps[key]) {\n      if (EVENTS[key]) {\n        domNode.removeEventListener(EVENTS[key], oldProps[key]);\n        domNode.addEventListener(EVENTS[key], newProps[key]);\n      } else {\n        domNode.setAttribute(key, newProps[key]);\n      }\n    }\n\n    if (!newProps[key]) {\n      if (EVENTS[key]) {\n        domNode.removeEventListener(EVENTS[key], props[key]);\n      } else {\n        domNode.removeAttribute(key);\n      }\n    }\n  });\n}\n\nfunction elToString(el) {\n  return el.type ? el.type : el;\n}\n\nfunction update(parentDomNode, oldEl, newEl, index = 0) {\n  // Store and return operations for visualization/debugging\n  let operations = [];\n\n  const domNode = parentDomNode.childNodes[index];\n\n  if (!oldEl) {\n    operations.push({ type: \"APPEND\", el: elToString(newEl) });\n    const newNode = toDomNode(newEl);\n    parentDomNode.appendChild(newNode);\n    updateProps(newNode, { props: {} }, newEl);\n    return operations;\n  }\n\n  if (!newEl) {\n    operations.push({ type: \"REMOVE\", el: elToString(oldEl) });\n    parentDomNode.removeChild(domNode);\n    return operations;\n  }\n\n  if (hasChanged(oldEl, newEl)) {\n    operations.push({\n      type: \"REPLACE\",\n      old: elToString(oldEl),\n      new: elToString(newEl)\n    });\n\n    parentDomNode.replaceChild(toDomNode(newEl), domNode);\n\n    return operations;\n  }\n\n  // Recursively update the children if change is not the current node\n  // but deeper down the tree\n  if (typeof newEl !== \"string\") {\n    updateProps(domNode, oldEl, newEl);\n\n    // WARN: need to walk from the back of the list to cater to\n    // the need to remove nodes, or else indexes gets screwed up\n\n    // TODO:\n    // This can be further improved by using a 'Key' attribute so we\n    // can know precisely which elements are acutually removes/added\n    // and it can also increase performance because less operations\n\n    if (oldEl.children[0] && oldEl.children[0].props && oldEl.children[0].props.key) {\n      const map = oldEl.children.reduce((acc, child) => {\n        acc[child.props.key] = child;\n        return acc;\n      }, {});\n\n      oldEl.children.forEach((child, i) => {\n        if (!newEl.children.find(c => c.props.key === child.props.key)) {\n          domNode.removeChild(domNode.childNodes[i]);\n        }\n      });\n\n      newEl.children.forEach(child => {\n        if (!oldEl.children.find(c => c.props.key === child.props.key)) {\n          domNode.appendChild(toDomNode(child));\n        }\n      });\n    } else {\n      for (let i = Math.max(oldEl.children.length, newEl.children.length) - 1; i >= 0; i--) {\n        const ops = update(domNode, oldEl.children[i], newEl.children[i], i);\n        operations = operations.concat(ops);\n      }\n    }\n  }\n\n  return operations;\n}\n\nfunction render(vdom, target) {\n  update(target, null, vdom);\n  let currentVDom = vdom;\n\n  return newVdom => {\n    let ops = update(target, currentVDom, newVdom);\n    currentVDom = newVdom;\n    return ops;\n  };\n}\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/vdom.js\n// module id = 0\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/vdom.js?");

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("Object.defineProperty(__webpack_exports__, \"__esModule\", { value: true });\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vdom__ = __webpack_require__(0);\n\n\nlet lists = {\n  1: {\n    items: [\"item1\", \"item2\", \"item3\"],\n    ops: []\n  },\n  2: {\n    items: [\"item1\", \"item2\", \"item3\"],\n    ops: []\n  }\n};\n\nconst createList = listId => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vdom__[\"a\" /* createElement */])('div', {}, [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vdom__[\"a\" /* createElement */])('ul', {}, lists[listId].items.map((item, i) => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vdom__[\"a\" /* createElement */])('li', {}, [item, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vdom__[\"a\" /* createElement */])('button', { onClick: () => removeItem(listId, i) }, ['x'])]))), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vdom__[\"a\" /* createElement */])('button', { onClick: () => addNewItem(listId) }, ['Add new item'])]);\n\nconst createOpsList = listId => {\n  const tree = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vdom__[\"a\" /* createElement */])('div', {}, [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vdom__[\"a\" /* createElement */])('ul', {}, lists[listId].ops.map((op, i) => op.el ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vdom__[\"a\" /* createElement */])('li', {}, ['Type: ', op.type, ', Element: ', op.el]) : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vdom__[\"a\" /* createElement */])('li', {}, ['Type: ', op.type, ', Old: ', op.old, ', New:', op.new])))]);\n\n  console.log(tree);\n  return tree;\n};\n\nconst update1 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vdom__[\"b\" /* render */])(createList(1), document.getElementById('list1'));\nconst update2 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vdom__[\"b\" /* render */])(createList(2), document.getElementById(\"list2\"));\n\nconst opsUpdate1 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vdom__[\"b\" /* render */])(createOpsList(1), document.getElementById(\"ops1\"));\nconst opsUpdate2 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__vdom__[\"b\" /* render */])(createOpsList(2), document.getElementById(\"ops2\"));\n\nlists[1].update = newVdom => {\n  const ops = update1(newVdom);\n  lists[1].ops = lists[1].ops.concat(ops);\n  opsUpdate1(createOpsList(1));\n\n  console.log(ops);\n};\n\nlists[2].update = newVdom => {\n  const ops = update2(newVdom);\n  lists[2].ops = lists[2].ops.concat(ops);\n  opsUpdate2(createOpsList(2));\n};\n\nconst addNewItem = (listId, i) => {\n  if (false) {\n    lists[listId].items.push(\"new item\" + lists[listId].items.length);\n  } else {\n    lists[listId].items.splice(i, 0, \"new item\" + lists[listId].items.length);\n  }\n\n  lists[listId].update(createList(listId));\n};\n\nconst removeItem = (listId, i) => {\n  lists[listId].items.splice(i, 1);\n\n  lists[listId].update(createList(listId));\n};\n\n// setInterval(() => {\n//   addNewItem(1)\n// }, 1000);\n\nsetInterval(() => {\n  addNewItem(1, 1);\n  setTimeout(() => removeItem(1, 1), 300);\n}, 2000);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/index.js\n// module id = 1\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })
/******/ ]);