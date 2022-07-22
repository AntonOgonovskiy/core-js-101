/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return { width, height, getArea() { return width * height; } };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.assign(Object.create(proto), JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  err1: 'Element, id and pseudo-element should not occur more then one time inside the selector',
  err2: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
  element(value) {
    if (this.el) {
      throw new Error(this.err1);
    }
    if (this.aidi) {
      throw new Error(this.err2);
    }
    const items = { ...this };
    if (!items.el) {
      items.el = value;
    } else {
      items.el += value;
    }
    return items;
  },

  id(value) {
    if (this.aidi) {
      throw new Error(this.err1);
    }
    if (this.cl || this.pse) {
      throw new Error(this.err2);
    }
    const items = { ...this };
    if (!items.aidi) {
      items.aidi = `#${value}`;
    } else {
      items.aidi += `#${value}`;
    }
    return items;
  },

  class(value) {
    if (this.att) {
      throw new Error(this.err2);
    }
    const items = { ...this };
    if (!items.cl) {
      items.cl = `.${value}`;
    } else {
      items.cl += `.${value}`;
    }
    return items;
  },

  attr(value) {
    if (this.psc) {
      throw new Error(this.err2);
    }
    const items = { ...this };
    if (!items.att) {
      items.att = `[${value}]`;
    } else {
      items.att += `[${value}]`;
    }
    return items;
  },

  pseudoClass(value) {
    if (this.pse) {
      throw new Error(this.err2);
    }
    const items = { ...this };
    if (!items.psc) {
      items.psc = `:${value}`;
    } else {
      items.psc += `:${value}`;
    }
    return items;
  },

  pseudoElement(value) {
    if (this.pse) {
      throw new Error(this.err1);
    }
    const items = { ...this };
    if (!items.pse) {
      items.pse = `::${value}`;
    } else {
      items.pse += `::${value}`;
    }
    return items;
  },

  combine(selector1, combinator, selector2) {
    const items = { ...this };
    const item = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    if (!items.item) {
      items.item = item;
    } else {
      items.item += item;
    }
    return items;
  },
  stringify() {
    if (this.item) return this.item;
    let res = '';
    if (this.el) res += this.el;
    if (this.aidi) res += this.aidi;
    if (this.cl) res += this.cl;
    if (this.att) res += this.att;
    if (this.psc) res += this.psc;
    if (this.pse) res += this.pse;
    return res;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
